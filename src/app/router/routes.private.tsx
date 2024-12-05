import { lazy } from "react"
import { RouteProps } from "react-router-dom"

const Logout = lazy(() => import("src/pages/logout/Logout"))
const Profile = lazy(() => import("src/pages/profile/Profile"))
const Report = lazy(() => import("src/pages/report/ReportPage"))
const NewReport = lazy(() => import("src/pages/createReport/CreateReport"))
const MyReports = lazy(() => import("src/pages/myReports/MyReports"))
const ReportList = lazy(() => import("src/pages/reports/ReportList"))
const UserList = lazy(() => import("src/pages/users/UserList"))

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
        path: "/report/create",
        exact: true,
        component: NewReport,
    },
    {
        path: "/report/:id",
        exact: true,
        component: Report,
    },
    {
        path: "/reports/personal",
        exact: true,
        component: MyReports,
    },
    {
        path: "/reports",
        exact: true,
        component: ReportList,
    },
    {
        path: "/volunteers",
        exact: true,
        component: UserList,
    },
]
