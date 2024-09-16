import Axios, { AxiosError } from 'axios'
import { SimpleLocalStorageService } from '../localStorage/SimpleLocalStorageService.tsx'
import { LocalStorageKeys } from '../localStorage/constants.ts'
import { history } from '../constants/History'

export const RequestHttp = Axios.create({
    baseURL: '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Cache: 'no-cache',
    },
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
