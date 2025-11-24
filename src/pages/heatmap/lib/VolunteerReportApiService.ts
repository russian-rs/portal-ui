import { VolunteerReportPageRequest, VolunteerReportResponse, VolunteerReportData, VolunteerReport } from "./types"
import { PageResponse, UserInfoDto } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"
import dayjs from "dayjs"

export class VolunteerReportApiService {
    static async getVolunteerReports(request: VolunteerReportPageRequest): Promise<VolunteerReportResponse> {
        const { startDate, search, program, project, pageRequest, onlyActive, onlyInactive } = request

        interface HeatMapItem {
            week: number
            weekStart: string
            weekEnd: string
            hoursWorked: number
            hoursRequired: number
        }
        interface VolunteerHeatMapItem {
            volunteerInfo: UserInfoDto
            weeks: HeatMapItem[]
            totalWorked: number
            totalRequired: number
        }
        interface ReportsHeatMapPageResponse {
            content: VolunteerHeatMapItem[]
            page: PageResponse
        }

        const params = new URLSearchParams()
        params.set("searchQuery", search ?? "")
        const pageNumber = String(pageRequest.pageNumber ?? 0)
        const pageSize = String(pageRequest.pageSize ?? 25)
        params.set("pageRequest.pageNumber", pageNumber)
        params.set("pageRequest.pageSize", pageSize)
        params.set("pageNumber", pageNumber)
        params.set("pageSize", pageSize)

        const body: Record<string, unknown> = {
            startDate,
            program: program ?? null,
            project: project ?? null,
        }
        if (onlyActive !== undefined) body.onlyActive = onlyActive
        if (onlyInactive !== undefined) body.onlyInactive = onlyInactive

        const response = await RequestHttp.post<ReportsHeatMapPageResponse>("/reports/heat-map", body, { params })
        const data = response.data

        const content: VolunteerReportData[] = data.content.map((item) => {
            const u = item.volunteerInfo
            const reports: VolunteerReport[] = item.weeks
                .filter((w) => (w.hoursWorked ?? 0) > 0) // игнорируем недели без часов — это «нет отчётов»
                .map((w, idx) => ({
                    id: `${u.username}-${w.weekStart}-${idx}`,
                    week: w.weekStart,
                    hoursSpent: Math.max(0, Math.round(w.hoursWorked)),
                }))
            // Исключаем недели ДО начала первого контракта (чтобы таблица совпадала с теплокартой)
            const earliestContractStart = (u.contracts || [])
                .map((c) => dayjs(c.startDate).startOf("isoWeek"))
                .reduce((min, d) => (min ? (d.isBefore(min) ? d : min) : d), null as dayjs.Dayjs | null)
            const reportsWithinContracts =
                earliestContractStart == null
                    ? []
                    : reports.filter((r) => !dayjs(r.week).startOf("isoWeek").isBefore(earliestContractStart!, "week"))
            return {
                id: u.username,
                fullName: u.fullName,
                email: u.email,
                username: u.username,
                avatar: u.avatar,
                program: u.program,
                project: u.project,
                contracts: u.contracts,
                reports: reportsWithinContracts,
            }
        })

        return { content, page: data.page }
    }
}
