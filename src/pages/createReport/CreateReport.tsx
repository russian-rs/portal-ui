import { Button, Flex, Text } from "@mantine/core"
import { TaskDto } from "@russian-rs/portal-api-axios"
import { IconChevronRight, IconPlus } from "@tabler/icons-react"
import React, { useEffect, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import { defaultTask, locales } from "src/pages/createReport/constants"
import classes from "src/pages/createReport/CreateReport.module.scss"
import { TaskCard, TaskCardInterface } from "src/pages/createReport/task/TaskCard"
import { ReportApiService } from "src/shared/api/ReportApiService"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { v4 as uuid } from "uuid"

export const CreateReport = () => {
    useSetDocumentTitleByLocale(locales.title)

    const [tasks, setTasks] = useState<TaskDto[]>([defaultTask])
    const taskRefs = useRef<{ [key: string]: React.RefObject<TaskCardInterface> }>({})

    const history = useHistory()
    const [isSending, setIsSending] = useState(false)

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
        cardRef.current?.scrollIntoView()
    }

    useEffect(() => {
        if (tasks.length > 1) {
            scrollToCard(tasks.length - 1)
        }
    }, [tasks])

    const onSend = () => {
        for (let i = 0; i < tasks.length; i++) {
            const cardRef = taskRefs.current[tasks[i].id]
            if (cardRef.current) {
                const validationResult = cardRef.current.validate()
                if (validationResult?.hasErrors) {
                    cardRef.current?.scrollIntoView()
                    return
                } else {
                    tasks[i] = cardRef.current.getValues()
                }
            }
        }
        if (tasks.length > 0) {
            setIsSending(true)
            ReportApiService.createReport({ tasks: tasks, id: uuid() })
                .then((r) => {
                    history.push(`/report/${r.data.id}`)
                })
                .catch((_) => {
                    setIsSending(false)
                })
        }
    }

    return (
        <Flex direction="column" className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
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
                    rightSection={<IconChevronRight size={18} />}
                    onClick={onSend}
                    loading={isSending}
                    disabled={isSending}
                >
                    <FormattedMessage id={locales.sendButton} />
                </Button>
            </Flex>
        </Flex>
    )
}

export default CreateReport
