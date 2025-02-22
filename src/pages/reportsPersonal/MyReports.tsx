import { Badge, Button, Flex, Pagination, Text } from "@mantine/core"
import { PageRequest, ReportFilter } from "@russian-rs/portal-api-axios"
import { IconChevronRight, IconClockCheck, IconListCheck, IconPlus, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { defaultFilter, defaultPage, defaultPageResponse, locales } from "src/pages/reportsPersonal/lib/constants"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { DEFAULT_DATE_FORMAT } from "src/shared/datetime/formats"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { getReportStatusColor } from "src/shared/report/status"
import { getSpentTimeFromReport } from "src/shared/report/timeSpent"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { ReportStatusSelect } from "src/shared/ui/select/ReportStatusSelect"
import { WeekPicker } from "src/shared/ui/weekPicker/WeekPicker"
import classes from "./MyReports.module.scss"

export const MyReports = () => {
    setDocumentTitleByLocale(locales.documentTitle)
    const { user } = useContext(UserContext)
    const intl = useIntl()
    const navigate = useNavigate()

    const [pageRequest, setPageRequest] = useState<PageRequest>(defaultPage)
    const [filter, setFilter] = useState<ReportFilter>(defaultFilter)

    useEffect(() => {
        setFilter({ ...filter, login: user?.username })
    }, [user])

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
    }

    const onStatusChange = (status: string | null) => {
        setFilter({ ...filter, status: status })
    }

    const rows = response.content.map((report) => (
        <Flex key={report.id} className={classes.report} onClick={() => navigate(`/report/${report.id}`)}>
            <Flex className={classes.reportLeft}>
                <PropertyBox
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
                <PropertyBox
                    name={locales.reportTaskCount}
                    value={report.tasks.length}
                    icon={<IconListCheck size={16} />}
                />
                <PropertyBox
                    name={locales.reportTimeSpent}
                    value={getSpentTimeFromReport(report, intl)}
                    icon={<IconClockCheck size={16} />}
                />
                <PropertyBox name={locales.reportWeek} value={report.week} />
            </Flex>
            <IconChevronRight className={classes.arrow} />
        </Flex>
    ))

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />
            <Flex className={classes.root}>
                <Flex direction="column" gap="md">
                    <Flex columnGap="xl" rowGap="md" align="center" wrap="wrap-reverse">
                        <Text className={classes.title}>
                            <FormattedMessage id={locales.documentTitle} />
                        </Text>
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
                    <Flex className={classes.content}>
                        <Flex className={classes.filterArea}>
                            <WeekPicker onChange={onWeekChange} className={classes.filterWeek} />
                            <ReportStatusSelect onChange={onStatusChange} className={classes.filterStatus} />
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
                            onChange={(page) => setPageRequest({ ...pageRequest, pageNumber: page - 1 })}
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
