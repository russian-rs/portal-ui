import { Avatar, Flex, Text } from "@mantine/core"
import { TaskDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconClock, IconLink } from "@tabler/icons-react"
import dayjs from "dayjs"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { getSpentTime } from "src/pages/report/utils"
import { FileButton } from "src/shared/ui/fileButton/FileButton"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { locales } from "./constants"
import classes from "./TaskCard.module.scss"

interface TaskCardProps {
    task: TaskDto
    users: Record<string, UserInfoDto>
}

export const TaskCard = ({ task, users }: TaskCardProps) => {
    const intl = useIntl()

    return (
        <Flex className={classes.task}>
            <Flex columnGap="xs" align="start">
                <Text fw="bold" className={classes.name}>
                    {task.name}
                </Text>
                <Flex className={classes.clock}>
                    <IconClock size={14} />
                    <Text size="sm">{getSpentTime(task.timeSpent, intl)}</Text>
                </Flex>
            </Flex>
            <Text c="dimmed">{task.description}</Text>
            <Flex className={classes.taskDescription}>
                <PropertyBox
                    name={locales.taskDate}
                    value={dayjs(task.date).format("DD MMM YYYY")}
                    icon={<IconCalendar size={16} />}
                />
                {task.customer && (
                    <PropertyBox
                        name={locales.taskCustomer}
                        href={`/profile/${task.customer}`}
                        icon={
                            <Avatar
                                src={users[task.customer || ""].avatar?.link}
                                name={users[task.customer || ""].fullName}
                                color="initials"
                                size={20}
                            />
                        }
                        value={users[task.customer || ""].fullName}
                    />
                )}
            </Flex>
            {task.result && (
                <PropertyBox
                    name={locales.taskResult}
                    value={task.result}
                    href={task.result}
                    icon={<IconLink size={16} />}
                />
            )}
            {task.files?.length !== 0 && (
                <Flex direction="column" gap={4}>
                    <Text c="dimmed" size="xs">
                        <FormattedMessage id={locales.taskFiles} />
                    </Text>
                    <Flex gap={8} wrap="wrap">
                        {task.files?.map((file) => <FileButton file={file} className={classes.fileButton} />)}
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}
