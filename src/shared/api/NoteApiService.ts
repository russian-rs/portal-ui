import { NoteApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const NoteApiService = new NoteApi(undefined, undefined, RequestHttp)
