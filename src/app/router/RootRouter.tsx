import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"

const PrivateApp = lazy(() => import("src/app/PrivateApp"))
const PublicApp = lazy(() => import("src/app/PublicApp"))
const Login = lazy(() => import("src/pages/login/Login"))
const NotFound = lazy(() => import("src/pages/notFound/NotFound"))
const Unauthorized = lazy(() => import("src/pages/unauthorized/UnauthorizedPage"))

const RootRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingScreen />}>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/welcome" element={<PublicApp />} />
                    <Route path="/not-found" element={<NotFound />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    <Route path="/" element={<Navigate to="/welcome" />} />
                    <Route path="*" element={<PrivateApp />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default RootRouter
