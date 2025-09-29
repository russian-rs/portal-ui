import { PageRequest, UserInfoDto } from "@russian-rs/portal-api-axios"

export interface VolunteerReport {
    id: string
    week: string // Дата начала недели в ISO формате
    hoursSpent: number
    status: "PENDING" | "APPROVED" | "REJECTED"
    createTime: string
}

export type VolunteerReportData = {
    id: string // используем username как стабильный строковый идентификатор
} & Pick<UserInfoDto, "fullName" | "email" | "username" | "avatar" | "program" | "project" | "contracts"> & {
        reports: VolunteerReport[]
    }

export interface VolunteerReportFilter {
    search?: string
    program?: string
    project?: string
    startDate: string
}

export interface VolunteerReportPageRequest {
    search?: string
    program?: string
    project?: string
    startDate: string
    pageRequest: PageRequest
}

export interface VolunteerReportResponse {
    content: VolunteerReportData[]
    page: {
        totalElements: number
        totalPages: number
        pageNumber: number
        pageSize: number
    }
}
