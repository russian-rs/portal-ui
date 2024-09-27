import { AppShell, MantineProvider, useMantineColorScheme } from '@mantine/core'
import '@mantine/core/styles.css'
import RootRouter from 'src/app/router/RootRouter'
import { UserContextProvider } from 'src/app/providers/UserContext'
import { LanguageContextProvider } from 'src/app/providers/LocaleContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'src/shared/constants/Query'
import Footer from 'src/shared/ui/footer/Footer'
import { theme } from 'src/shared/ui/theme/CustomMantineTheme'
import GlobalHeader from 'src/shared/ui/globalHeader/GlobalHeader'

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
                        <AppShell.Header>
                            <GlobalHeader />
                        </AppShell.Header>
                        <AppShell.Main>
                            <UserContextProvider>
                                <RootRouter />
                            </UserContextProvider>
                        </AppShell.Main>
                        <AppShell.Footer withBorder={false}>
                            <Footer />
                        </AppShell.Footer>
                    </AppShell>
                </LanguageContextProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
