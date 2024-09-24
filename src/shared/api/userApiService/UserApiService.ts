import { UserApi } from '@russian-rs/portal-api-axios'
import { RequestHttp } from 'src/shared/http/RequestHttp'

export const UserApiService = new UserApi(undefined, undefined, RequestHttp)
