import {
    AppShell,
    Box,
    Group,
    rem,
    ScrollArea,
    ThemeIcon,
    Transition,
    UnstyledButton,
} from "@mantine/core"
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
    IconSubmarine,
    IconHelp,
    IconHelmet,
    IconHelpOctagon,
    IconHelpCircle,
    IconUsers,
    IconLogout,
    IconChevronRight,
} from "@tabler/icons-react"
import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { useDesktop } from "src/shared/hooks/useDesktop"
import { UserButton } from "src/shared/ui/appNavbar/userButton/UserButton"
import { LinksGroup } from "./links/NavbarLinksGroup"
import classes from "src/shared/ui/appNavbar/AppNavbar.module.scss"

const mockdata = [
    {
        label: "Отчетность",
        icon: IconFileAnalytics,
        initiallyOpened: true,
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
            { label: "Releases schedule", link: "/" },
            { label: "Releases schedule", link: "/" },
            { label: "Releases schedule", link: "/" },
            { label: "Releases schedule", link: "/" },
            { label: "Releases schedule", link: "/" },
            { label: "Releases schedule", link: "/" },
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

    const history = useHistory()

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

                        <div className={classes.footer}>
                            <UnstyledButton
                                className={classes.control}
                                onClick={() => history.push("/logout")}
                            >
                                <Group justify="space-between" gap={0}>
                                    <Box
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <ThemeIcon
                                            variant="light"
                                            size={30}
                                            color="red"
                                        >
                                            <IconLogout
                                                style={{
                                                    width: rem(18),
                                                    height: rem(18),
                                                }}
                                            />
                                        </ThemeIcon>
                                        <Box ml="md">Выход</Box>
                                    </Box>
                                </Group>
                            </UnstyledButton>
                        </div>
                    </nav>
                </AppShell.Navbar>
            )}
        </Transition>
    )
}
