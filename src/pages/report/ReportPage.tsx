import { Avatar, Badge, Button, Flex, Paper, Text, Textarea } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { ReportDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconCheck, IconClock, IconPencil, IconX } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { locales } from "src/pages/report/lib/locales"
import { TaskCard } from "src/pages/report/task/TaskCard"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { resolveUsers } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { getReportStatusColor, ReportStatus } from "src/shared/report/status"
import { getSpentTimeFromTasks } from "src/shared/report/timeSpent"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { hasPermission, UserGroup } from "src/shared/user/roles"
import classes from "./ReportPage.module.scss"

export const ReportPage = () => {
    setDocumentTitleByLocale(locales.documentTitle)

    const { id } = useParams()
    const intl = useIntl()
    const navigate = useNavigate()
    const { user: currentUser } = useContext(UserContext)
    const [logins, setLogins] = useState<string[]>([])

    const [statusChanging, setStatusChanging] = useState(false)
    const [comment, setComment] = useState("")

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

    const onStatusChange = (status: ReportStatus) => {
        if (status == ReportStatus.REJECTED && comment.trim().length == 0) {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id={locales.commentRequired} />
                    </Text>
                )
            )
            return
        }
        setStatusChanging(true)
        ReportApiService.changeStatus(report.id, { status: status, note: comment }).then((response) => {
            window.location.reload()
        })
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
                {enableEditButton(report, currentUser) && (
                    <Badge
                        color="gray"
                        size="lg"
                        radius="md"
                        variant="light"
                        leftSection={<IconPencil size={14} />}
                        className={classes.editButton}
                        onClick={() => {
                            navigate(`/report/${report.id}/edit`)
                        }}
                    >
                        <FormattedMessage id={locales.edit}></FormattedMessage>
                    </Badge>
                )}
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
            {report.notes && report.notes.length > 0 && (
                <Flex className={classes.notes}>
                    <Text fw="bold">
                        <FormattedMessage id={locales.comments} />
                    </Text>
                    {report.notes.map((note) => (
                        <Paper shadow="md" radius="md" p="xs" key={note.id}>
                            <Flex direction="column" rowGap="sm">
                                <Flex align="center" columnGap="xs">
                                    <Avatar size={20} />
                                    <Text c="dimmed" size="sm">
                                        <FormattedMessage id={locales.moderator} />
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {dayjs(note.createTime).format("HH:mm DD.MM.YYYY")}
                                    </Text>
                                </Flex>
                                <Text size="sm">{note.text}</Text>
                            </Flex>
                        </Paper>
                    ))}
                </Flex>
            )}
            <Flex className={classes.tasks}>
                {report.tasks.map((task) => (
                    <TaskCard task={task} users={users} key={task.id} />
                ))}
            </Flex>
            {report.status == ReportStatus.CREATED && hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER]) && (
                <Flex direction="column" rowGap="sm">
                    <Textarea
                        className={classes.comment}
                        value={comment}
                        autosize={true}
                        disabled={statusChanging}
                        onChange={(e) => setComment(e.target.value)}
                        label={intl.formatMessage({ id: locales.comment })}
                    ></Textarea>
                    <Flex className={classes.acceptRejectSection}>
                        <Button
                            className={classes.acceptButton}
                            color="green"
                            variant="light"
                            leftSection={<IconCheck size={16} />}
                            disabled={statusChanging}
                            onClick={() => {
                                onStatusChange(ReportStatus.ACCEPTED)
                            }}
                        >
                            <FormattedMessage id={locales.accept} />
                        </Button>
                        <Button
                            className={classes.rejectButton}
                            color="red"
                            variant="light"
                            leftSection={<IconX size={16} />}
                            disabled={statusChanging}
                            onClick={() => {
                                onStatusChange(ReportStatus.REJECTED)
                            }}
                        >
                            <FormattedMessage id={locales.reject} />
                        </Button>
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}

const enableEditButton = (report: ReportDto, currentUser: UserInfoDto | null): boolean => {
    if (report.status != ReportStatus.REJECTED) {
        return false
    }
    if (hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER])) {
        return true
    }
    return currentUser?.username == report.user
}

export default ReportPage
