import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"

const PrivateApp = lazy(() => import("src/app/PrivateApp"))
const PublicApp = lazy(() => import("src/app/PublicApp"))
const Login = lazy(() => import("src/pages/login/Login"))
const NotFound = lazy(() => import("src/pages/notFound/NotFound"))
const Unauthorized = lazy(() => import("src/pages/unauthorized/UnauthorizedPage"))

const RootRouter = () => {
    return (
        <Router>
            <Suspense>
                <Switch>
                    <Route path="/welcome" component={PublicApp} />
                    <Route path="/not-found" exact component={NotFound} />
                    <Route path="/unauthorized" exact component={Unauthorized} />
                    <Route path="/" exact>
                        <Redirect to="/welcome" />
                    </Route>
                    <Route path="/login" exact component={Login} />
                    <Route path="/" component={PrivateApp} />
                </Switch>
            </Suspense>
        </Router>
    )
}

export default RootRouter
