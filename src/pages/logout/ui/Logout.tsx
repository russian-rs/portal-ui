import { useEffect } from 'react'
import { UserApiService } from 'src/shared/api/userApiService/UserApiService'
import { LoadingScreen } from 'src/shared/ui/loading-screen/LoadingScreen'
import { SimpleLocalStorageService } from 'src/shared/localStorage/SimpleLocalStorageService'
import { LAST_LOGIN, USER } from 'src/shared/constants/Storage'

export const Logout = () => {
    useEffect(() => {
        UserApiService.logout(true).then(() => {
            SimpleLocalStorageService.removeItem(USER)
            SimpleLocalStorageService.removeItem(LAST_LOGIN)
            window.location.href =
                'https://id.russian.rs/application/o/portal/end-session/'
        })
    }, [])

    return <LoadingScreen />
}
