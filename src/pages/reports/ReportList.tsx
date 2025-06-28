import { Avatar, Flex, Pagination, Table, Text } from "@mantine/core"
import { PageRequest, ReportDto, ReportFilter, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconFile, IconClock, IconListCheck, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useState, useEffect } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { resolveUsers } from "src/shared/api/user/UserApiService"
import { DEFAULT_DATE_FORMAT } from "src/shared/datetime/formats"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { getSpentTimeFromReport } from "src/shared/report/timeSpent"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { ReportStatusSelect } from "src/shared/ui/select/ReportStatusSelect"
import { openTab } from "src/shared/ui/tabs/WindowFunctions"
import { UserSearch } from "src/shared/ui/userSearch/UserSearch"
import { WeekPicker } from "src/shared/ui/weekPicker/WeekPicker"
import { hasPermission } from "src/shared/user/roles"
import { defaultFilter, defaultPage, defaultPageResponse, defaultUser } from "./lib/defaults"
import { locales } from "./lib/locales"
import { allowedRoles } from "./lib/roles"
import classes from "./ReportList.module.scss"
import { ProgramFilter } from "src/pages/users/filter/ProgramFilter"
import { useMediaQuery } from "@mantine/hooks"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { Badge } from "@mantine/core"
import { getReportStatusColor } from "src/shared/report/status"

