import { TicketsApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const TicketApiService = new TicketsApi(undefined, undefined, RequestHttp)
