import { MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/dropzone/styles.css"
import "@mantine/tiptap/styles.css"
import "react-day-picker/style.css"
import { Notifications } from "@mantine/notifications"
import { QueryClientProvider } from "@tanstack/react-query"
import dayjs from "dayjs"
import isoWeek from "dayjs/plugin/isoWeek"
import isoWeekInYear from "dayjs/plugin/isoWeeksInYear"
import weekOfYear from "dayjs/plugin/weekOfYear"
import { LanguageContextProvider } from "src/app/providers/LocaleContext"
import { UserContextProvider } from "src/app/providers/UserContext"
import RootRouter from "src/app/router/RootRouter"
import { queryClient } from "src/shared/constants/Query"
import { AppShell } from "src/shared/ui/appShell/AppShell"
import { theme } from "src/shared/ui/theme/CustomMantineTheme"
import classes from "./styles/root.module.scss"
import { ProgramsProvider } from "src/app/providers/ProgramsProvider"

/**
 * Root component
 *
 * @returns The root JSX element of the application
 */
export const Root = () => {
    dayjs.extend(weekOfYear)
    dayjs.extend(isoWeek)
    dayjs.extend(isoWeekInYear)

    return (
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <QueryClientProvider client={queryClient}>
                <LanguageContextProvider>
                    <UserContextProvider>
                        <ProgramsProvider>
                            <AppShell>
                                <Notifications className={classes.notifications} />
                                <RootRouter />
                            </AppShell>
                        </ProgramsProvider>
                    </UserContextProvider>
                </LanguageContextProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
