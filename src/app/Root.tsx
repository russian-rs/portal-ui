import { AuthContextProvider } from './providers/AuthContext.tsx'
import App from './App.tsx'
import { MantineProvider } from '@mantine/core'
import { CsrfContextProvider } from './providers/CsrfContext.tsx'

export const Root = () => {
    return (
        <MantineProvider>
            <AuthContextProvider>
                <CsrfContextProvider>
                    <App />
                </CsrfContextProvider>
            </AuthContextProvider>
        </MantineProvider>
    )
}
