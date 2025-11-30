import { useEffect, useRef } from "react"
import { NO_PROJECT_CODE } from "src/shared/constants/Shared"

export const useSyncProgramByProject = (
    selectedProject: string | null,
    projects: any[],
    programs: any[],
    visibleProjects: any[],
    setSelectedProgram: (p: string | null) => void
) => {
    const lastProjectRef = useRef<string | null>(null)

    useEffect(() => {
        if (selectedProject === lastProjectRef.current) return
        lastProjectRef.current = selectedProject

        if (!selectedProject || selectedProject === NO_PROJECT_CODE) {
            return
        }

        const project =
            visibleProjects.find((p) => p.code === selectedProject) ??
            projects.find((p) => p.code === selectedProject)

        if (!project) return

        const owningProgramCode =
            project.programCode ??
            programs.find((pr) => (pr.projectCodes ?? []).includes(project.code))?.code

        if (!owningProgramCode) return

        const normalizedProgram = owningProgramCode.toUpperCase()

        setSelectedProgram(normalizedProgram)
    }, [selectedProject, projects, programs, visibleProjects, setSelectedProgram])
}