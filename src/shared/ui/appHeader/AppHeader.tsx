import image from "/resources/pv_logo.png"
import { Anchor, Burger, Group, Image } from "@mantine/core"
import { useContext } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import classes from "./AppHeader.module.css"

export const AppHeader = () => {
    const { menuOpened, setMenuOpened } = useContext(NavbarContext)

    return (
        <>
            <Group grow className={classes.rootGroup}>
                <Group>
                    <Burger
                        opened={menuOpened}
                        onClick={() => setMenuOpened(!menuOpened)}
                        size="sm"
                    />
                    <Anchor href="/">
                        <Image src={image} className={classes.logo} />
                    </Anchor>
                </Group>
            </Group>
        </>
    )
}

export default AppHeader
