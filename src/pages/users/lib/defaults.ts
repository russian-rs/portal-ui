import { PageRequest, PageResponse, UserCreateRequest } from "@russian-rs/portal-api-axios"

export const defaultPage: PageRequest = {
    pageNumber: 0,
    pageSize: 10,
}

export const defaultPageResponse: PageResponse = {
    pageNumber: 0,
    pageSize: 10,
    totalPages: 1,
    totalElements: 0,
}

export const defaultCreateRequest: UserCreateRequest = {
    fullName: "",
    email: "",
    username: "",
}

export const defaultCreateUserFormValues = {
    firstName: "",
    secondName: "",
    email: "",
    username: "",
}
