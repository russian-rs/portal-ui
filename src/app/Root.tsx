import { MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import RootRouter from 'src/app/router/RootRouter'
import { UserContextProvider } from 'src/app/providers/UserContext'

/**
 * Root component
 *
 * @returns The root JSX element of the application
 */
export const Root = () => {
    return (
        <MantineProvider>
            <UserContextProvider>
                <RootRouter />
            </UserContextProvider>
        </MantineProvider>
    )
}
