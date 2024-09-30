import { useContext, useEffect } from "react"
import { Redirect } from "react-router-dom"
import { NavbarContext } from "src/app/providers/NavbarProvider"
import { UserContext } from "src/app/providers/UserContext"
import PublicRouter from "src/app/router/PublicRouter"

// @ts-ignore
const PublicApp = ({ match }) => {
    const { setMenuVisible } = useContext(NavbarContext)
    const { user } = useContext(UserContext)

    useEffect(() => {
        setMenuVisible(false)
    }, [setMenuVisible])

    if (user) {
        return <Redirect to="/profile" />
    }

    return (
        <>
            <PublicRouter match={match} />
        </>
    )
}

export default PublicApp
