import { Suspense, useContext, useMemo } from "react"
import { Navigate, Route, Routes } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { routes } from "src/app/router/routes.private"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"

const PrivateRouter = () => {
    const { user } = useContext(UserContext)
    const pages = useMemo(() => {
        return routes.map((route) => {
            return <Route key={route.path} path={route.path} element={route.element} />
        })
    }, [])

    if (!user) {
        return <Navigate to="/login" />
    }

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {pages}
                <Route path="*" element={<Navigate to="/not-found" replace={true} />} />
            </Routes>
        </Suspense>
    )
}

export default PrivateRouter
