import { AnnouncementsApi } from "@russian-rs/portal-api-axios"
import { RequestHttp } from "src/shared/http/RequestHttp"

export const AnnouncementApiService = new AnnouncementsApi(undefined, undefined, RequestHttp)

export type {
    AnnouncementAudience,
    AnnouncementCreateRequest,
    AnnouncementDto,
} from "@russian-rs/portal-api-axios"
