import { AppShell, AppShellHeader, Group } from "@mantine/core"
import { useContext } from "react"
import { Redirect } from "react-router-dom"
import { UserContext } from "src/app/providers/UserContext"
import PublicRouter from "src/app/router/PublicRouter"
import classes from "src/app/styles/public.module.scss"
import { LocaleSwitcher } from "src/shared/ui/locale/LocaleSwitcher"
import { LoginButton } from "src/shared/ui/loginButton/LoginButton"
import { ThemeSwitcher } from "src/shared/ui/theme/ThemeSwitcher"

// @ts-ignore
const PublicApp = ({ match }) => {
    const { user } = useContext(UserContext)

    if (user) {
        return <Redirect to={`/profile/${user.username}`} />
    }

    return (
        <>
            <AppShell className={classes.appShell}>
                <AppShellHeader className={classes.appShellHeader}>
                    <Group justify="space-between">
                        <Group>
                            <LoginButton />
                        </Group>
                        <Group justify="flex-end">
                            <LocaleSwitcher />
                            <ThemeSwitcher />
                        </Group>
                    </Group>
                </AppShellHeader>
                <Group className={classes.appShellMain}>
                    <PublicRouter match={match} />
                </Group>
            </AppShell>
        </>
    )
}

export default PublicApp
