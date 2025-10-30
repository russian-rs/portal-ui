import {
    ActionIcon,
    Badge,
    Flex,
    Loader,
    NumberInput,
    Pill,
    SimpleGrid,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { FormValidationResult } from "@mantine/form/lib/types"
import { FileInfoDto, TaskDto } from "@russian-rs/portal-api-axios"
import { IconChecklist, IconClock, IconLink, IconTrashX } from "@tabler/icons-react"
import dayjs from "dayjs"
import { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { locales } from "src/pages/reportEdit/task/lib/locales"
import { DayPicker } from "src/shared/ui/dayPicker/DayPicker"
import { FileUploader, FileUploaderInterface } from "src/shared/ui/fileUploader/FileUploader"
import { UserSearch } from "src/shared/ui/userSearch/UserSearch"
import { z } from "zod"
import classes from "./TaskCard.module.scss"

interface TaskCardProps {
    task: TaskDto
    index: number
    deletable: boolean
    editMode?: boolean
    onChange: (id: string, updatedTask: TaskDto) => void
    onDelete: (id: string) => void
}

export interface TaskCardInterface {
    validate: () => FormValidationResult
    getValues: () => TaskDto
    scrollIntoView: () => void
}

export const TaskCard = forwardRef<TaskCardInterface, TaskCardProps>((props, ref) => {
    const cardRef = useRef<HTMLDivElement>(null)

    const intl = useIntl()

    const editMode = props.editMode || false

    const requiredMessage = { message: intl.formatMessage({ id: locales.required }) }

    const validationSchema = z.object({
        name: z.string(requiredMessage).min(10, intl.formatMessage({ id: locales.minLetters }, { count: 10 })),
        description: z.string(requiredMessage).min(20, intl.formatMessage({ id: locales.minLetters }, { count: 20 })),
        result: z
            .string()
            .url(intl.formatMessage({ id: locales.invalidUrl }))
            .optional()
            .or(z.literal("")),
        timeSpent: z.number(requiredMessage).min(1),
        date: z.date(requiredMessage),
        customer: z.string().optional(),
    })

    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(validationSchema),
        initialValues: {
            name: props.task.name,
            description: props.task.description,
            result: props.task.result ? props.task.result : "",
            timeSpent: editMode ? props.task.timeSpent / 60 : null,
            date: editMode ? dayjs(props.task.date).toDate() : null,
            customer: props.task.customer,
        },
    })

    const fileUploaderRef = createRef<FileUploaderInterface>()
    const [uploadedFiles, setUploadedFiles] = useState<FileInfoDto[]>([])
    const [loadingFiles, setLoadingFiles] = useState<String[]>([])

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
                timeSpent: values.timeSpent ? values.timeSpent * 60 : 0,
                date: dayjs(values.date).format("YYYY-MM-DD"),
                customer: values.customer,
                files: uploadedFiles,
            }
        },
    }))

    useEffect(() => {
        if (editMode && props.task.files) {
            setUploadedFiles(props.task.files)
        }
    }, [])

    return (
        <Flex direction="column" className={classes.taskCard} ref={cardRef} key={props.task.id} rowGap={10}>
            <Flex>
                <Badge size="lg" color="grape" radius="md" variant="light" leftSection={<IconChecklist size={16} />}>
                    <FormattedMessage id={locales.task} values={{ index: props.index + 1 }} />
                </Badge>
                {props.deletable && (
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
                    max={12}
                    mt="auto"
                    withAsterisk
                    suffix={intl.formatMessage({ id: locales.timeSpentSuffix })}
                    name="timeSpent"
                    key={form.key("timeSpent")}
                    {...form.getInputProps("timeSpent")}
                    label={<FormattedMessage id={locales.timeSpent} />}
                    description={<FormattedMessage id={locales.timeSpentDescription} />}
                    leftSection={<IconClock size={18} />}
                    inputWrapperOrder={["label", "description", "error", "input"]}
                />
                <Flex mt="auto">
                    <DayPicker
                        label={<FormattedMessage id={locales.taskDate} />}
                        description={<FormattedMessage id={locales.taskDateDescription} />}
                        withAsterisk
                        error={form.errors.date}
                        onChange={(date) => {
                            form.setFieldValue("date", date)
                        }}
                        targetClassName={classes.dayPickerTarget}
                        initialDate={editMode ? props.task.date : null}
                        minDate={dayjs(new Date()).subtract(21, "day").toDate()}
                        maxDate={new Date()}
                    />
                </Flex>
            </SimpleGrid>
            <UserSearch
                form={form}
                path="customer"
                label={<FormattedMessage id={locales.customer} />}
                description={<FormattedMessage id={locales.customerDescription} />}
                initialSearch={editMode && props.task.customer ? props.task.customer : undefined}
            />
            <FileUploader
                maxFiles={15}
                maxSize={5}
                ref={fileUploaderRef}
                files={uploadedFiles}
                onFilesUploaded={(files) => setUploadedFiles(files)}
                onFilesLoading={(files) => setLoadingFiles(files)}
            />
            {(uploadedFiles.length !== 0 || loadingFiles.length !== 0) && (
                <Flex className={classes.filesContainer} wrap="wrap">
                    {uploadedFiles.map((file) => {
                        return (
                            <Pill
                                key={file.id}
                                withRemoveButton
                                className={classes.filePill}
                                onRemove={() => fileUploaderRef.current?.delete(file.id)}
                            >
                                <Text className={classes.filePillText} truncate="end">
                                    {file.name}
                                </Text>
                            </Pill>
                        )
                    })}
                    {loadingFiles.map((file, index) => {
                        return (
                            <Pill key={index} className={classes.filePill}>
                                <Flex justify="center" align="center" columnGap={6}>
                                    <Text className={classes.filePillText} truncate="end" c="dimmed">
                                        {file}
                                    </Text>
                                    <Loader size={10} stroke="4" />
                                </Flex>
                            </Pill>
                        )
                    })}
                </Flex>
            )}
        </Flex>
    )
})
