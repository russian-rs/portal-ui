import { Badge, Button, Flex, Pagination, Text } from "@mantine/core"
import { PageRequest, ReportFilter } from "@russian-rs/portal-api-axios"
import { IconChevronRight, IconClockCheck, IconListCheck, IconPlus, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { defaultFilter, defaultPage, defaultPageResponse, locales } from "src/pages/reportsPersonal/lib/constants"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { DEFAULT_DATE_FORMAT } from "src/shared/datetime/formats"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { getReportStatusColor } from "src/shared/report/status"
import { getSpentTimeFromReport } from "src/shared/report/timeSpent"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { ReportStatusSelect } from "src/shared/ui/select/ReportStatusSelect"
import { WeekPicker } from "src/shared/ui/weekPicker/WeekPicker"
import classes from "./MyReports.module.scss"
import { useMediaQuery } from "@mantine/hooks"

export const MyReports = () => {
    setDocumentTitleByLocale(locales.documentTitle)
    const { user } = useContext(UserContext)
    const intl = useIntl()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const isMobile = useMediaQuery('(max-width: 1360px)')

    // Инициализация состояния из URL параметров
    const [pageRequest, setPageRequest] = useState<PageRequest>({
        ...defaultPage,
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: isMobile ? 10 : 25
    })
    const [filter, setFilter] = useState<ReportFilter>({
        ...defaultFilter,
        status: searchParams.get("status") || null,
        dateFrom: searchParams.get("dateFrom") || null,
        dateTo: searchParams.get("dateTo") || null
    })
    
    // Ref для скролла к началу списка
    const listStartRef = React.useRef<HTMLDivElement>(null)

    // Функция для синхронизации состояния с URL параметрами
    const syncStateFromUrl = () => {
        const urlStatus = searchParams.get("status") || null
        const urlDateFrom = searchParams.get("dateFrom") || null
        const urlDateTo = searchParams.get("dateTo") || null
        const urlPageFromUser = parseInt(searchParams.get("page") || "1")
        const urlPage = urlPageFromUser > 0 ? urlPageFromUser - 1 : 0

        setFilter({
            ...filter,
            status: urlStatus,
            dateFrom: urlDateFrom,
            dateTo: urlDateTo
        })
        setPageRequest({ ...pageRequest, pageNumber: urlPage })
    }

    // Эффект для обработки навигации назад/вперед браузера
    useEffect(() => {
        const handlePopState = () => {
            syncStateFromUrl()
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [searchParams])

    // Функция для обновления URL параметров
    const updateUrlParams = (newFilter: ReportFilter, newPage: number = 0) => {
        const params = new URLSearchParams()
        
        if (newFilter.status) {
            params.set("status", newFilter.status)
        }
        
        if (newFilter.dateFrom) {
            params.set("dateFrom", newFilter.dateFrom)
        }
        
        if (newFilter.dateTo) {
            params.set("dateTo", newFilter.dateTo)
        }
        
        if (newPage > 0) {
            const userPageNumber = newPage + 1
            params.set("page", userPageNumber.toString())
        }
        
        setSearchParams(params)
    }

    useEffect(() => {
        setFilter({ ...filter, login: user?.username })
    }, [user])

    // Эффект для обновления URL при изменении фильтра
    useEffect(() => {
        updateUrlParams(filter, pageRequest.pageNumber || 0)
    }, [filter.status, filter.dateFrom, filter.dateTo])

    // Эффект для обновления URL при изменении страницы
    useEffect(() => {
        const pageNumber = pageRequest.pageNumber || 0
        updateUrlParams(filter, pageNumber)
    }, [pageRequest.pageNumber])

    // Эффект для обновления размера страницы при изменении типа устройства
    useEffect(() => {
        const newPageSize = isMobile ? 10 : 25
        if (pageRequest.pageSize !== newPageSize) {
            setPageRequest({ ...pageRequest, pageSize: newPageSize, pageNumber: 0 })
        }
    }, [isMobile])

    // Эффект для скролла при смене страницы в мобильной версии
    useEffect(() => {
        if (pageRequest.pageNumber !== undefined) {
            if (listStartRef.current) {
                listStartRef.current.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                })
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        }
    }, [pageRequest.pageNumber])

    const { data: response, isFetching } = useQuery({
        enabled: filter.login != null,
        queryKey: ["getReports", pageRequest, filter],
        initialData: { page: defaultPageResponse, content: [] },
        queryFn: () => ReportApiService.getReports(pageRequest, filter).then((response) => response.data),
    })

    const onWeekChange = (week: number | null, start: Date | null, end: Date | null) => {
        const startDate = start ? dayjs(start).format(DEFAULT_DATE_FORMAT) : null
        const endDate = end ? dayjs(end).format(DEFAULT_DATE_FORMAT) : null
        setFilter({ ...filter, dateFrom: startDate, dateTo: endDate })
        setPageRequest({ ...pageRequest, pageNumber: 0 })
    }

    const onStatusChange = (status: string | null) => {
        setFilter({ ...filter, status: status })
        setPageRequest({ ...pageRequest, pageNumber: 0 })
    }

    const rows = response.content.map((report) => (
        <Flex key={report.id} className={classes.report} onClick={() => navigate(`/report/${report.id}`)}>
            <Flex className={classes.reportLeft}>
                <TextPropertyBox
                    name={locales.reportCreated}
                    value={dayjs(report.createTime).format("DD MMM YYYY")}
                    className={classes.date}
                />
                <PropertyBox
                    name={locales.reportStatus}
                    value={
                        <Badge color={getReportStatusColor(report.status)} radius="md" variant="light">
                            <FormattedMessage id={`common.report-status.${report.status}`} />
                        </Badge>
                    }
                />
            </Flex>
            <Flex className={classes.reportRight}>
                <TextPropertyBox name={locales.reportWeek} value={report.week} />
                <TextPropertyBox
                    name={locales.reportTaskCount}
                    value={report.tasks.length}
                    icon={<IconListCheck size={16} />}
                />
                <TextPropertyBox
                    name={locales.reportTimeSpent}
                    value={getSpentTimeFromReport(report, intl)}
                    icon={<IconClockCheck size={16} />}
                />
            </Flex>
            <IconChevronRight className={classes.arrow} />
        </Flex>
    ))

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />
            <Flex className={classes.root}>
                <Flex direction="column" gap="md" w="100%">
                    <Flex columnGap="xl" rowGap="md" align="center" wrap="wrap-reverse">
                        <Text className={classes.title}>
                            <FormattedMessage id={locales.documentTitle} />
                        </Text>
                    </Flex>
                    <div ref={listStartRef} />
                    <Flex className={classes.content}>
                        <Flex className={classes.filterArea}>
                            <WeekPicker 
                                onChange={onWeekChange} 
                                className={classes.filterWeek}
                                initialStartDate={filter.dateFrom}
                                initialEndDate={filter.dateTo}
                            />
                            <ReportStatusSelect 
                                onChange={onStatusChange} 
                                className={classes.filterStatus}
                                value={filter.status}
                            />
                            <Button
                                className={classes.newReportButton}
                                variant="light"
                                size="sm"
                                leftSection={<IconPlus size={16} />}
                                onClick={() => navigate("/report/create")}
                            >
                                <Text size="sm">
                                    <FormattedMessage id={locales.newReport} />
                                </Text>
                            </Button>
                        </Flex>
                        <Flex className={classes.reportContainer}>
                            {rows.length == 0 && (
                                <Flex className={classes.emptyState}>
                                    <IconUfo size={48} />
                                    <Text>
                                        <FormattedMessage id={locales.emptyReports} />
                                    </Text>
                                </Flex>
                            )}
                            {rows}
                        </Flex>
                    </Flex>
                    <Flex className={classes.pagination}>
                        <Pagination
                            total={response.page.totalPages}
                            value={pageRequest.pageNumber ? pageRequest.pageNumber + 1 : 1}
                            disabled={isFetching}
                            hideWithOnePage={true}
                            onChange={(newPage) => {
                                const pageNumber = newPage - 1
                                setPageRequest({ ...pageRequest, pageNumber })
                            }}
                        />
                        <Text c="dimmed">
                            <FormattedMessage id={locales.total} values={{ total: response.page.totalElements }} />
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default MyReports
