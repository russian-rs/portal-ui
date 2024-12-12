import { PageRequest, PageResponse, UserCreateRequest } from "@russian-rs/portal-api-axios"
import { v4 as uuid } from "uuid"

export const defaultPage: PageRequest = {
    pageNumber: 0,
    pageSize: 10,
    sort: ["version;desc"],
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
    contract: {
        id: uuid(),
        startDate: "",
        endDate: "",
        type: "",
    },
}

export const defaultCreateUserFormValues = {
    firstName: "",
    secondName: "",
    email: "",
    username: "",
}
