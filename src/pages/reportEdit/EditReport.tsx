import { Button, Flex, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { TaskDto } from "@russian-rs/portal-api-axios"
import { IconChevronRight, IconDeviceFloppy, IconPlus } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useLocation, useNavigate, useParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import classes from "src/pages/reportEdit/EditReport.module.scss"
import { defaultTask } from "src/pages/reportEdit/lib/defaults"
import { TaskCard, TaskCardInterface } from "src/pages/reportEdit/task/TaskCard"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { setDocumentTitleByLocale, setDocumentTitleByString } from "src/shared/hooks/useDocumentTitle"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { ReportStatus } from "src/shared/report/status"
import { allTasksInOneWeek } from "src/shared/report/tasks"
import { ConfirmActionModal } from "src/shared/ui/confirmActionModal/ConfirmActionModal"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import { hasPermission, UserGroup } from "src/shared/user/roles"
import { v4 as uuid } from "uuid"
import { locales } from "./lib/locales"

export const EditReport = () => {
    setDocumentTitleByLocale(locales.title)
    const location = useLocation()
    const { id } = useParams()
    const intl = useIntl()

    const { user: currentUser } = useContext(UserContext)
    const [editMode, setEditMode] = useState<boolean>(false)

    const [tasks, setTasks] = useState<TaskDto[]>([defaultTask])
    const taskRefs = useRef<{ [key: string]: React.RefObject<TaskCardInterface> }>({})

    const navigate = useNavigate()
    const [isSending, setIsSending] = useState(false)

    const [confirmModalOpened, setConfirmModalOpened] = useState(false)

    useEffect(() => {
        setEditMode(location.pathname.includes("edit"))
    }, [location])

    const { data: report, isFetching: isFetchingReport } = useQuery({
        queryKey: ["getReport", id],
        enabled: editMode && id != null,
        initialData: { id: "", tasks: [] },
        queryFn: () =>
            ReportApiService.getReport(id!!).then((response) => {
                return response.data
            }),
    })

    const handleTaskChange = (id: string, updatedTask: TaskDto) => {
        setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)))
    }

    const handleTaskAdd = () => {
        const task: TaskDto = { ...defaultTask, id: uuid() }
        setTasks([...tasks, task])
        taskRefs.current[task.id] = React.createRef()
    }

    const handleTaskDelete = (id: string) => {
        scrollToCard(tasks.length - 2)
        // Delay the actual removal to allow the scroll to finish
        setTimeout(() => {
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
            delete taskRefs.current[id]
        }, 300)
    }

    const scrollToCard = (index: number) => {
        if (index <= 0 && index >= tasks.length) {
            return
        }
        const cardId = tasks[index].id
        const cardRef = taskRefs.current[cardId]
        cardRef?.current?.scrollIntoView()
    }

    useEffect(() => {
        if (tasks.length > 1) {
            scrollToCard(tasks.length - 1)
        }
    }, [tasks])

    useEffect(() => {
        if (editMode) {
            setTasks(report.tasks)
        }
    }, [report, editMode])

    if (editMode) {
        if (!id) {
            navigate("/not-found")
        }
        if (isFetchingReport) {
            return (
                <Flex className={classes.root}>
                    <LoadingScreen />
                </Flex>
            )
        }
        if (currentUser?.username != report?.user && !hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER])) {
            navigate("/unauthorized", { replace: true })
        }
        if (report.status !== ReportStatus.REJECTED) {
            navigate("/unauthorized", { replace: true })
        }
        setDocumentTitleByString(intl.formatMessage({ id: locales.titleEdit }))
    }

    const onSend = () => {
        for (let i = 0; i < tasks.length; i++) {
            const cardRef = taskRefs.current[tasks[i].id]
            if (cardRef.current) {
                const validationResult = cardRef.current.validate()
                if (validationResult?.hasErrors) {
                    cardRef.current.scrollIntoView()
                    return
                } else {
                    tasks[i] = cardRef.current.getValues()
                }
            }
        }
        if (!allTasksInOneWeek(tasks)) {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id={locales.differentWeeks} />
                    </Text>
                )
            )
            return
        }
        const totalTimeSpent = tasks.map((t) => t.timeSpent).reduce((a, b) => a + b, 0)
        if (totalTimeSpent < 600) {
            setConfirmModalOpened(true)
        } else {
            sendReport()
        }
    }

    const sendReport = () => {
        setIsSending(true)
        const reportDto = editMode ? { tasks: tasks, id: report.id } : { tasks: tasks, id: uuid() }
        const response = editMode ? ReportApiService.updateReport(reportDto) : ReportApiService.createReport(reportDto)
        response
            .then((r) => {
                navigate(`/report/${r.data.id}`)
            })
            .catch((_) => {
                setIsSending(false)
            })
    }

    return (
        <Flex direction="column" className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={editMode ? locales.titleEdit : locales.title} />
            </Text>
            <Text className={classes.description}>
                <FormattedMessage id={locales.description} />
            </Text>
            <Flex direction="column" className={classes.taskContainer} rowGap={24}>
                {tasks.map((task, index) => {
                    if (!taskRefs.current[task.id]) {
                        taskRefs.current[task.id] = React.createRef()
                    }
                    return (
                        <TaskCard
                            key={index}
                            ref={taskRefs.current[task.id]}
                            task={task}
                            index={index}
                            editMode={editMode}
                            onChange={handleTaskChange}
                            onDelete={handleTaskDelete}
                        />
                    )
                })}
            </Flex>
            <Flex mt="md" className={classes.taskContainer}>
                <Button
                    className={classes.buttonAddTask}
                    variant="transparent"
                    rightSection={<IconPlus size={20} />}
                    onClick={handleTaskAdd}
                >
                    <FormattedMessage id={locales.addButton} />
                </Button>
                <Button
                    ml="auto"
                    rightSection={editMode ? <IconDeviceFloppy size={18} /> : <IconChevronRight size={18} />}
                    onClick={onSend}
                    loading={isSending}
                    disabled={isSending}
                >
                    <FormattedMessage id={editMode ? locales.saveButton : locales.sendButton} />
                </Button>
                <ConfirmActionModal
                    opened={confirmModalOpened}
                    onClose={() => {
                        setConfirmModalOpened(false)
                    }}
                    onConfirm={sendReport}
                    title={<FormattedMessage id={locales.confirmTitle} />}
                    description={<FormattedMessage id={locales.confirmDescription} />}
                    confirmButtonText={<FormattedMessage id={editMode ? locales.saveButton : locales.sendButton} />}
                    cancelButtonText={<FormattedMessage id={locales.fillUpButton} />}
                />
            </Flex>
        </Flex>
    )
}

export default EditReport
