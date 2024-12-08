import { Suspense, useMemo } from "react"
import { Navigate, Route, Routes } from "react-router"
import { routes } from "src/app/router/routes.public"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"

const PublicRouter = () => {
    const pages = useMemo(() => {
        return routes.map((route) => {
            return <Route key={route.path} path={route.path} element={route.element} />
        })
    }, [])

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {pages}
                <Route path="*" element={<Navigate to="/not-found" replace={true} />} />
            </Routes>
        </Suspense>
    )
}

export default PublicRouter
