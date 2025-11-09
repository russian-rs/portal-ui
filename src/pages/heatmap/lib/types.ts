import { PageRequest, PageResponse, UserInfoDto } from "@russian-rs/portal-api-axios"

export interface VolunteerReport {
    id: string
    week: string // Дата начала недели в ISO формате
    hoursSpent: number
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
    onlyActive?: boolean
    onlyInactive?: boolean
}

export interface VolunteerReportPageRequest {
    search?: string
    program?: string
    project?: string
    startDate: string
    pageRequest: PageRequest
    onlyActive?: boolean
    onlyInactive?: boolean
}

export interface VolunteerReportResponse {
    content: VolunteerReportData[]
    page: PageResponse
}
