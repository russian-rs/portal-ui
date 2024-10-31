import { useEffect } from "react"
import { UserApiService } from "src/shared/api/UserApiService"
import { LAST_LOGIN, USER } from "src/shared/constants/Storage"
import { SimpleLocalStorageService } from "src/shared/localStorage/SimpleLocalStorageService"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"

export const Logout = () => {
    useEffect(() => {
        UserApiService.logout(true).then(() => {
            SimpleLocalStorageService.removeItem(USER)
            SimpleLocalStorageService.removeItem(LAST_LOGIN)
            window.location.href =
                "https://id.russian.rs/application/o/portal/end-session/"
        })
    }, [])

    return <LoadingScreen />
}

export default Logout
