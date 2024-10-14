import { AppShell } from "@mantine/core"
import PrivateRouter from "src/app/router/PrivateRouter"
import classes from "src/app/styles/private.module.scss"
import AppHeader from "src/shared/ui/appHeader/AppHeader"
import { AppNavbar } from "src/shared/ui/appNavbar/AppNavbar"

const PrivateApp = () => {
    return (
        <>
            <AppShell className={classes.appShell}>
                <AppHeader />
                <AppNavbar />
                <AppShell.Main className={classes.appShellMain}>
                    <PrivateRouter />
                </AppShell.Main>
            </AppShell>
        </>
    )
}

export default PrivateApp
