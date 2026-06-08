import { ProjectsApi } from "@russian-rs/portal-api-axios"
import { PublicRequestHttp } from "src/shared/http/PublicRequestHttp"

export const PublicProjectsApiService = new ProjectsApi(undefined, undefined, PublicRequestHttp)