export const ReportList = () => {
    setDocumentTitleByLocale(locales.title)

    const [searchParams, setSearchParams] = useSearchParams()
    const loginParam = searchParams.get("login")
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()

    const [resetKey, setResetKey] = useState(0)
    const [pageRequest, setPageRequest] = useState<PageRequest>({
        ...defaultPage,
        pageNumber: parseInt(searchParams.get("page") || "0")
    })
    const [filter, setFilter] = useState<ReportFilter>({
        ...defaultFilter(loginParam),
        status: searchParams.get("status") || null,
        dateFrom: searchParams.get("dateFrom") || null,
        dateTo: searchParams.get("dateTo") || null
    })
    const [logins, setLogins] = useState<string[]>([])
    const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
        searchParams.get("programs") ? searchParams.get("programs")!.split(",") : []
    )

    const isMobile = useMediaQuery('(max-width: 1360px)')

    const syncStateFromUrl = () => {
        const urlLogin = searchParams.get("login") || null
        const urlStatus = searchParams.get("status") || null
        const urlDateFrom = searchParams.get("dateFrom") || null
        const urlDateTo = searchParams.get("dateTo") || null
        const urlPrograms = searchParams.get("programs") ? searchParams.get("programs")!.split(",") : []
        const urlPage = parseInt(searchParams.get("page") || "0")

        setFilter({
            ...filter,
            login: urlLogin,
            status: urlStatus,
            dateFrom: urlDateFrom,
            dateTo: urlDateTo
        })
        setSelectedPrograms(urlPrograms)
        setPageRequest({ ...pageRequest, pageNumber: urlPage })
        setResetKey(prev => prev + 1)
    }

    useEffect(() => {
        const handlePopState = () => {
            syncStateFromUrl()
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [searchParams])

    const updateUrlParams = (newFilter: ReportFilter, newPrograms: string[], newPage: number = 0) => {
        const params = new URLSearchParams()
        
        if (newFilter.login) {
            params.set("login", newFilter.login)
        }
        
        if (newFilter.status) {
            params.set("status", newFilter.status)
        }
        
        if (newFilter.dateFrom) {
            params.set("dateFrom", newFilter.dateFrom)
        }
        
        if (newFilter.dateTo) {
            params.set("dateTo", newFilter.dateTo)
        }
        
        if (newPrograms.length > 0) {
            params.set("programs", newPrograms.join(","))
        }
        
        if (newPage > 0) {
            params.set("page", newPage.toString())
        }
        
        setSearchParams(params)
    }

    useEffect(() => {
        updateUrlParams(filter, selectedPrograms, pageRequest.pageNumber || 0)
    }, [filter])

    useEffect(() => {
        updateUrlParams(filter, selectedPrograms, 0)
        setPageRequest({ ...pageRequest, pageNumber: 0 })
    }, [selectedPrograms])

    useEffect(() => {
        const pageNumber = pageRequest.pageNumber || 0
        if (pageNumber > 0) {
            updateUrlParams(filter, selectedPrograms, pageNumber)
        }
    }, [pageRequest.pageNumber])

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    const {
        data: { content: reports, page },
        isFetching: isFetchingReports,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["searchReports", filter, pageRequest, selectedPrograms],
        queryFn: () => {
            const filterWithProgram = {
                ...filter,
                program: selectedPrograms.length === 1 ? selectedPrograms[0] : null
            }
            return ReportApiService.getReports(pageRequest, filterWithProgram).then((response) => {
                setLogins(response.data.content.map((it) => it.user).filter((it) => it != undefined))
                return response.data
            })
        },
    })

    const { data: users } = resolveUsers(logins)

    const onUserSelected = (selectedUser: UserInfoDto | null) => {
        setFilter({ ...filter, login: selectedUser?.username || null })
    }

    const onStatusChange = (status: string | null) => {
        setFilter({ ...filter, status: status })
    }

    const onWeekChange = (_: any, start: Date | null, end: Date | null) => {
        const startDate = start ? dayjs(start).format(DEFAULT_DATE_FORMAT) : null
        const endDate = end ? dayjs(end).format(DEFAULT_DATE_FORMAT) : null
        setFilter({ ...filter, dateFrom: startDate, dateTo: endDate })
    }

    const rows = reports.map((report) => {
        const creator = users[report.user!!] || defaultUser(report.user!!)
        const createTime = dayjs(report.createTime).format("DD MMM YYYY HH:mm")
        const timeSpent = getSpentTimeFromReport(report, intl)
        const filesCount = getReportFilesCount(report)
        return (
            <Table.Tr key={report.id} className={classes.row} onClick={() => openTab(`/report/${report.id}`)}>
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
                    <Text>{report.week}</Text>
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

    const cards = reports.map((report) => {
        const creator = users[report.user!!] || defaultUser(report.user!!)
        const createTime = dayjs(report.createTime).format('DD MMM YYYY')
        const timeSpent = getSpentTimeFromReport(report, intl)
        const filesCount = getReportFilesCount(report)
        return (
            <Flex key={report.id} className={classes.mobileCard} onClick={() => openTab(`/report/${report.id}`)}>
                <Flex className={classes.reportHeader}>
                    <TextPropertyBox
                        name={locales.volunteer}
                        value={creator.fullName}
                        icon={<Avatar size={20} src={creator.avatar?.link} name={creator.fullName} />}
                    />
                </Flex>
                <Flex className={classes.reportBody}>
                    <Flex className={classes.reportLeft}>
                        <TextPropertyBox
                            name={locales.creationDate}
                            value={createTime}
                        />
                        <PropertyBox
                            name={locales.status}
                            value={
                                <Badge color={getReportStatusColor(report.status)} radius="md" variant="light">
                                    <FormattedMessage id={`common.report-status.${report.status}`} />
                                </Badge>
                            }
                        />
                        <TextPropertyBox 
                            name={locales.weeks} 
                            value={report.week} 
                        />
                    </Flex>
                    <Flex className={classes.reportRight}>
                        <TextPropertyBox
                            name={locales.tasks}
                            value={report.tasks.length}
                            icon={<IconListCheck size={16} />}
                        />
                        <TextPropertyBox
                            name={locales.timeSpent}
                            value={timeSpent}
                            icon={<IconClock size={16} />}
                        />
                        {filesCount !== 0 && (
                            <TextPropertyBox
                                name={locales.files}
                                value={filesCount}
                                icon={<IconFile size={16} />}
                            />
                        )}
                    </Flex>
                </Flex>
            </Flex>
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
                        key={`user-search-${resetKey}`}
                        className={classes.userSearch}
                        description={<FormattedMessage id={locales.volunteer} />}
                        onUserChange={onUserSelected}
                        initialSearch={filter.login || ""}
                    />
                    <WeekPicker 
                        key={`week-picker-${resetKey}`}
                        onChange={onWeekChange}
                        initialStartDate={filter.dateFrom}
                        initialEndDate={filter.dateTo}
                    />
                    <ReportStatusSelect 
                        key={`status-select-${resetKey}`}
                        onChange={onStatusChange}
                        value={filter.status}
                    />
                    <ProgramFilter
                        className={classes.programFilter}
                        value={selectedPrograms}
                        onChange={setSelectedPrograms}
                        maxValues={1}
                        autoClose={true}
                    />
                </Flex>
                {isMobile ? (
                    <Flex direction="column" rowGap={8} className={classes.mobileList}>
                        {cards}
                    </Flex>
                ) : (
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
                )}
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
                            onChange={(newPage) => {
                                const pageNumber = newPage - 1
                                setPageRequest({ ...pageRequest, pageNumber })
                            }}
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

const getReportFilesCount = (report: ReportDto): number => {
    let count = 0
    report.tasks.forEach((task) => {
        count += task.files?.length || 0
    })
    return count
}

export default ReportList
