import { AppShell, Group, ScrollArea, Transition } from "@mantine/core"
import {
    IconAdjustments,
    IconFileAnalytics,
    IconHelp,
    IconPresentationAnalytics,
    IconUsers,
} from "@tabler/icons-react"
import React, { useContext, useEffect } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { useDesktop } from "src/shared/hooks/useDesktop"
import classes from "src/shared/ui/appNavbar/AppNavbar.module.scss"
import { LogoutButton } from "src/shared/ui/appNavbar/logoutButton/LogoutButton"
import { UserButton } from "src/shared/ui/appNavbar/userButton/UserButton"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"
import { LinksGroup } from "./links/NavbarLinksGroup"

const mockdata = [
    {
        label: "Отчетность",
        icon: IconFileAnalytics,
        links: [
            { label: "Мои отчеты", link: "/reports" },
            { label: "Отчет по внутренней программе", link: "/" },
        ],
    },
    {
        label: "Волонтеры",
        icon: IconUsers,
        links: [
            { label: "Upcoming releases", link: "/" },
            { label: "Previous releases", link: "/" },
            { label: "Releases schedule", link: "/" },
        ],
    },
    { label: "Аналитика", icon: IconPresentationAnalytics },
    { label: "Настройки", icon: IconAdjustments },
    { label: "Написать в поддержку", icon: IconHelp },
]

export const AppNavbar = () => {
    const isDesktop = useDesktop()

    const { menuOpened, setMenuOpened } = useContext(NavbarContext)

    useEffect(() => {
        setMenuOpened(isDesktop)
    }, [isDesktop])

    const links = mockdata.map((item) => (
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
