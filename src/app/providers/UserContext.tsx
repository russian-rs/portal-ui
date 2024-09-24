import React, { createContext, ReactNode, useState } from 'react'
import { UserInfo } from '@russian-rs/portal-api-axios'
import { defaultFunction } from 'src/shared/lib/defaultFunction'

interface UserContextType {
    user: UserInfo | null
    setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>
}

const defaultContextValue: UserContextType = {
    user: null,
    setUser: defaultFunction,
}

export const UserContext = createContext<UserContextType>(defaultContextValue)

export const UserContextProvider = ({ children }: { children?: ReactNode }) => {
    const [user, setUser] = useState<UserInfo | null>(null)

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
}
