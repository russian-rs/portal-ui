import { AuthContextProvider } from './providers/AuthContext.tsx'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'

export const Root = () => {
    return (
        <MantineProvider>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </MantineProvider>
    )
}
