import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/dropzone/styles.css"
import { Notifications } from "@mantine/notifications"
import { QueryClientProvider } from "@tanstack/react-query"
import { LanguageContextProvider } from "src/app/providers/LocaleContext"
import { UserContextProvider } from "src/app/providers/UserContext"
import RootRouter from "src/app/router/RootRouter"
import { queryClient } from "src/shared/constants/Query"
import { AppShell } from "src/shared/ui/appShell/AppShell"
import { theme } from "src/shared/ui/theme/CustomMantineTheme"
import classes from "./styles/root.module.scss"

/**
 * Root component
 *
 * @returns The root JSX element of the application
 */
export const Root = () => {
    return (
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <QueryClientProvider client={queryClient}>
                <LanguageContextProvider>
                    <AppShell>
                        <Notifications className={classes.notifications} />
                        <UserContextProvider>
                            <RootRouter />
                        </UserContextProvider>
                    </AppShell>
                </LanguageContextProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
