import { OfficialGroupApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const OfficialGroupApiService = new OfficialGroupApi(undefined, undefined, RequestHttp)
