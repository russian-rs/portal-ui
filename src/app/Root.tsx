import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import RootRouter from 'src/app/router/RootRouter'
import { UserContextProvider } from 'src/app/providers/UserContext'
import { LanguageContextProvider } from 'src/app/providers/LocaleContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'src/shared/constants/Query'
import { theme } from 'src/shared/ui/theme/CustomMantineTheme'
import AppHeader from 'src/shared/ui/appHeader/AppHeader'
import AppBody from 'src/shared/ui/appBody/AppBody'
import AppFooter from 'src/shared/ui/appFooter/AppFooter'

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
                    <AppHeader />
                    <AppBody>
                        <UserContextProvider>
                            <RootRouter />
                        </UserContextProvider>
                    </AppBody>
                    <AppFooter />
                </LanguageContextProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
