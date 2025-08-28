import { VolunteerReportPageRequest, VolunteerReportResponse, VolunteerReportData, VolunteerReport } from "./types"
import dayjs from "dayjs"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { PageRequest, ReportDto, ReportFilter, UserInfoDto } from "@russian-rs/portal-api-axios"
import { UserApiService } from "src/shared/api/user/UserApiService"

export class VolunteerReportApiService {
    static async getVolunteerReports(request: VolunteerReportPageRequest): Promise<VolunteerReportResponse> {
        const { startDate, search, program, project } = request

        // 1) Собираем отчеты за период с фильтрами программы/проекта
        const reports = await this.fetchReportsForPeriod({
            dateFrom: startDate,
            program: program === undefined ? null : program,
            project: project === undefined ? null : project,
        })

        // 2) Группируем по логину пользователя и агрегируем по неделям
        const aggregatedByUser: Record<string, VolunteerReportData> = {}

        const ensureVolunteer = (user: UserInfoDto) => {
            if (!aggregatedByUser[user.username]) {
                aggregatedByUser[user.username] = {
                    id: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    program: user.program,
                    project: user.project,
                    contracts: user.contracts,
                    reports: [],
                }
            }
            return aggregatedByUser[user.username]
        }

        // Собираем уникальные логины
        const userLogins = Array.from(new Set(reports.map((r) => r.user).filter((u): u is string => !!u)))
        // Резолвим пользователей
        const users = await UserApiService.resolveUsers(userLogins).then((res) => res.data)
        const usernameToUser: Record<string, UserInfoDto> = users.reduce((acc, u) => {
            acc[u.username] = u
            return acc
        }, {} as Record<string, UserInfoDto>)

        // Агрегируем по неделям, используя createTime как принадлежность недели
        for (const report of reports) {
            if (!report.user) continue
            const user = usernameToUser[report.user]
            if (!user) continue

            const container = ensureVolunteer(user)

            const weekStartIso = dayjs(report.createTime).startOf('isoWeek').toISOString()
            const hoursSpent = Math.max(0, Math.round((report.tasks?.reduce((sum, t) => sum + (t.timeSpent || 0), 0) || 0) / 60))

            // Если уже есть запись за эту неделю — суммируем часы
            const existing = container.reports.find((r) => r.week === weekStartIso)
            if (existing) {
                existing.hoursSpent += hoursSpent
                // Обновим статус/время при необходимости
                existing.status = (report.status as any) || existing.status
                if (report.createTime && dayjs(report.createTime).isAfter(existing.createTime)) {
                    existing.createTime = report.createTime
                }
            } else {
                const vReport: VolunteerReport = {
                    id: report.id,
                    week: weekStartIso,
                    hoursSpent,
                    status: (report.status as any) || 'PENDING',
                    createTime: report.createTime || weekStartIso,
                }
                container.reports.push(vReport)
            }
        }

        // 3) Применяем поисковый фильтр по ФИО/почте/логину (клиентская фильтрация)
        let volunteers = Object.values(aggregatedByUser)
        if (search && search.trim()) {
            const q = search.trim().toLowerCase()
            volunteers = volunteers.filter((v) =>
                v.fullName?.toLowerCase().includes(q) ||
                v.email?.toLowerCase().includes(q) ||
                v.username?.toLowerCase().includes(q)
            )
        }

        // 4) Отбрасываем отчеты старше стартовой даты (на случай, если createTime попал до периода)
        const start = dayjs(startDate).startOf('isoWeek')
        volunteers = volunteers.map((v) => ({
            ...v,
            reports: v.reports.filter((r) => !dayjs(r.week).isBefore(start, 'week')),
        }))

        // 5) Пагинация по волонтерам
        const pageNumber = request.pageRequest.pageNumber ?? 0
        const pageSize = request.pageRequest.pageSize ?? 25
        const totalElements = volunteers.length
        const totalPages = Math.ceil(totalElements / pageSize)
        const startIndex = pageNumber * pageSize
        const endIndex = startIndex + pageSize
        const content = volunteers.slice(startIndex, endIndex)

        return {
            content: content.map(v => ({ ...v, id: v.username })),
            page: {
                totalElements,
                totalPages,
                pageNumber,
                pageSize,
            },
        }
    }

    private static async fetchReportsForPeriod(filter: Pick<ReportFilter, 'dateFrom' | 'program' | 'project'>): Promise<ReportDto[]> {
        const pageSize = 200
        let pageNumber = 0
        const collected: ReportDto[] = []

        while (true) {
            const pageRequest: PageRequest = { pageNumber, pageSize }
            const response = await ReportApiService.getReports(pageRequest, filter)
            const data = response.data
            collected.push(...data.content)
            const totalPages = data.page.totalPages ?? 0
            if (pageNumber >= (totalPages - 1) || pageNumber >= 9) { // ограничим до 10 страниц на всякий случай
                break
            }
            pageNumber += 1
        }
        return collected
    }
}

