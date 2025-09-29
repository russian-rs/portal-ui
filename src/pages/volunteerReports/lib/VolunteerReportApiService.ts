import { VolunteerReportPageRequest, VolunteerReportResponse, VolunteerReportData, VolunteerReport } from "./types"
import dayjs from "dayjs"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { PageRequest, ReportDto, ReportFilter, UserInfoDto, UserSearchFilter } from "@russian-rs/portal-api-axios"
import { UserApiService } from "src/shared/api/user/UserApiService"

export class VolunteerReportApiService {
    static async getVolunteerReports(request: VolunteerReportPageRequest): Promise<VolunteerReportResponse> {
        const { startDate, search, program, project } = request

        // 1) Получаем всех волонтеров (активных пользователей)
        const allVolunteers = await this.fetchAllVolunteers({
            program: program === undefined ? null : program,
            project: project === undefined ? null : project,
        })

        // 2) Получаем отчеты за период с фильтрами program/project (меньше запросов)
        const reports = await this.fetchReportsForPeriod({
            dateFrom: startDate,
            program: program === undefined ? null : program,
            project: project === undefined ? null : project,
        })

        // 3) Группируем отчеты по пользователям
        const reportsByUser: Record<string, any[]> = {}
        for (const report of reports) {
            if (!report.user) continue
            if (!reportsByUser[report.user]) {
                reportsByUser[report.user] = []
            }
            reportsByUser[report.user].push(report)
        }

        // 4) Создаем VolunteerReportData для каждого волонтера
        const volunteers: VolunteerReportData[] = allVolunteers.map((user) => {
            const userReports = reportsByUser[user.username] || []
            const volunteerReports: VolunteerReport[] = []

            // Группируем отчеты по неделям
            const reportsByWeek: Record<string, any[]> = {}
            for (const report of userReports) {
                const weekStartIso = dayjs(report.createTime).startOf("isoWeek").toISOString()
                if (!reportsByWeek[weekStartIso]) {
                    reportsByWeek[weekStartIso] = []
                }
                reportsByWeek[weekStartIso].push(report)
            }

            // Создаем агрегированные отчеты по неделям
            for (const [week, weekReports] of Object.entries(reportsByWeek)) {
                const hoursSpent = Math.max(
                    0,
                    Math.round(
                        weekReports.reduce(
                            (sum: number, r: any) =>
                                sum +
                                (r.tasks?.reduce((taskSum: number, t: any) => taskSum + (t.timeSpent || 0), 0) || 0),
                            0
                        ) / 60
                    )
                )

                // Берем последний отчет недели для статуса и времени
                const latestReport = weekReports.reduce((latest, current) =>
                    dayjs(current.createTime).isAfter(dayjs(latest.createTime)) ? current : latest
                )

                volunteerReports.push({
                    id: latestReport.id,
                    week,
                    hoursSpent,
                    status: (latestReport.status as any) || "PENDING",
                    createTime: latestReport.createTime || week,
                })
            }

            // Фильтруем отчеты по стартовой дате
            const start = dayjs(startDate).startOf("isoWeek")
            const filteredReports = volunteerReports.filter((r) => !dayjs(r.week).isBefore(start, "week"))

            return {
                id: user.username,
                fullName: user.fullName,
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                program: user.program,
                project: user.project,
                contracts: user.contracts,
                reports: filteredReports,
            }
        })

        // 5) Применяем поисковый фильтр по ФИО/почте/логину (клиентская фильтрация)
        let filteredVolunteers = volunteers
        if (search && search.trim()) {
            const q = search.trim().toLowerCase()
            filteredVolunteers = volunteers.filter(
                (v) =>
                    v.fullName?.toLowerCase().includes(q) ||
                    v.email?.toLowerCase().includes(q) ||
                    v.username?.toLowerCase().includes(q)
            )
        }

        // 6) Пагинация по волонтерам
        const pageNumber = request.pageRequest.pageNumber ?? 0
        const pageSize = request.pageRequest.pageSize ?? 25
        const totalElements = filteredVolunteers.length
        const totalPages = Math.ceil(totalElements / pageSize)
        const startIndex = pageNumber * pageSize
        const endIndex = startIndex + pageSize
        const content = filteredVolunteers.slice(startIndex, endIndex)

        return {
            content: content.map((v) => ({ ...v, id: v.username })),
            page: {
                totalElements,
                totalPages,
                pageNumber,
                pageSize,
            },
        }
    }

    private static async fetchAllVolunteers(filter: Pick<ReportFilter, "program" | "project">): Promise<UserInfoDto[]> {
        // Получаем всех волонтеров через searchUsers без поиска, но с фильтрами
        const pageSize = 150
        let pageNumber = 0
        const collected: UserInfoDto[] = []

        while (true) {
            const pageRequest: PageRequest = { pageNumber, pageSize }
            const filterWithProgram: UserSearchFilter = {
                program: filter.program === undefined ? null : filter.program,
                project: filter.project === undefined ? null : filter.project,
                onlyInactive: false, // Включаем всех пользователей, не только неактивных
            }

            try {
                const response = await UserApiService.searchUsers("", pageRequest, filterWithProgram)
                const data = response.data
                collected.push(...data.content)

                const totalPages = data.page.totalPages ?? 0
                if (pageNumber >= totalPages - 1 || pageNumber >= 19) {
                    break
                }
                pageNumber += 1
            } catch (error) {
                console.error("Error fetching volunteers:", error)
                break
            }
        }

        return collected
    }

    private static async fetchReportsForPeriod(
        filter: Pick<ReportFilter, "dateFrom" | "program" | "project">
    ): Promise<ReportDto[]> {
        const pageSize = 200
        let pageNumber = 0
        const collected: ReportDto[] = []

        while (true) {
            const pageRequest: PageRequest = { pageNumber, pageSize }
            const response = await ReportApiService.getReports(pageRequest, filter)
            const data = response.data
            collected.push(...data.content)
            const totalPages = data.page.totalPages ?? 0
            if (pageNumber >= totalPages - 1 || pageNumber >= 9) {
                break
            }
            pageNumber += 1
        }
        return collected
    }
}
