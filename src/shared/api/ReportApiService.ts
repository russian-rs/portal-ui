import { ReportApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const ReportApiService = new ReportApi(undefined, undefined, RequestHttp)
