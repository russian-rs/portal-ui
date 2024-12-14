import { lazy } from "react"
import { RouteProps } from "react-router"

const Welcome = lazy(() => import("src/pages/welcome/Welcome"))
const Application = lazy(() => import("src/pages/application/Application"))
const ApplicationForm = lazy(() => import("src/pages/application/form/Form"))

export const routes: RouteProps[] = [
    {
        path: "/application",
        element: <Application />,
    },
    {
        path: "/application/form",
        element: <ApplicationForm />,
    },
    {
        path: "/",
        element: <Welcome />,
    },
]
