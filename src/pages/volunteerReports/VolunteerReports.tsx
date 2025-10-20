import { Card, Flex, Paper, Text, Button, Pagination } from "@mantine/core"
import { IconMail } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { hasAccess } from "./lib/roles"
import { locales } from "./lib/locales"
import { defaultPageResponse } from "./lib/defaults"
import { VolunteerReportApiService } from "./lib/VolunteerReportApiService"
import { VolunteerReportData } from "./lib/types"
import { VolunteerReportFilters } from "./components/VolunteerReportFilters"
import { VolunteerReportHeatmap } from "./components/VolunteerReportHeatmap"
import { VolunteerReportTable } from "./components/VolunteerReportTable"
import { VolunteerEmailDrawer } from "./components/VolunteerEmailDrawer"
import classes from "./VolunteerReports.module.scss"

export const VolunteerReports = () => {
    const { user } = useContext(UserContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const intl = useIntl()

    setDocumentTitleByLocale(locales.title)

    if (!hasAccess(user)) {
        navigate("/unauthorized")
    }

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [selectedProgram, setSelectedProgram] = useState<string | null>(searchParams.get("program") || null)
    const [selectedProject, setSelectedProject] = useState<string | null>(searchParams.get("project") || null)
    const [periodMonths, setPeriodMonths] = useState<string>(searchParams.get("period") || "3")

    const [pageRequest, setPageRequest] = useState({
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: 10,
    })

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
            VolunteerReportApiService.getVolunteerReports({
                search: debouncedSearch,
                program: selectedProgram === "NO_PROGRAM" ? "" : selectedProgram || undefined,
                project: selectedProject === "NO_PROJECT" ? "" : selectedProject || undefined,
                startDate: getStartDate().toISOString(),
                pageRequest,
            }),
        placeholderData: { content: [], page: defaultPageResponse },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        // первый запрос выполнится при монтировании, далее не перезапрашиваем без изменения ключа
    })

    const [selectedVolunteers, setSelectedVolunteers] = useState<Set<string>>(new Set())
    const [emailDrawerOpen, setEmailDrawerOpen] = useState(false)

    const handleSelectVolunteer = (volunteerId: string, checked: boolean) => {
        setSelectedVolunteers((prev) => {
            const next = new Set(prev)
            if (checked) {
                next.add(volunteerId)
            } else {
                next.delete(volunteerId)
            }
            return next
        })
    }

    return (
        <div className={classes.root}>
            <Flex direction="column" gap="lg">
                <Text size="xl" fw={700}>
                    <FormattedMessage id={locales.title} />
                </Text>

                <VolunteerReportFilters
                    search={search}
                    onSearchChange={setSearch}
                    selectedProgram={selectedProgram}
                    onProgramChange={setSelectedProgram}
                    selectedProject={selectedProject}
                    onProjectChange={setSelectedProject}
                    periodMonths={periodMonths}
                    onPeriodChange={setPeriodMonths}
                    onReset={() => {
                        setSearch("")
                        setSelectedProgram(null)
                        setSelectedProject(null)
                        setPeriodMonths("3")
                        setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
                    }}
                />

                <Card withBorder p="lg">
                    <Flex justify="center" align="center" wrap="wrap" gap="md">
                        <Text size="lg" fw={600} mb="md">
                            <FormattedMessage id={locales.heatmap} />
                        </Text>
                    </Flex>
                    {(() => {
                        const base = (volunteerData?.content ?? []) as VolunteerReportData[]
                        let augmented = base
                        if (import.meta.env.MODE !== "production") {
                            const start = getStartDate().startOf("isoWeek")
                            const end = dayjs().startOf("isoWeek")
                            const totalWeeks = end.diff(start, "week") + 1
                            const reports = Array.from({ length: Math.max(totalWeeks, 0) }).map((_, idx) => {
                                const weekStart = start.clone().add(idx, "week").toISOString()
                                return {
                                    id: `demo-${idx}`,
                                    week: weekStart,
                                    hoursSpent: 12,
                                    status: "APPROVED" as const,
                                    createTime: weekStart,
                                }
                            })
                            const demo: VolunteerReportData = {
                                id: "demo_all_ok",
                                fullName: "Demo Volunteer (All OK)",
                                email: "demo@example.com",
                                username: "demo_all_ok",
                                avatar: null as any,
                                program: undefined,
                                project: undefined,
                                contracts: [
                                    { id: 1, startDate: start.toISOString(), endDate: end.toISOString() } as any,
                                ],
                                reports,
                            }
                            augmented = [...base, demo]
                        }
                        return (
                            <VolunteerReportHeatmap
                                volunteers={augmented}
                                startDate={getStartDate()}
                                onVolunteerSelect={(volunteerId: string) => {
                                    const next = new Set(selectedVolunteers)
                                    if (next.has(volunteerId)) next.delete(volunteerId)
                                    else next.add(volunteerId)
                                    setSelectedVolunteers(next)
                                }}
                                selectedVolunteers={selectedVolunteers}
                                totalVolunteers={volunteerData?.page.totalElements ?? 0}
                            />
                        )
                    })()}
                    <Flex justify="center" mt="md">
                        <Pagination
                            total={volunteerData?.page.totalPages ?? 1}
                            value={(pageRequest.pageNumber ?? 0) + 1}
                            onChange={(page) => setPageRequest((pr) => ({ ...pr, pageNumber: page - 1 }))}
                        />
                    </Flex>
                </Card>

                <Card withBorder p="lg">
                    <Flex justify="space-between" align="center" mb="md">
                        <div />
                        <Button
                            leftSection={<IconMail size={16} />}
                            disabled={selectedVolunteers.size === 0}
                            onClick={() => setEmailDrawerOpen(true)}
                        >
                            <FormattedMessage id={locales.sendMessage} />
                        </Button>
                    </Flex>
                    {(() => {
                        const base = (volunteerData?.content ?? []) as VolunteerReportData[]
                        let augmented = base
                        if (import.meta.env.MODE !== "production") {
                            const start = getStartDate().startOf("isoWeek")
                            const end = dayjs().startOf("isoWeek")
                            const totalWeeks = end.diff(start, "week") + 1
                            const reports = Array.from({ length: Math.max(totalWeeks, 0) }).map((_, idx) => {
                                const weekStart = start.clone().add(idx, "week").toISOString()
                                return {
                                    id: `demo-${idx}`,
                                    week: weekStart,
                                    hoursSpent: 12,
                                    status: "APPROVED" as const,
                                    createTime: weekStart,
                                }
                            })
                            const demo: VolunteerReportData = {
                                id: "demo_all_ok",
                                fullName: "Demo Volunteer (All OK)",
                                email: "demo@example.com",
                                username: "demo_all_ok",
                                avatar: null as any,
                                program: undefined,
                                project: undefined,
                                contracts: [
                                    { id: 1, startDate: start.toISOString(), endDate: end.toISOString() } as any,
                                ],
                                reports,
                            }
                            augmented = [...base, demo]
                        }
                        return (
                            <VolunteerReportTable
                                volunteers={augmented}
                                selectedVolunteers={selectedVolunteers}
                                onVolunteerSelect={handleSelectVolunteer}
                                startDate={getStartDate()}
                                onVolunteerClick={(id: string) => console.log("open volunteer", id)}
                            />
                        )
                    })()}
                    <Flex justify="center" mt="md">
                        <Pagination
                            total={volunteerData?.page.totalPages ?? 1}
                            value={(pageRequest.pageNumber ?? 0) + 1}
                            onChange={(page) => setPageRequest((pr) => ({ ...pr, pageNumber: page - 1 }))}
                        />
                    </Flex>
                    <VolunteerEmailDrawer
                        opened={emailDrawerOpen}
                        close={() => setEmailDrawerOpen(false)}
                        recipients={(volunteerData?.content ?? [])
                            .filter((v: VolunteerReportData) => selectedVolunteers.has(v.id) && !!v.email)
                            .map((v: VolunteerReportData) => ({ name: v.fullName, email: v.email }))}
                        subject={intl.formatMessage({ id: "pages.volunteer-reports.email-subject" })}
                    />
                </Card>
            </Flex>
        </div>
    )
}

export default VolunteerReports
