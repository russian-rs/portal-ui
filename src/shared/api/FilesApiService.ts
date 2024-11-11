import { FilesApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const FilesApiService = new FilesApi(undefined, undefined, RequestHttp)
