import {
    ActionIcon,
    Button,
    Flex,
    Group,
    Image,
    Modal,
    Pill,
    SimpleGrid,
    Text,
    Textarea,
    TextInput,
} from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm, zodResolver } from "@mantine/form"
import { ResidencePermitDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconDeviceFloppy, IconEye, IconId, IconTrash } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { FileUploader } from "src/shared/ui/fileUploader/FileUploader"
import { z } from "zod"

interface ResidencePermitFormProps {
    initialValues: ResidencePermitDto
    onSubmit: (values: ResidencePermitDto) => void
    onDelete?: () => void
    canDelete: boolean
    isNew?: boolean
    onCancel: () => void
}

export const ResidencePermitForm = ({
    initialValues,
    onSubmit,
    onDelete,
    canDelete,
    isNew,
    onCancel,
}: ResidencePermitFormProps) => {
    const intl = useIntl()
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const requiredMessage = { message: intl.formatMessage({ id: "pages.profile.residencePermit.required" }) }

    const validationSchema = z
        .object({
            nationality: z.string(requiredMessage).min(1),
            registrationNumber: z
                .string(requiredMessage)
                .regex(
                    /^\d{9}$/,
                    intl.formatMessage({ id: "pages.profile.residencePermit.validation.registrationNumber" })
                ),
            validUntil: z.date(requiredMessage),
            purposeOfStay: z.string(requiredMessage).min(1),
            identityNumber: z
                .string(requiredMessage)
                .regex(
                    /^\d{13}$/,
                    intl.formatMessage({ id: "pages.profile.residencePermit.validation.identityNumber" })
                ),
            issuingDate: z.date(requiredMessage),
            issuingAuthority: z.string(requiredMessage).min(1),
            stateOfBirth: z.string(requiredMessage).min(1),
            frontSidePhoto: z.any().refine((file) => file !== null, requiredMessage),
            backSidePhoto: z.any().refine((file) => file !== null, requiredMessage),
        })
        .refine((data) => dayjs(data.validUntil).isAfter(dayjs(data.issuingDate)), {
            message: intl.formatMessage({ id: "pages.profile.validation.endDateAfterStart" }),
            path: ["validUntil"],
        })

    const form = useForm({
        initialValues: {
            ...initialValues,
            validUntil: initialValues.validUntil ? dayjs(initialValues.validUntil).toDate() : undefined,
            issuingDate: initialValues.issuingDate ? dayjs(initialValues.issuingDate).toDate() : undefined,
            frontSidePhoto: initialValues.frontSidePhoto || null,
            backSidePhoto: initialValues.backSidePhoto || null,
        },
        validate: zodResolver(validationSchema),
    })

    const handleSubmit = (values: typeof form.values) => {
        const dto: ResidencePermitDto = {
            ...initialValues,
            ...values,
            validUntil: dayjs(values.validUntil).format("YYYY-MM-DD"),
            issuingDate: dayjs(values.issuingDate).format("YYYY-MM-DD"),
            frontSidePhoto: values.frontSidePhoto,
            backSidePhoto: values.backSidePhoto,
        }
        onSubmit(dto)
    }

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Flex direction="column" gap="sm">
                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput
                        label={
                            <>
                                <strong>Држављанство</strong>/Nationality
                            </>
                        }
                        withAsterisk
                        {...form.getInputProps("nationality")}
                    />
                    <TextInput
                        label={
                            <>
                                <strong>Основ боравка</strong>/Purpose of stay
                            </>
                        }
                        withAsterisk
                        {...form.getInputProps("purposeOfStay")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput
                        label={
                            <>
                                <strong>Рег.бр</strong>/Reg No
                            </>
                        }
                        description={
                            <FormattedMessage id="pages.profile.residencePermit.registrationNumber.description" />
                        }
                        leftSection={<IconId size={16} />}
                        withAsterisk
                        {...form.getInputProps("registrationNumber")}
                    />
                    <TextInput
                        label={
                            <>
                                <strong>Евиденцијски број</strong>/Identity number (JMBG)
                            </>
                        }
                        description={<FormattedMessage id="pages.profile.residencePermit.identityNumber.description" />}
                        leftSection={<IconId size={16} />}
                        withAsterisk
                        {...form.getInputProps("identityNumber")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <DateInput
                        label={
                            <>
                                <strong>Датум издавања</strong>/Issue date
                            </>
                        }
                        leftSection={<IconCalendar size={16} />}
                        valueFormat="DD MMMM YYYY"
                        withAsterisk
                        {...form.getInputProps("issuingDate")}
                    />
                    <DateInput
                        label={
                            <>
                                <strong>Важи до</strong>/Valid until
                            </>
                        }
                        leftSection={<IconCalendar size={16} />}
                        valueFormat="DD MMMM YYYY"
                        withAsterisk
                        {...form.getInputProps("validUntil")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput
                        label={
                            <>
                                <strong>Документ издаjе</strong>/Issuing authority
                            </>
                        }
                        withAsterisk
                        {...form.getInputProps("issuingAuthority")}
                    />
                    <TextInput
                        label={
                            <>
                                <strong>Држава рођења</strong>/State of birth
                            </>
                        }
                        withAsterisk
                        {...form.getInputProps("stateOfBirth")}
                    />
                </SimpleGrid>

                <Textarea
                    label={
                        <>
                            <strong>Напомена</strong>/Note
                        </>
                    }
                    {...form.getInputProps("note")}
                />

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <div>
                        <Text size="sm" fw={500} mb={4}>
                            <FormattedMessage id="pages.profile.residencePermit.frontSidePhoto" />
                            <span style={{ color: "var(--mantine-color-red-6)" }}> *</span>
                        </Text>
                        <FileUploader
                            files={form.values.frontSidePhoto ? [form.values.frontSidePhoto] : []}
                            onFilesUploaded={(files) => form.setFieldValue("frontSidePhoto", files[0] || null)}
                            maxFiles={1}
                        />
                        {form.errors.frontSidePhoto && (
                            <Text c="red" size="xs" mt={2}>
                                {form.errors.frontSidePhoto}
                            </Text>
                        )}
                        {form.values.frontSidePhoto && (
                            <Group gap="xs" mt="xs">
                                <Pill
                                    key={form.values.frontSidePhoto.id}
                                    withRemoveButton
                                    onRemove={() => form.setFieldValue("frontSidePhoto", null)}
                                >
                                    <Text size="sm" truncate="end" style={{ maxWidth: "200px" }}>
                                        {form.values.frontSidePhoto.name}
                                    </Text>
                                </Pill>
                                {form.values.frontSidePhoto.link && (
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        color="gray"
                                        onClick={() => setPreviewImage(form.values.frontSidePhoto?.link || null)}
                                    >
                                        <IconEye size={16} />
                                    </ActionIcon>
                                )}
                            </Group>
                        )}
                    </div>
                    <div>
                        <Text size="sm" fw={500} mb={4}>
                            <FormattedMessage id="pages.profile.residencePermit.backSidePhoto" />
                            <span style={{ color: "var(--mantine-color-red-6)" }}> *</span>
                        </Text>
                        <FileUploader
                            files={form.values.backSidePhoto ? [form.values.backSidePhoto] : []}
                            onFilesUploaded={(files) => form.setFieldValue("backSidePhoto", files[0] || null)}
                            maxFiles={1}
                        />
                        {form.errors.backSidePhoto && (
                            <Text c="red" size="xs" mt={2}>
                                {form.errors.backSidePhoto}
                            </Text>
                        )}
                        {form.values.backSidePhoto && (
                            <Group gap="xs" mt="xs">
                                <Pill
                                    key={form.values.backSidePhoto.id}
                                    withRemoveButton
                                    onRemove={() => form.setFieldValue("backSidePhoto", null)}
                                >
                                    <Text size="sm" truncate="end" style={{ maxWidth: "200px" }}>
                                        {form.values.backSidePhoto.name}
                                    </Text>
                                </Pill>
                                {form.values.backSidePhoto.link && (
                                    <ActionIcon
                                        variant="subtle"
                                        size="sm"
                                        color="gray"
                                        onClick={() => setPreviewImage(form.values.backSidePhoto?.link || null)}
                                    >
                                        <IconEye size={16} />
                                    </ActionIcon>
                                )}
                            </Group>
                        )}
                    </div>
                </SimpleGrid>

                <Group justify="flex-end" mt="md" wrap="nowrap">
                    {canDelete && (
                        <Button variant="subtle" color="red" onClick={onDelete} leftSection={<IconTrash size={16} />}>
                            <FormattedMessage id="common.buttons.delete" defaultMessage="Delete" />
                        </Button>
                    )}
                    <Button variant="default" onClick={onCancel}>
                        <FormattedMessage id="pages.applications.report.cancel" />
                    </Button>
                    <Button type="submit" leftSection={<IconDeviceFloppy size={16} />}>
                        <FormattedMessage id="pages.profile.residencePermit.save" />
                    </Button>
                </Group>
            </Flex>
            <Modal opened={!!previewImage} onClose={() => setPreviewImage(null)} size="auto" centered>
                {previewImage && <Image src={previewImage} style={{ maxHeight: "80vh" }} />}
            </Modal>
        </form>
    )
}
