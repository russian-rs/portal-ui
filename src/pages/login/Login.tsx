import { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "src/app/providers/UserContext"
import { UserApiService } from "src/shared/api/UserApiService"
import { LAST_LOGIN, USER } from "src/shared/constants/Storage"
import { SimpleLocalStorageService } from "src/shared/localStorage/SimpleLocalStorageService"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"

export const Login = () => {
    const history = useHistory()
    const userContext = useContext(UserContext)

    useEffect(() => {
        SimpleLocalStorageService.removeItem(USER)
        SimpleLocalStorageService.removeItem(LAST_LOGIN)
        UserApiService.getCurrentAccount().then((res) => {
            SimpleLocalStorageService.setItem(LAST_LOGIN, new Date())
            const account = res.data
            userContext.setUser(account)
            history.push(`/profile/${account.username}`)
        })
    }, [userContext, history])

    return <LoadingScreen />
}

export default Login
