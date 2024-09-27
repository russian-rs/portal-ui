import { useContext, useEffect } from 'react'
import { UserApiService } from 'src/shared/api/userApiService/UserApiService'
import { UserContext } from 'src/app/providers/UserContext'
import { LoadingScreen } from 'src/shared/ui/loadingScreen/LoadingScreen'
import { useHistory } from 'react-router-dom'
import { SimpleLocalStorageService } from 'src/shared/localStorage/SimpleLocalStorageService'
import { LAST_LOGIN, USER } from 'src/shared/constants/Storage'

export const Login = () => {
    const history = useHistory()
    const userContext = useContext(UserContext)

    useEffect(() => {
        SimpleLocalStorageService.removeItem(USER)
        SimpleLocalStorageService.removeItem(LAST_LOGIN)
        UserApiService.info().then((res) => {
            SimpleLocalStorageService.setItem(LAST_LOGIN, new Date())
            userContext.setUser(res.data)
            history.push('/profile')
        })
    }, [userContext, history])

    return <LoadingScreen />
}
