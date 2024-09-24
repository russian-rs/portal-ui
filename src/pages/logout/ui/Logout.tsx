import { useEffect } from 'react'
import { UserApiService } from 'src/shared/api/userApiService/UserApiService'
import { LoadingScreen } from 'src/shared/ui/loading-screen/LoadingScreen'

export const Logout = () => {
    useEffect(() => {
        UserApiService.logout(true).then(() => {
            window.location.href =
                'https://id.russian.rs/application/o/portal/end-session/'
        })
    }, [])

    return <LoadingScreen />
}
