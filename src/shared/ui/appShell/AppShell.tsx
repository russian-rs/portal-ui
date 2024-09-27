import { ReactNode } from 'react'
import { AppShellContainer } from 'src/shared/ui/appShell/AppShell.styles'
import AppHeader from 'src/shared/ui/appHeader/AppHeader'
import AppFooter from 'src/shared/ui/appFooter/AppFooter'
import AppBody from 'src/shared/ui/appBody/AppBody'

export const AppShell = ({ children }: { children?: ReactNode }) => {
    return (
        <>
            <AppShellContainer>
                <AppHeader />
                <AppBody>{children}</AppBody>
                <AppFooter />
            </AppShellContainer>
        </>
    )
}

export default AppBody
