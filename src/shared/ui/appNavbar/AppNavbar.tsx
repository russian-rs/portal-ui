import { AppShell, Group, ScrollArea, Transition } from "@mantine/core"
import React, { useContext, useEffect } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { useDesktop } from "src/shared/hooks/useDesktop"
import classes from "src/shared/ui/appNavbar/AppNavbar.module.scss"
import { Content } from "src/shared/ui/appNavbar/Content"
import { LogoutButton } from "src/shared/ui/appNavbar/logoutButton/LogoutButton"
import { UserButton } from "src/shared/ui/appNavbar/userButton/UserButton"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"
import { LinksGroup } from "./links/NavbarLinksGroup"

export const AppNavbar = () => {
    const isDesktop = useDesktop()

    const { menuOpened, setMenuOpened } = useContext(NavbarContext)

    useEffect(() => {
        setMenuOpened(isDesktop)
    }, [isDesktop])

    const links = Content.map((item) => (
        <LinksGroup {...item} key={item.label} />
    ))

    return (
        <Transition
            mounted={menuOpened}
            transition="scale-x"
            timingFunction="ease"
        >
            {(styles) => (
                <AppShell.Navbar
                    style={styles}
                    className={classes.appShellNavbar}
                >
                    <nav className={classes.navbar}>
                        <div className={classes.header}>
                            <UserButton />
                        </div>

                        <ScrollArea className={classes.links}>
                            <div className={classes.linksInner}>{links}</div>
                        </ScrollArea>

                        <Group
                            className={classes.footer}
                            justify="space-between"
                        >
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
}
