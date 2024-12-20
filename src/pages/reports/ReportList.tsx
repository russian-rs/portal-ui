import { Avatar, Button, Flex, Pagination, Table, Text } from "@mantine/core"
import { PageRequest, ReportDto, ReportFilter, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconFile, IconListCheck, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { resolveUsers } from "src/shared/api/UserApiService"
import { DEFAULT_DATE_FORMAT } from "src/shared/datetime/formats"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { getSpentTimeFromReport } from "src/shared/report/timeSpent"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { ReportStatusSelect } from "src/shared/ui/select/ReportStatusSelect"
import { UserSearch } from "src/shared/ui/userSearch/UserSearch"
import { WeekPicker } from "src/shared/ui/weekPicker/WeekPicker"
import { hasPermission } from "src/shared/user/roles"
import { defaultFilter, defaultPage, defaultPageResponse, defaultUser } from "./lib/defaults"
import { locales } from "./lib/locales"
import { allowedRoles } from "./lib/roles"
import classes from "./ReportList.module.scss"

export const ReportList = () => {
    setDocumentTitleByLocale(locales.title)

    const [searchParams] = useSearchParams()
    const loginParam = searchParams.get("login")
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()

    const [pageRequest, setPageRequest] = useState<PageRequest>(defaultPage)
    const [filter, setFilter] = useState<ReportFilter>(defaultFilter(loginParam))
    const [logins, setLogins] = useState<string[]>([])

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    const {
        data: { content: reports, page },
        isFetching: isFetchingReports,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["searchReports", filter, pageRequest],
        queryFn: () =>
            ReportApiService.getReports(pageRequest, filter).then((response) => {
                const reports = response.data.content
                setLogins(reports.map((it) => it.user).filter((it) => it != undefined))
                return response.data
            }),
    })

    const { data: users } = resolveUsers(logins)

    const onUserSelected = (selectedUser: UserInfoDto | null) => {
        setFilter({ ...filter, login: selectedUser?.username })
    }

    const onStatusChange = (status: string | null) => {
        setFilter({ ...filter, status: status })
    }

    const onWeekChange = (_: any, start: Date | null, end: Date | null) => {
        const startDate = start ? dayjs(start).format(DEFAULT_DATE_FORMAT) : null
        const endDate = end ? dayjs(end).format(DEFAULT_DATE_FORMAT) : null
        setFilter({ ...filter, dateFrom: startDate, dateTo: endDate })
    }

    const isFiltered = () => {
        return filter.login || filter.status || filter.program || filter.dateFrom || filter.dateTo
    }

    const rows = reports.map((report) => {
        const creator = users[report.user!!] || defaultUser(report.user!!)
        const createTime = dayjs(report.createTime).format("DD MMM YYYY HH:mm")
        const timeSpent = getSpentTimeFromReport(report, intl)
        const filesCount = getReportFilesCount(report)
        return (
            <Table.Tr key={report.id} className={classes.row} onClick={() => navigate(`/report/${report.id}`)}>
                <Table.Td>
                    <Text>{createTime}</Text>
                </Table.Td>
                <Table.Td>
                    <Flex columnGap={8} align="center" className={classes.columnVolunteer}>
                        <Avatar size={24} src={creator.avatar?.link} name={creator.fullName} />
                        <Text truncate="end">{creator.fullName}</Text>
                    </Flex>
                </Table.Td>
                <Table.Td>
                    <Text>{getReportWeeks(report).join(", ")}</Text>
                </Table.Td>
                <Table.Td>
                    <Text>{timeSpent}</Text>
                </Table.Td>
                <Table.Td>
                    <Text>
                        <FormattedMessage id={`common.report-status.${report.status}`} />
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Flex direction="column" justify="center">
                        <Flex columnGap={8} align="center">
                            <IconListCheck size={14} />
                            <Text className={classes.stats}>
                                <FormattedMessage id={locales.taskCount} values={{ count: report.tasks.length }} />
                            </Text>
                        </Flex>
                        {filesCount != 0 && (
                            <Flex columnGap={8} align="center">
                                <IconFile size={14} />
                                <Text className={classes.stats}>
                                    <FormattedMessage id={locales.filesCount} values={{ count: filesCount }} />
                                </Text>
                            </Flex>
                        )}
                    </Flex>
                </Table.Td>
            </Table.Tr>
        )
    })

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetchingReports} className={classes.loader} />
            <Flex className={classes.root}>
                <Text className={classes.title}>
                    <FormattedMessage id={locales.title} />
                </Text>
                <Flex className={classes.filters}>
                    <UserSearch
                        className={classes.userSearch}
                        description={<FormattedMessage id={locales.volunteer} />}
                        onUserChange={onUserSelected}
                        initialSearch={loginParam ? loginParam : ""}
                    />
                    <WeekPicker onChange={onWeekChange} />
                    <ReportStatusSelect onChange={onStatusChange} />
                    {isFiltered() && (
                        <Button variant="transparent" onClick={() => setFilter(defaultFilter())}>
                            <FormattedMessage id={locales.reset} />
                        </Button>
                    )}
                </Flex>
                <Table stickyHeader highlightOnHover className={classes.table}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={classes.columnDate}>
                                <FormattedMessage id={locales.creationDate} />
                            </Table.Th>
                            <Table.Th className={classes.columnVolunteer}>
                                <FormattedMessage id={locales.volunteer} />
                            </Table.Th>
                            <Table.Th className={classes.columnWeeks}>
                                <FormattedMessage id={locales.weeks} />
                            </Table.Th>
                            <Table.Th className={classes.columnTimeSpent}>
                                <FormattedMessage id={locales.timeSpent} />
                            </Table.Th>
                            <Table.Th className={classes.columnStatus}>
                                <FormattedMessage id={locales.status} />
                            </Table.Th>
                            <Table.Th className={classes.columnStats}></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                {page.totalElements == 0 && (
                    <Flex className={classes.emptyState}>
                        <IconUfo size={48} />
                        <Text>
                            <FormattedMessage id={locales.empty} />
                        </Text>
                    </Flex>
                )}
                {page.totalPages > 1 && (
                    <Flex className={classes.pagination}>
                        <Pagination
                            total={page.totalPages}
                            value={pageRequest.pageNumber ? pageRequest.pageNumber + 1 : 1}
                            disabled={isFetchingReports}
                            onChange={(page) => setPageRequest({ ...pageRequest, pageNumber: page - 1 })}
                        />
                        <Text c="dimmed">
                            <FormattedMessage id={locales.total} values={{ count: page.totalElements }} />
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}

const getReportWeeks = (report: ReportDto): number[] => {
    const weeks = new Set<number>()
    report.tasks.forEach((task) => {
        weeks.add(dayjs(task.date).isoWeek())
    })
    return Array.from(weeks)
}

const getReportFilesCount = (report: ReportDto): number => {
    let count = 0
    report.tasks.forEach((task) => {
        count += task.files?.length || 0
    })
    return count
}

export default ReportList
