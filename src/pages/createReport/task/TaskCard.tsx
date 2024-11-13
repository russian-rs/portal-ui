import { ActionIcon, Badge, Flex, NumberInput, Select, SimpleGrid, Textarea, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { TaskDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconChecklist, IconClock, IconLink, IconTrashX, IconUser } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserApiService } from "src/shared/api/UserApiService"
import { DropzoneArea } from "src/shared/ui/dropzone/DropzoneArea"
import { locales } from "./constants"
import classes from "./TaskCard.module.scss"

interface TaskCardProps {
    task: TaskDto
    index: number
    onChange: (id: string, updatedTask: TaskDto) => void
    onDelete: (id: string) => void
}

export interface Functions {
    validate: () => void
    scrollIntoView: () => void
}

export const TaskCard = forwardRef<Functions, TaskCardProps>((props, ref) => {
    const [searchValue, setSearchValue] = useState("")
    const cardRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => ({
        scrollIntoView: () => {
            cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        },
        validate: () => {
            console.log("Validating " + props.index)
        },
    }))

    const { data: users = [], isFetching } = useQuery({
        queryKey: ["searchUsers", searchValue],
        queryFn: () => UserApiService.searchUsers(searchValue, {}).then((response) => response.data.content),
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        props.onChange(props.task.id, { ...props.task, [name]: value })
    }

    return (
        <Flex direction="column" className={classes.taskCard} ref={cardRef} key={props.task.id}>
            <Flex>
                <Badge
                    mb="sm"
                    size="lg"
                    color="grape"
                    radius="md"
                    variant="light"
                    leftSection={<IconChecklist size={16} />}
                >
                    <FormattedMessage id={locales.task} values={{ index: props.index + 1 }} />
                </Badge>
                {props.index != 0 && (
                    <ActionIcon ml="auto" variant="light" color="red" onClick={() => props.onDelete(props.task.id)}>
                        <IconTrashX size={16} />
                    </ActionIcon>
                )}
            </Flex>
            <TextInput name="name" mb="xs" withAsterisk label={<FormattedMessage id={locales.taskName} />} />
            <Textarea
                name="description"
                mb="xs"
                autosize
                minRows={3}
                maxRows={3}
                label={<FormattedMessage id={locales.taskDescription} />}
                description={<FormattedMessage id={locales.taskDescriptionDescription} />}
            />
            <TextInput
                name="result"
                mb="xs"
                label={<FormattedMessage id={locales.result} />}
                description={<FormattedMessage id={locales.resultDescription} />}
                leftSection={<IconLink size={18} />}
            />
            <SimpleGrid cols={2} mb="xs">
                <NumberInput
                    name="timeSpent"
                    withAsterisk
                    label={<FormattedMessage id={locales.timeSpent} />}
                    description={<FormattedMessage id={locales.timeSpentDescription} />}
                    suffix=" ч."
                    min={1}
                    max={40}
                    mt="auto"
                    leftSection={<IconClock size={18} />}
                />
                <DateInput
                    name="date"
                    mt="auto"
                    withAsterisk
                    label={<FormattedMessage id={locales.taskDate} />}
                    description={<FormattedMessage id={locales.taskDateDescription} />}
                    valueFormat="DD MMM YYYY"
                    minDate={dayjs(new Date()).subtract(16, "day").toDate()}
                    maxDate={new Date()}
                    leftSection={<IconCalendar size={18} />}
                />
            </SimpleGrid>
            <Select
                name="customer"
                mb="md"
                label="Заказчик"
                description="Кто был инициатором задачи (опционально)"
                nothingFoundMessage="Пользователей не найдено"
                placeholder="Имя Фамилия"
                data={[]}
                clearable
                searchable
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                leftSection={<IconUser size={18} />}
            />
            <DropzoneArea />
        </Flex>
    )
})
