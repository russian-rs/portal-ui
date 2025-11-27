import { Button, Card, Flex, Pagination, Select, Text } from "@mantine/core"
import { IconMail } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
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

export const VolunteerHeatmapPage: React.FC = () => {
    const { user } = useContext(UserContext)
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()

    setDocumentTitleByLocale(locales.title)

    useEffect(() => {
        if (!hasAccess(user)) {
            navigate("/unauthorized", { replace: true })
        }
    }, [user, navigate])

    // --- фильтры / состояние ---

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    const [selectedProgram, setSelectedProgram] = useState<string | null>(searchParams.get("program") || null)
    const [selectedProject, setSelectedProject] = useState<string | null>(searchParams.get("project") || null)
    const [periodMonths, setPeriodMonths] = useState<string>(searchParams.get("period") || "3")

    const [selectedVolunteers, setSelectedVolunteers] = useState<Set<number>>(() => new Set())
    const [emailDrawerOpen, setEmailDrawerOpen] = useState(false)

    const [pageRequest, setPageRequest] = useState({
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: 10,
    })

    // --- дебаунс поиска ---

    useEffect(() => {
        const trimmed = search.trim()
        const id = window.setTimeout(() => {
            setDebouncedSearch((prev) => {
                // если строка реально изменилась — сбросить страницу
                if (prev !== trimmed) {
                    setPageRequest((prevPage) => ({ ...prevPage, pageNumber: 0 }))
                }
                return trimmed
            })
        }, 400)

        return () => {
            window.clearTimeout(id)
        }
    }, [search])

    // --- вычисление периода и стартовой даты ---

    const startDate = useMemo(() => {
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
    }, [periodMonths])

    const startDateStr = useMemo(() => startDate.format("YYYY-MM-DD"), [startDate])

    // --- синхронизация URL-параметров с состоянием ---

    useEffect(() => {
        const params = new URLSearchParams()

        if (debouncedSearch) params.set("search", debouncedSearch)
        if (selectedProgram) params.set("program", selectedProgram)
        if (selectedProject) params.set("project", selectedProject)
        if (periodMonths) params.set("period", periodMonths)
        if (pageRequest.pageNumber > 0) {
            params.set("page", String(pageRequest.pageNumber + 1))
        }

        setSearchParams(params, { replace: true })
        // при смене фильтров / страницы сбрасываем выбранных волонтёров
        setSelectedVolunteers(new Set())
    }, [debouncedSearch, selectedProgram, selectedProject, periodMonths, pageRequest.pageNumber, setSearchParams])

    // --- запрос данных ---

    const { data: volunteerData } = useQuery({
        queryKey: [
            "volunteerReports",
            debouncedSearch,
            pageRequest.pageNumber,
            pageRequest.pageSize,
            selectedProgram,
            selectedProject,
            periodMonths,
            startDateStr,
        ],
        queryFn: () =>
            ReportHeatMapApiService.getVolunteerHeatMap(debouncedSearch, pageRequest, {
                program: selectedProgram === "NO_PROGRAM" ? "" : selectedProgram || undefined,
                project: selectedProject === "NO_PROJECT" ? "" : selectedProject || undefined,
                startDate: startDateStr,
            }).then((response) => response.data),
        placeholderData: { content: [], page: defaultPageResponse },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    // --- обработчики, мемоизированные чтобы не триггерить лишние рендеры ---

    const handleVolunteerSelect = useCallback((volunteerId: number) => {
        setSelectedVolunteers((prev) => {
            const next = new Set(prev)
            if (next.has(volunteerId)) {
                next.delete(volunteerId)
            } else {
                next.add(volunteerId)
            }
            return next
        })
    }, [])

    const handleResetFilters = useCallback(() => {
        setSearch("")
        setSelectedProgram(null)
        setSelectedProject(null)
        setPeriodMonths("3")
        setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
    }, [])

    const handlePageSizeChange = useCallback((value: string | null) => {
        if (!value) return
        setPageRequest((pr) => ({
            ...pr,
            pageNumber: 0,
            pageSize: Number(value),
        }))
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setPageRequest((pr) => ({ ...pr, pageNumber: page - 1 }))
    }, [])

    const emailRecipients = useMemo(
        () =>
            (volunteerData?.content ?? [])
                .filter((v) => selectedVolunteers.has(v.volunteerInfo.id))
                .map((v) => ({
                    name: v.volunteerInfo.fullName,
                    email: v.volunteerInfo.email,
                })),
        [volunteerData?.content, selectedVolunteers]
    )

    const totalVolunteers = volunteerData?.page.totalElements ?? 0
    const totalPages = volunteerData?.page.totalPages ?? 1
    const currentPage = (pageRequest.pageNumber ?? 0) + 1

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
                    onProgramChange={setSelectedProgram}
                    selectedProject={selectedProject}
                    onProjectChange={setSelectedProject}
                    periodMonths={periodMonths}
                    onPeriodChange={setPeriodMonths}
                    onReset={handleResetFilters}
                />

                <Card withBorder p="lg">
                    <VolunteerReportHeatmap
                        volunteers={volunteerData?.content ?? []}
                        startDate={startDate}
                        onVolunteerSelect={handleVolunteerSelect}
                        selectedVolunteers={selectedVolunteers}
                        totalVolunteers={totalVolunteers}
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
                                onChange={handlePageSizeChange}
                                w={100}
                            />
                            <Pagination total={totalPages} value={currentPage} onChange={handlePageChange} />
                        </Flex>
                    </Flex>

                    <EmailDrawer
                        opened={emailDrawerOpen}
                        close={() => setEmailDrawerOpen(false)}
                        templates={heatmapTemplates}
                        recipients={emailRecipients}
                    />
                </Card>
            </Flex>
        </Flex>
    )
}

export default VolunteerHeatmapPage
