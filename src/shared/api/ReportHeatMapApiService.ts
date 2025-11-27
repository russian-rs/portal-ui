import { ReportHeatMapApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const ReportHeatMapApiService = new ReportHeatMapApi(undefined, undefined, RequestHttp)
