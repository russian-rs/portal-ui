import { ApplicationApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const PrivateApplicationApiService = new ApplicationApi(undefined, undefined, RequestHttp)
