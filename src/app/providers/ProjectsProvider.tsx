import { createContext, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { ProjectDto } from "@russian-rs/portal-api-axios"
import { ProjectsApiService } from "src/shared/api/ProjectsApiService"

export const ProjectsContext = createContext<ProjectDto[]>([])

export function ProjectsProvider({ children }: { children: React.ReactNode }) {
    const { data } = useQuery<ProjectDto[]>({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await ProjectsApiService.getProjects()
            return response.data
        },
        staleTime: Infinity,
    })

    return <ProjectsContext.Provider value={data ?? []}>{children}</ProjectsContext.Provider>
}

export function useProjects() {
    return useContext(ProjectsContext)
}
