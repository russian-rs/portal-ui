import { Button, Card, Flex, Pagination, Select, Text } from "@mantine/core"
import { IconMail } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { ReportHeatMapApiService } from "src/shared/api/ReportHeatMapApiService"
import { heatmapTemplates } from "src/shared/email/templates"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { EmailDrawer } from "src/shared/ui/emailModal/EmailDrawer"
import { VolunteerReportFilters } from "./components/VolunteerReportFilters"
import { VolunteerReportHeatmap } from "./components/VolunteerReportHeatmap"
import { defaultPageResponse } from "./lib/defaults"
import { locales } from "./lib/locales"
import { hasAccess } from "./lib/roles"
import classes from "./VolunteerHeatmapPage.module.scss"
import { useProgramProjectFilter } from "src/shared/hooks/useProgramProjectFilter"
import { NO_PROGRAM_CODE, NO_PROJECT_CODE } from "src/shared/constants/Shared"

export const VolunteerHeatmapPage = () => {
    const { user } = useContext(UserContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    setDocumentTitleByLocale(locales.title)

    if (!hasAccess(user)) {
        navigate("/unauthorized")
    }

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [selectedProgram, setSelectedProgram] = useState<string | null>(searchParams.get("program") || null)
    const [selectedProject, setSelectedProject] = useState<string | null>(searchParams.get("project") || null)
    const { programs, projects, visiblePrograms, visibleProjects } = useProgramProjectFilter(
        selectedProgram,
        selectedProject
    )
    const [periodMonths, setPeriodMonths] = useState<string>(searchParams.get("period") || "3")
    const [selectedVolunteers, setSelectedVolunteers] = useState<Set<number>>(new Set())
    const [emailDrawerOpen, setEmailDrawerOpen] = useState(false)

    const [pageRequest, setPageRequest] = useState({
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: 10,
    })

    const handleProgramChange = (newProgram: string | null) => {
        const programChanged = newProgram !== selectedProgram

        setSelectedProgram(newProgram)

        if (programChanged) {
            setSelectedProject(null)
            setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
        }
    }

    const handleProjectChange = (newProject: string | null) => {
        const projectChanged = newProject !== selectedProject

        let nextProgram = selectedProgram

        if (newProject && newProject !== NO_PROJECT_CODE) {
            const project =
                visibleProjects.find((p) => p.code === newProject) ??
                projects.find((p) => p.code === newProject)

            if (project) {
                const owningProgramCode =
                    project.programCode ??
                    programs.find((pr) => (pr.projectCodes ?? []).includes(project.code))?.code

                if (owningProgramCode) {
                    nextProgram = owningProgramCode.toUpperCase()
                }
            }
        }

        setSelectedProject(newProject)
        setSelectedProgram(nextProgram)

        if (projectChanged) {
            setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
        }
    }

    useEffect(() => {
        const id = setTimeout(() => {
            const trimmed = search.trim()
            setDebouncedSearch(trimmed)
            if (trimmed !== debouncedSearch) {
                setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
            }
        }, 400)
        return () => clearTimeout(id)
    }, [search])

    useEffect(() => {
        const params = new URLSearchParams()
        if (debouncedSearch) params.set("search", debouncedSearch)
        if (selectedProgram) params.set("program", selectedProgram)
        if (selectedProject) params.set("project", selectedProject)
        if (periodMonths) params.set("period", periodMonths)
        if (pageRequest.pageNumber > 0) params.set("page", String(pageRequest.pageNumber + 1))
        setSearchParams(params)
        setSelectedVolunteers(new Set())
    }, [debouncedSearch, selectedProgram, selectedProject, periodMonths, pageRequest.pageNumber])

    const getStartDate = () => {
        const now = dayjs()
        switch (periodMonths) {
            case "3":
                return now.subtract(3, "month").startOf("month")
            case "6":
                return now.subtract(6, "month").startOf("month")
            case "year":
                return now.startOf("year")
            default:
                return now.subtract(3, "month").startOf("month")
        }
    }

    const { data: volunteerData } = useQuery({
        queryKey: [
            "volunteerReports",
            debouncedSearch,
            pageRequest.pageNumber,
            pageRequest.pageSize,
            selectedProgram,
            selectedProject,
            periodMonths,
        ],
        queryFn: () =>
            ReportHeatMapApiService.getVolunteerHeatMap(debouncedSearch, pageRequest, {
                program: selectedProgram === NO_PROGRAM_CODE ? "" : selectedProgram || undefined,
                project: selectedProject === NO_PROJECT_CODE ? "" : selectedProject || undefined,
                startDate: getStartDate().format("YYYY-MM-DD"),
            }).then((response) => response.data),
        placeholderData: { content: [], page: defaultPageResponse },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    return (
        <Flex className={classes.root}>
            <Flex direction="column" gap="lg">
                <Text size="xl" fw={700}>
                    <FormattedMessage id={locales.title} />
                </Text>

                <VolunteerReportFilters
                    search={search}
                    onSearchChange={setSearch}
                    selectedProgram={selectedProgram}
                    onProgramChange={handleProgramChange}
                    selectedProject={selectedProject}
                    onProjectChange={handleProjectChange}
                    periodMonths={periodMonths}
                    onPeriodChange={setPeriodMonths}
                    onReset={() => {
                        setSearch("")
                        setSelectedProgram(null)
                        setSelectedProject(null)
                        setPeriodMonths("3")
                        setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
                    }}
                    programsOverride={visiblePrograms}
                    projectsOverride={visibleProjects}
                />

                <Card withBorder p="lg">
                    <VolunteerReportHeatmap
                        volunteers={volunteerData?.content ?? []}
                        startDate={getStartDate()}
                        onVolunteerSelect={(volunteerId: number) => {
                            const next = new Set(selectedVolunteers)
                            if (next.has(volunteerId)) {
                                next.delete(volunteerId)
                            } else {
                                next.add(volunteerId)
                            }
                            setSelectedVolunteers(next)
                        }}
                        selectedVolunteers={selectedVolunteers}
                        totalVolunteers={volunteerData?.page.totalElements ?? 0}
                    />
                    <Flex justify="space-between" align="center" mt="md" gap="md" wrap="wrap">
                        <Flex justify="space-between" align="center" wrap="wrap" gap="md" mb="sm">
                            <Button
                                leftSection={<IconMail size={16} />}
                                disabled={selectedVolunteers.size === 0}
                                onClick={() => setEmailDrawerOpen(true)}
                            >
                                <FormattedMessage id={locales.sendMessage} />
                            </Button>
                        </Flex>
                        <Flex gap="md" align="center">
                            <Select
                                size="sm"
                                label={undefined}
                                aria-label="Per page"
                                value={String(pageRequest.pageSize)}
                                data={[
                                    { value: "10", label: "10" },
                                    { value: "25", label: "25" },
                                    {
                                        value: "50",
                                        label: "50",
                                    },
                                ]}
                                onChange={(value) => {
                                    if (!value) return
                                    setPageRequest((pr) => ({ ...pr, pageNumber: 0, pageSize: Number(value) }))
                                }}
                                w={100}
                            />
                            <Pagination
                                total={volunteerData?.page.totalPages ?? 1}
                                value={(pageRequest.pageNumber ?? 0) + 1}
                                onChange={(page) => setPageRequest((pr) => ({ ...pr, pageNumber: page - 1 }))}
                            />
                        </Flex>
                    </Flex>
                    <EmailDrawer
                        opened={emailDrawerOpen}
                        close={() => setEmailDrawerOpen(false)}
                        templates={heatmapTemplates}
                        recipients={(volunteerData?.content ?? [])
                            .filter((v) => selectedVolunteers.has(v.volunteerInfo.id))
                            .map((v) => ({
                                name: v.volunteerInfo.fullName,
                                email: v.volunteerInfo.email,
                            }))}
                    />
                </Card>
            </Flex>
        </Flex>
    )
}

export default VolunteerHeatmapPage
