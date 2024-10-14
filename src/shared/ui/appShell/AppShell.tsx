import { ReactNode } from "react"
import { NavbarContextProvider } from "src/app/providers/NavbarProvider"
import AppBody from "src/shared/ui/appBody/AppBody"
import AppFooter from "src/shared/ui/appFooter/AppFooter"
import { AppShellContainer } from "src/shared/ui/appShell/AppShell.styles"

export const AppShell = ({ children }: { children?: ReactNode }) => {
    return (
        <>
            <NavbarContextProvider>
                <AppShellContainer>
                    <AppBody>{children}</AppBody>
                    <AppFooter />
                </AppShellContainer>
            </NavbarContextProvider>
        </>
    )
}

export default AppBody
