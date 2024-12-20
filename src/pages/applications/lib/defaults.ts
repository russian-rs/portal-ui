import { PageRequest, PageResponse } from "@russian-rs/portal-api-axios"

export const defaultPage: PageRequest = {
    pageNumber: 0,
    pageSize: 10,
    sort: ["created;desc"],
}

export const defaultPageResponse: PageResponse = {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0,
}
