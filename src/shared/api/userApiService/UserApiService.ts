import { UserApi } from '@russian-rs/portal-api-axios'
import { RequestHttp } from 'src/shared/http/RequestHttp.tsx'

export const UserApiService = new UserApi(undefined, undefined, RequestHttp)
