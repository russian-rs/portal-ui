import { lazy } from "react"
import { RouteProps } from "react-router-dom"

const Welcome = lazy(() => import("src/pages/welcome"))
const Application = lazy(() => import("src/pages/application"))

export const routes: RouteProps[] = [
    {
        path: "/application",
        exact: true,
        component: Application,
    },
    {
        path: "/",
        exact: true,
        component: Welcome,
    },
]
