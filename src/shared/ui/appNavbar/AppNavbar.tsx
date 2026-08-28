import { AppShell, Group, ScrollArea, Transition } from "@mantine/core"
import React, { useContext, useEffect, useMemo } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { UserContext } from "src/app/providers/UserContext"
import { useDesktop } from "src/shared/hooks/useDesktop"
import classes from "src/shared/ui/appNavbar/AppNavbar.module.scss"
import { Content } from "src/shared/ui/appNavbar/Content"
import { LogoutButton } from "src/shared/ui/appNavbar/logoutButton/LogoutButton"
import { UserButton } from "src/shared/ui/appNavbar/userButton/UserButton"
import { AnnouncementBell } from "src/shared/ui/announcements/AnnouncementBell"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"
import { hasPermission } from "src/shared/user/roles"
import { LinksGroup } from "./links/NavbarLinksGroup"
import { useLocation } from "react-router"

export interface ItemProps {
    label: string
    link: string
    roles?: string[]
    hideFrom?: string[]
}

export interface ItemGroupProps {
    icon: React.FC<any>
    label: string
    initiallyOpened?: boolean
    items?: ItemProps[]
    link?: string
    roles?: string[]
}

export const AppNavbar = React.memo(function AppNavbar() {
    const isDesktop = useDesktop()
    const { user } = useContext(UserContext)

    const { menuOpened, setMenuOpened } = useContext(NavbarContext)
    const location = useLocation()

    useEffect(() => {
        setMenuOpened(isDesktop)
    }, [isDesktop])

    // Close navbar on route change for mobile view
    useEffect(() => {
        if (!isDesktop) {
            setMenuOpened(false)
        }
    }, [location.pathname, isDesktop, setMenuOpened])

    const items = useMemo(() => {
        return Content.filter((item) => hasPermission(user, item.roles)).map((item) => (
            <LinksGroup {...item} key={item.label} />
        ))
    }, [user])

    return (
        <Transition mounted={menuOpened} transition="scale-x" timingFunction="ease">
            {(styles) => (
                <AppShell.Navbar style={styles} className={classes.appShellNavbar}>
                    <nav className={classes.navbar}>
                        <div className={classes.header}>
                            <UserButton />
                            <AnnouncementBell />
                        </div>

                        <ScrollArea className={classes.links}>
                            <div className={classes.linksInner}>{items}</div>
                        </ScrollArea>

                        <Group className={classes.footer} justify="space-between">
                            <LogoutButton />
                            <Group justify="flex-end">
                                <LocaleSwitcher />
                                <ThemeSwitcher />
                            </Group>
                        </Group>
                    </nav>
                </AppShell.Navbar>
            )}
        </Transition>
    )
})
