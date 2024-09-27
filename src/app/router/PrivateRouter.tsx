import { Redirect, Route, Switch } from "react-router-dom"
import { Suspense, useContext, useMemo } from "react"
import { UserContext } from "src/app/providers/UserContext"
import { routes } from "src/app/router/routes.private"
import { LoadingScreen } from "src/shared/ui/loadingScreen/LoadingScreen"

const PrivateRouter = () => {
    const { user } = useContext(UserContext)
    const pages = useMemo(() => {
        return routes.map((route) => {
            return (
                <Route
                    key={`${route.path}`}
                    exact={Boolean(route.exact)}
                    path={route.path}
                    component={route.component}
                />
            )
        })
    }, [])

    if (!user) {
        return <Redirect to="/login" />
    }

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Switch>
                {pages}
                <Route path="/">
                    <Redirect to="/not-found" />
                </Route>
            </Switch>
        </Suspense>
    )
}

export default PrivateRouter
