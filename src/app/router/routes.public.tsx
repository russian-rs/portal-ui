import { lazy } from "react"
import { RouteProps } from "react-router"

const Welcome = lazy(() => import("src/pages/welcome/Welcome"))
const Application = lazy(() => import("src/pages/application/Application"))

export const routes: RouteProps[] = [
    {
        path: "/application",
        element: <Application />,
    },
    {
        path: "/",
        element: <Welcome />,
    },
]
