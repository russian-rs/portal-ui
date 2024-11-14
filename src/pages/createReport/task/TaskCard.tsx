import { ActionIcon, Badge, Flex, NumberInput, Select, SimpleGrid, Textarea, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm, zodResolver } from "@mantine/form"
import { FormValidationResult } from "@mantine/form/lib/types"
import { TaskDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconChecklist, IconClock, IconLink, IconTrashX, IconUser } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserApiService } from "src/shared/api/UserApiService"
import { DropzoneArea } from "src/shared/ui/dropzone/DropzoneArea"
import { z } from "zod"
import { locales } from "./constants"
import classes from "./TaskCard.module.scss"

interface TaskCardProps {
    task: TaskDto
    index: number
    onChange: (id: string, updatedTask: TaskDto) => void
    onDelete: (id: string) => void
}

export interface TaskCardInterface {
    validate: () => FormValidationResult
    getValues: () => TaskDto
    scrollIntoView: () => void
}

export const TaskCard = forwardRef<TaskCardInterface, TaskCardProps>((props, ref) => {
    const [searchValue, setSearchValue] = useState("")
    const cardRef = useRef<HTMLDivElement>(null)

    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(validationSchema),
    })

    useImperativeHandle(ref, () => ({
        scrollIntoView: () => {
            cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        },
        validate: () => form.validate(),
        getValues: () => {
            const values = form.getValues()
            return {
                id: props.task.id,
                name: values.name.trim(),
                description: values.description.trim(),
                result: values.result,
                timeSpent: values.timeSpent * 60,
                date: dayjs(values.date).format("YYYY-MM-DD"),
                customer: values.customer,
                files: props.task.files,
            }
        },
    }))

    const { data: users = [], isFetching } = useQuery({
        queryKey: ["searchUsers", searchValue],
        queryFn: () => UserApiService.searchUsers(searchValue, {}).then((response) => response.data.content),
    })

    return (
        <Flex direction="column" className={classes.taskCard} ref={cardRef} key={props.task.id} rowGap={10}>
            <Flex>
                <Badge size="lg" color="grape" radius="md" variant="light" leftSection={<IconChecklist size={16} />}>
                    <FormattedMessage id={locales.task} values={{ index: props.index + 1 }} />
                </Badge>
                {props.index != 0 && (
                    <ActionIcon ml="auto" variant="light" color="red" onClick={() => props.onDelete(props.task.id)}>
                        <IconTrashX size={16} />
                    </ActionIcon>
                )}
            </Flex>
            <TextInput
                name="name"
                withAsterisk
                key={form.key("name")}
                {...form.getInputProps("name")}
                label={<FormattedMessage id={locales.taskName} />}
            />
            <Textarea
                autosize
                minRows={3}
                maxRows={3}
                withAsterisk
                name="description"
                key={form.key("description")}
                {...form.getInputProps("description")}
                label={<FormattedMessage id={locales.taskDescription} />}
                description={<FormattedMessage id={locales.taskDescriptionDescription} />}
            />
            <TextInput
                name="result"
                key={form.key("result")}
                {...form.getInputProps("result")}
                label={<FormattedMessage id={locales.result} />}
                description={<FormattedMessage id={locales.resultDescription} />}
                leftSection={<IconLink size={18} />}
            />
            <SimpleGrid cols={2}>
                <NumberInput
                    min={1}
                    max={40}
                    mt="auto"
                    withAsterisk
                    suffix=" ч."
                    name="timeSpent"
                    key={form.key("timeSpent")}
                    {...form.getInputProps("timeSpent")}
                    label={<FormattedMessage id={locales.timeSpent} />}
                    description={<FormattedMessage id={locales.timeSpentDescription} />}
                    leftSection={<IconClock size={18} />}
                    inputWrapperOrder={["label", "description", "error", "input"]}
                />
                <DateInput
                    mt="auto"
                    name="date"
                    withAsterisk
                    valueFormat="DD MMM YYYY"
                    key={form.key("date")}
                    {...form.getInputProps("date")}
                    label={<FormattedMessage id={locales.taskDate} />}
                    description={<FormattedMessage id={locales.taskDateDescription} />}
                    minDate={dayjs(new Date()).subtract(16, "day").toDate()}
                    maxDate={new Date()}
                    leftSection={<IconCalendar size={18} />}
                    inputWrapperOrder={["label", "description", "error", "input"]}
                />
            </SimpleGrid>
            <Select
                data={[]}
                clearable
                searchable
                name="customer"
                label="Заказчик"
                key={form.key("customer")}
                {...form.getInputProps("customer")}
                description="Кто был инициатором задачи (опционально)"
                nothingFoundMessage="Пользователей не найдено"
                placeholder="Имя Фамилия"
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                leftSection={<IconUser size={18} />}
            />
            <DropzoneArea />
        </Flex>
    )
})

const requiredMessage = { message: "Обязательно" }

const validationSchema = z.object({
    name: z.string(requiredMessage).min(10, "Minimum 10 letters"),
    description: z.string(requiredMessage).min(20, "Minimum 20 letters"),
    result: z.string().url().optional().or(z.literal("")),
    timeSpent: z.number(requiredMessage).min(1, "Минимум 1 час"),
    date: z.date(requiredMessage),
})
