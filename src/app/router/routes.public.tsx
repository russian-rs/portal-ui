import { lazy } from "react"
import { RouteProps } from "react-router"
import { ProgramsProvider } from "src/app/providers/ProgramsProvider"
import { ProjectsProvider } from "src/app/providers/ProjectsProvider"

const Welcome = lazy(() => import("src/pages/welcome/Welcome"))
const Application = lazy(() => import("src/pages/application/Application"))
const ApplicationForm = lazy(() => import("src/pages/application/form/Form"))
const ApplicationStatusView = lazy(() => import("src/pages/application/view/ViewStatus"))

export const routes: RouteProps[] = [
    {
        path: "/application",
        element: <Application />,
    },
    {
        path: "/application/form",
        element: (
            <ProgramsProvider>
                <ProjectsProvider>
                    <ApplicationForm />
                </ProjectsProvider>
            </ProgramsProvider>
        ),
    },
    {
        path: "/application-status/:id",
        element: <ApplicationStatusView />,
    },
    {
        path: "/",
        element: <Welcome />,
    },
]
