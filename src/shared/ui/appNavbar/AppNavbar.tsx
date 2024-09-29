import { AppShell, ScrollArea, Transition } from "@mantine/core"
import {
    IconNotes,
    IconCalendarStats,
    IconGauge,
    IconPresentationAnalytics,
    IconFileAnalytics,
    IconAdjustments,
    IconLock,
} from "@tabler/icons-react"
import { useContext, useEffect } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { useDesktop } from "src/shared/hooks/useDesktop"
import { LinksGroup } from "./links/NavbarLinksGroup"
import classes from "./AppNavbar.module.css"

const mockdata = [
    { label: "Dashboard", icon: IconGauge },
    {
        label: "Market news",
        icon: IconNotes,
        initiallyOpened: true,
        links: [
            { label: "Overview", link: "/" },
            { label: "Forecasts", link: "/" },
            { label: "Outlook", link: "/" },
            { label: "Real time", link: "/" },
        ],
    },
    {
        label: "Releases",
        icon: IconCalendarStats,
        links: [
            { label: "Upcoming releases", link: "/" },
            { label: "Previous releases", link: "/" },
            { label: "Releases schedule", link: "/" },
        ],
    },
    { label: "Analytics", icon: IconPresentationAnalytics },
    { label: "Contracts", icon: IconFileAnalytics },
    { label: "Settings", icon: IconAdjustments },
    {
        label: "Security",
        icon: IconLock,
        links: [
            { label: "Enable 2FA", link: "/" },
            { label: "Change password", link: "/" },
            { label: "Recovery codes", link: "/" },
        ],
    },
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
                            <div className={classes.footer}>Фото</div>
                        </div>

                        <ScrollArea className={classes.links}>
                            <div className={classes.linksInner}>{links}</div>
                        </ScrollArea>
                    </nav>
                </AppShell.Navbar>
            )}
        </Transition>
    )
}
