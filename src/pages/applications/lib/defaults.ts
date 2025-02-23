import { PageRequest, PageResponse } from "@russian-rs/portal-api-axios"

export const defaultPage: PageRequest = {
    pageNumber: 0,
    pageSize: 20,
    sort: ["created;desc"],
}

export const defaultPageResponse: PageResponse = {
    pageNumber: 0,
    pageSize: 20,
    totalPages: 1,
    totalElements: 0,
}
