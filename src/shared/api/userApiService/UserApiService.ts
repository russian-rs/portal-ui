import { UserApi } from '@russian-rs/portal-api-axios'
import { RequestHttp } from '../../http/RequestHttp.tsx'

export const UserApiService = new UserApi(undefined, undefined, RequestHttp)
