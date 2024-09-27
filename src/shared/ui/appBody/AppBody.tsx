import { AppBodyContainer } from "src/shared/ui/appBody/AppBody.styles"
import { ReactNode } from "react"

export const AppBody = ({ children }: { children?: ReactNode }) => {
    return <AppBodyContainer>{children}</AppBodyContainer>
}

export default AppBody
