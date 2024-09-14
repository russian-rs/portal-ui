import { createContext, ReactNode, useEffect, useState } from 'react'
import { UserInfo } from '@russian-rs/portal-api-axios'
import { UserApiService } from '../../shared/api/userApiService/UserApiService.ts'
import { SimpleLocalStorageService } from '../../shared/localStorage/SimpleLocalStorageService.tsx'
import { LocalStorageKeys } from '../../shared/localStorage/constants.ts'

export const AuthContext = createContext<UserInfo | null>(null)

export const AuthContextProvider = ({ children }: { children?: ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(null)

    useEffect(() => {
        UserApiService.info().then((res) => {
            setUser(res.data)
            SimpleLocalStorageService.setItem(LocalStorageKeys.user, res.data)
        })
    }, [])

    if (!user) {
        return <div>Загрузка...</div>
    }

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}
