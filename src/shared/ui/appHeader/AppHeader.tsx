import image from "/resources/pv_logo.png"
import { Anchor, Burger, Group, Image, Text } from "@mantine/core"
import { useContext } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import classes from "src/shared/ui/appHeader/AppHeader.module.scss"
import { Link } from "react-router"
import { AnnouncementBell } from "src/shared/ui/announcements/AnnouncementBell"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"

export const AppHeader = () => {
    const { menuOpened, setMenuOpened } = useContext(NavbarContext)
    const intl = useIntl()

    return (
        <>
            <Group className={classes.rootGroup}>
                <Burger
                    opened={menuOpened}
                    onClick={() => setMenuOpened(!menuOpened)}
                    size="sm"
                    aria-label={intl.formatMessage({ id: "design.navigation" })}
                />
                <Anchor component={Link} to="/" className={classes.brand} underline="never">
                    <Image src={image} className={classes.logo} alt="RDS" />
                    <Text className={classes.brandText}>
                        <FormattedMessage id="design.portal" />
                    </Text>
                </Anchor>
                <Group className={classes.actions}>
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                    <AnnouncementBell />
                </Group>
            </Group>
        </>
    )
}

export default AppHeader
