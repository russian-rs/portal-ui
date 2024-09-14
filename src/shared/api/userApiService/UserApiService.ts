import { UserApi } from '@russian-rs/portal-api-axios'
import { RequestHttp } from '../../http/RequestHttp.ts'

export const UserApiService = new UserApi(undefined, undefined, RequestHttp)
