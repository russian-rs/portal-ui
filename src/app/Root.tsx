import { AuthContextProvider } from './providers/AuthContext.tsx'
import App from './App.tsx'

export const Root = () => {
    return (
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    )
}
