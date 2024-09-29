import React, { createContext, ReactNode, useState } from "react"
import { defaultFunction } from "src/shared/lib/defaultFunction"

interface NavbarContextType {
    menuOpened: boolean
    setMenuOpened: React.Dispatch<React.SetStateAction<boolean>>
    menuVisible: boolean
    setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const defaultContextValue: NavbarContextType = {
    menuOpened: false,
    setMenuOpened: defaultFunction,
    menuVisible: false,
    setMenuVisible: defaultFunction,
}

export const NavbarContext =
    createContext<NavbarContextType>(defaultContextValue)

export const NavbarContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const [opened, setOpened] = useState(true)
    const [visible, setVisible] = useState(false)

    return (
        <NavbarContext.Provider
            value={{
                menuOpened: opened,
                setMenuOpened: setOpened,
                menuVisible: visible,
                setMenuVisible: setVisible,
            }}
        >
            {children}
        </NavbarContext.Provider>
    )
}
