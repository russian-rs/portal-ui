import { Anchor, Burger, Group, Image } from "@mantine/core"
import { useContext } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import image from "/resources/pv_logo.png"
import classes from "./AppHeader.module.css"

export const AppHeader = () => {
    const { menuOpened, setMenuOpened, menuVisible } = useContext(NavbarContext)

    return (
        <>
            <Group grow className={classes.rootGroup}>
                <Group>
                    {menuVisible ? (
                        <Burger
                            opened={menuOpened}
                            onClick={() => setMenuOpened(!menuOpened)}
                            size="sm"
                        />
                    ) : (
                        <></>
                    )}
                    <Anchor href="/">
                        <Image src={image} className={classes.logo} />
                    </Anchor>
                </Group>
                <Group justify="flex-end">
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                </Group>
            </Group>
        </>
    )
}

export default AppHeader
