import { lazy } from "react"
import { RouteProps } from "react-router"

const Logout = lazy(() => import("src/pages/logout/Logout"))
const Profile = lazy(() => import("src/pages/profile/Profile"))
const Report = lazy(() => import("src/pages/report/ReportPage"))
const NewReport = lazy(() => import("src/pages/createReport/CreateReport"))
const MyReports = lazy(() => import("src/pages/myReports/MyReports"))
const ReportList = lazy(() => import("src/pages/reports/ReportList"))
const UserList = lazy(() => import("src/pages/users/UserList"))
const PlaygroundsHowto = lazy(() => import("src/pages/playgrounds/PlaygroundsHowto"))
const ExistingApplication = lazy(() => import("src/pages/application/existing/Existing"))

export const routes: RouteProps[] = [
    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "/profile/:login",
        element: <Profile />,
    },
    {
        path: "/report/create",
        element: <NewReport />,
    },
    {
        path: "/report/:id",
        element: <Report />,
    },
    {
        path: "/reports/personal",
        element: <MyReports />,
    },
    {
        path: "/reports",
        element: <ReportList />,
    },
    {
        path: "/volunteers",
        element: <UserList />,
    },
    {
        path: "/playgrounds",
        element: <PlaygroundsHowto />,
    },
    {
        path: "/application",
        element: <ExistingApplication />,
    },
    {
        path: "/",
        element: <MyReports />,
    },
]
