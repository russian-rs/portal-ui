import { MailApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const MailApiService = new MailApi(undefined, undefined, RequestHttp)
