import { lazy } from "react"
import { RouteProps } from "react-router"
import { ProgramsProvider } from "src/app/providers/ProgramsProvider"
import { ProjectsProvider } from "src/app/providers/ProjectsProvider"
import { PublicProgramsApiService } from "src/shared/api/PublicProgramsApiService"
import { PublicProjectsApiService } from "src/shared/api/PublicProjectsApiService"

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
            <ProgramsProvider apiService={PublicProgramsApiService}>
                <ProjectsProvider apiService={PublicProjectsApiService}>
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
