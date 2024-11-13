import { lazy } from "react"
import { RouteProps } from "react-router-dom"

const Logout = lazy(() => import("src/pages/logout/Logout"))
const Profile = lazy(() => import("src/pages/profile/Profile"))
const NewReport = lazy(() => import("src/pages/createReport/CreateReport"))

export const routes: RouteProps[] = [
    {
        path: "/logout",
        exact: true,
        component: Logout,
    },
    {
        path: "/profile/:login",
        exact: true,
        component: Profile,
    },
    {
        path: "/reports/create",
        exact: true,
        component: NewReport,
    },
]
