import Axios, { AxiosError } from 'axios'
import { SimpleLocalStorageService } from 'src/shared/localStorage/SimpleLocalStorageService'
import { LocalStorageKeys } from 'src/shared/localStorage/constants'
import { history } from 'src/shared/constants/History'

export const RequestHttp = Axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cache: 'no-cache',
    },
    withXSRFToken: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
})

RequestHttp.interceptors.response.use(
    (res) => {
        return res
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            SimpleLocalStorageService.removeItem(LocalStorageKeys.user)
            history.replace({
                pathname: '/api/oauth2/login/authentik',
            })
            location.reload()
        }
        return Promise.reject(error)
    }
)
