import { Avatar, Badge, Flex, Text } from "@mantine/core"
import { IconCalendar, IconClock } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { locales } from "src/pages/report/constants"
import { TaskCard } from "src/pages/report/task/TaskCard"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { resolveUsers } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { getReportStatusColor } from "src/shared/report/status"
import { getSpentTimeFromTasks } from "src/shared/report/timeSpent"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import classes from "./ReportPage.module.scss"

export const ReportPage = () => {
    setDocumentTitleByLocale(locales.documentTitle)

    const { id } = useParams()
    const intl = useIntl()
    const navigate = useNavigate()
    const [logins, setLogins] = useState<string[]>([])

    if (!id) {
        navigate("/not-found")
    }

    const { data: report, isFetching: isFetchingReport } = useQuery({
        queryKey: ["getReport", id],
        initialData: { id: "", tasks: [] },
        queryFn: () =>
            ReportApiService.getReport(id!!).then((response) => {
                const report = response.data
                setLogins([report.user, ...report.tasks.map((it) => it.customer)].filter((it) => it != undefined))
                return report
            }),
    })

    const { data: users, isFetching: isFetchingUsers } = resolveUsers(logins)

    if (isFetchingReport || isFetchingUsers) {
        return (
            <Flex className={classes.root}>
                <LoadingScreen />
            </Flex>
        )
    }

    return (
        <Flex className={classes.root}>
            <Flex columnGap="sm" align="center" wrap="wrap">
                <Text className={classes.title}>
                    <FormattedMessage
                        id={locales.reportFrom}
                        values={{ date: dayjs(report.createTime).format("DD MMMM YYYY") }}
                    />
                </Text>
                <Badge color={getReportStatusColor(report.status)} size="lg" radius="md" variant="light">
                    <FormattedMessage id={`common.report-status.${report.status}`} />
                </Badge>
            </Flex>
            <Flex className={classes.reportDescription}>
                <PropertyBox
                    name={locales.creator}
                    value={users[report.user || ""].fullName}
                    href={`/profile/${report.user}`}
                    icon={
                        <Avatar
                            src={users[report.user || ""].avatar?.link}
                            name={users[report.user || ""].fullName}
                            color="initials"
                            size={20}
                        />
                    }
                />
                <PropertyBox
                    name={locales.creationDate}
                    value={dayjs(report.createTime).format("DD MMM YYYY - HH:mm")}
                    icon={<IconCalendar size={16} />}
                />
                <PropertyBox
                    name={locales.timeSpentTotal}
                    value={getSpentTimeFromTasks(report.tasks, intl)}
                    icon={<IconClock size={16} />}
                />
            </Flex>
            <Flex direction="column" rowGap="lg" mt="md">
                {report.tasks.map((task) => (
                    <TaskCard task={task} users={users} key={task.id} />
                ))}
            </Flex>
        </Flex>
    )
}

export default ReportPage
