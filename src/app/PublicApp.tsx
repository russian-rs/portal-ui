import { useContext } from "react"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import PublicRouter from "src/app/router/PublicRouter"

// @ts-ignore
const PublicApp = ({ match }) => {
    const { setMenuVisible } = useContext(NavbarContext)

    setMenuVisible(false)

    return (
        <>
            <PublicRouter match={match} />
        </>
    )
}

export default PublicApp
