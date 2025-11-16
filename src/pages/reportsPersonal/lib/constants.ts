import { PageRequest, PageResponse, ReportFilter } from "@russian-rs/portal-api-axios"

export const locales = {
    documentTitle: "pages.my-reports.title",
    total: "pages.my-reports.total",
    filters: "pages.my-reports.filters",
    resetFilters: "common.reset-filters",
    newReport: "pages.my-reports.new-report",
    reportCreated: "pages.my-reports.report.created",
    reportStatus: "pages.my-reports.report.status",
    reportTaskCount: "pages.my-reports.report.task-count",
    reportTimeSpent: "pages.my-reports.report.time-spent",
    reportWeek: "pages.my-reports.report.week",
    emptyReports: "pages.my-reports.empty-reports",
}

export const defaultPage: PageRequest = {
    pageNumber: 0,
    pageSize: 5,
    sort: ["createTime;desc"],
}

export const defaultPageResponse: PageResponse = {
    pageNumber: 0,
    pageSize: 5,
    totalPages: 1,
    totalElements: 0,
}

export const defaultFilter: ReportFilter = {
    login: null,
    dateFrom: null,
    dateTo: null,
    status: null,
    program: null,
}
