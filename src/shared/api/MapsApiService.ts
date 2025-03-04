import { MapsApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const MapsApiService = new MapsApi(undefined, undefined, RequestHttp)
