import { Redirect, Route, Switch } from 'react-router-dom'
import { Suspense, useMemo } from 'react'
import { routes } from 'src/app/router/routes.public'
import { LoadingScreen } from 'src/shared/ui/loadingScreen/LoadingScreen'

// @ts-ignore
const PublicRouter = ({ match }) => {
    const pages = useMemo(() => {
        return routes.map((route) => {
            const path = `${match.path}${route.path}`
            return (
                <Route
                    key={path}
                    exact={Boolean(route.exact)}
                    path={path}
                    component={route.component}
                />
            )
        })
    }, [])

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Switch>
                {pages}
                <Route path="*">
                    <Redirect to="/not-found" />
                </Route>
            </Switch>
        </Suspense>
    )
}

export default PublicRouter
