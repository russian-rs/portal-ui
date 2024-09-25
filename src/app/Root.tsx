import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import RootRouter from 'src/app/router/RootRouter'
import { UserContextProvider } from 'src/app/providers/UserContext'
import { LanguageContextProvider } from 'src/app/providers/LocaleContext'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from 'src/shared/constants/Query'

/**
 * Root component
 *
 * @returns The root JSX element of the application
 */
export const Root = () => {
    return (
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                <LanguageContextProvider>
                    <UserContextProvider>
                        <RootRouter />
                    </UserContextProvider>
                </LanguageContextProvider>
            </QueryClientProvider>
        </MantineProvider>
    )
}
