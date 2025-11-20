import { Button, Flex, Group, Pill, SimpleGrid, Text, Textarea, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { useForm, zodResolver } from "@mantine/form"
import { FileInfoDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconDeviceFloppy, IconId, IconTrash } from "@tabler/icons-react"
import dayjs from "dayjs"
import { FormattedMessage, useIntl } from "react-intl"
import { FileUploader } from "src/shared/ui/fileUploader/FileUploader"
import { z } from "zod"
import { ResidencePermitDto } from "./types/residencePermit"

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

    const requiredMessage = { message: intl.formatMessage({ id: "pages.profile.residencePermit.required" }) }

    const validationSchema = z.object({
        nationality: z.string(requiredMessage).min(1),
        registrationNumber: z
            .string(requiredMessage)
            .regex(/^\d{9}$/, intl.formatMessage({ id: "pages.profile.residencePermit.validation.registrationNumber" })),
        validUntil: z.date(requiredMessage),
        purposeOfStay: z.string(requiredMessage).min(1),
        identityNumber: z
            .string(requiredMessage)
            .regex(/^\d{13}$/, intl.formatMessage({ id: "pages.profile.residencePermit.validation.identityNumber" })),
        issuingDate: z.date(requiredMessage),
        issuingAuthority: z.string(requiredMessage).min(1),
        stateOfBirth: z.string(requiredMessage).min(1),
        frontSidePhoto: z.any().refine((file) => file !== null, requiredMessage),
        backSidePhoto: z.any().refine((file) => file !== null, requiredMessage),
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
                        label={<FormattedMessage id="pages.profile.residencePermit.nationality" />}
                        withAsterisk
                        {...form.getInputProps("nationality")}
                    />
                    <TextInput
                        label={<FormattedMessage id="pages.profile.residencePermit.purpose-of-stay" />}
                        withAsterisk
                        {...form.getInputProps("purposeOfStay")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput
                        label={<FormattedMessage id="pages.profile.residencePermit.registrationNumber" />}
                        description={<FormattedMessage id="pages.profile.residencePermit.registrationNumber.description" />}
                        leftSection={<IconId size={16} />}
                        withAsterisk
                        {...form.getInputProps("registrationNumber")}
                    />
                    <TextInput
                        label={<FormattedMessage id="pages.profile.residencePermit.identityNumber" />}
                        description={<FormattedMessage id="pages.profile.residencePermit.identityNumber.description" />}
                        leftSection={<IconId size={16} />}
                        withAsterisk
                        {...form.getInputProps("identityNumber")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <DateInput
                        label={<FormattedMessage id="pages.profile.residencePermit.issuingDate" />}
                        leftSection={<IconCalendar size={16} />}
                        valueFormat="DD MMMM YYYY"
                        withAsterisk
                        {...form.getInputProps("issuingDate")}
                    />
                    <DateInput
                        label={<FormattedMessage id="pages.profile.residencePermit.valid-until" />}
                        leftSection={<IconCalendar size={16} />}
                        valueFormat="DD MMMM YYYY"
                        withAsterisk
                        {...form.getInputProps("validUntil")}
                    />
                </SimpleGrid>

                <SimpleGrid cols={{ base: 1, sm: 2 }}>
                    <TextInput
                        label={<FormattedMessage id="pages.profile.residencePermit.issuingAuthority" />}
                        withAsterisk
                        {...form.getInputProps("issuingAuthority")}
                    />
                    <TextInput
                        label={<FormattedMessage id="pages.profile.residencePermit.stateOfBirth" />}
                        withAsterisk
                        {...form.getInputProps("stateOfBirth")}
                    />
                </SimpleGrid>

                <Textarea
                    label={<FormattedMessage id="pages.profile.residencePermit.note" />}
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
                            <Pill
                                key={form.values.frontSidePhoto.id}
                                withRemoveButton
                                onRemove={() => form.setFieldValue("frontSidePhoto", null)}
                                mt="xs"
                            >
                                <Text size="sm" truncate="end" style={{ maxWidth: "200px" }}>
                                    {form.values.frontSidePhoto.name}
                                </Text>
                            </Pill>
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
                            <Pill
                                key={form.values.backSidePhoto.id}
                                withRemoveButton
                                onRemove={() => form.setFieldValue("backSidePhoto", null)}
                                mt="xs"
                            >
                                <Text size="sm" truncate="end" style={{ maxWidth: "200px" }}>
                                    {form.values.backSidePhoto.name}
                                </Text>
                            </Pill>
                        )}
                    </div>
                </SimpleGrid>

                <Group justify="flex-end" mt="md">
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
        </form>
    )
}
