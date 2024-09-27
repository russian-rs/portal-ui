import { lazy, Suspense } from "react"
import {
    Redirect,
    Route,
    BrowserRouter as Router,
    Switch,
} from "react-router-dom"
import NotFound from "src/shared/ui/notFound"

const PrivateApp = lazy(() => import("src/app/PrivateApp"))
const PublicApp = lazy(() => import("src/app/PublicApp"))
const Login = lazy(() => import("src/pages/login"))

const RootRouter = () => {
    return (
        <Router>
            <Suspense>
                <Switch>
                    <Route path="/welcome" component={PublicApp} />
                    <Route path="/not-found" exact component={NotFound} />
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
