import { useContext, useEffect } from 'react'
import { UserApiService } from 'src/shared/api/userApiService/UserApiService'
import { UserContext } from 'src/app/providers/UserContext'
import { LoadingScreen } from 'src/shared/ui/loading-screen/LoadingScreen'
import { useHistory } from 'react-router-dom'

export const Login = () => {
    const history = useHistory()
    const userContext = useContext(UserContext)

    useEffect(() => {
        UserApiService.info().then((res) => {
            userContext.setUser(res.data)
            history.push('/profile')
        })
    }, [userContext, history])

    return <LoadingScreen />
}
