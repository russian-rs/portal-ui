import { Button, Card, Flex, Select, Text, Textarea, TextInput, Title } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { AnnouncementAudience, AnnouncementCreateRequest } from "@russian-rs/portal-api-axios"
import { IconSend } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useContext, useEffect, useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { AnnouncementApiService } from "src/shared/api/AnnouncementApiService"
import { ProgramsApiService } from "src/shared/api/ProgramsApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { hasPermission } from "src/shared/user/roles"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { z } from "zod"
import classes from "./AnnouncementsAdminPage.module.scss"

const ADMIN_ROLES = ["ADMIN", "ADMIN_VOLUNTEER", "ADMIN_SSO"]

type AnnouncementFormValues = {
    title: string
    body: string
    audience: AnnouncementAudience
    programCode: string | null
}

export const AnnouncementsAdminPage: React.FC = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()
    const queryClient = useQueryClient()

    setDocumentTitleByLocale("pages.announcements.admin.title")

    useEffect(() => {
        if (!hasPermission(user, ADMIN_ROLES)) {
            navigate("/unauthorized", { replace: true })
        }
    }, [user, navigate])

    const requiredMessage = { message: intl.formatMessage({ id: "pages.announcements.admin.required" }) }
    const minMessage = (count: number) =>
        intl.formatMessage({ id: "pages.user-list.min-letters" }, { count })
    const maxMessage = (count: number) =>
        intl.formatMessage({ id: "pages.user-list.max-letters" }, { count })

    const validationSchema = useMemo(
        () =>
            z
                .object({
                    title: z.string(requiredMessage).trim().min(3, minMessage(3)).max(200, maxMessage(200)),
                    body: z.string(requiredMessage).trim().min(1, requiredMessage).max(10000, maxMessage(10000)),
                    audience: z.enum([AnnouncementAudience.All, AnnouncementAudience.Program], requiredMessage),
                    programCode: z.string().nullable(),
                })
                .superRefine((values, ctx) => {
                    if (values.audience === AnnouncementAudience.Program && !values.programCode) {
                        ctx.addIssue({
                            code: z.ZodIssueCode.custom,
                            path: ["programCode"],
                            message: intl.formatMessage({ id: "pages.announcements.admin.emptyProgram" }),
                        })
                    }
                }),
        [intl]
    )

    const form = useForm<AnnouncementFormValues>({
        initialValues: {
            title: "",
            body: "",
            audience: AnnouncementAudience.All,
            programCode: null,
        },
        validate: zodResolver(validationSchema),
    })

    const { data: programs = [] } = useQuery({
        queryKey: ["programs"],
        queryFn: () => ProgramsApiService.getPrograms().then((r) => r.data),
    })

    const programOptions = useMemo(
        () =>
            programs.map((program) => ({
                value: program.code,
                label: getLocalizedName(program, intl.locale) || program.code,
            })),
        [programs, intl.locale]
    )

    const { mutate: publish, isPending } = useMutation({
        mutationFn: (payload: AnnouncementCreateRequest) =>
            AnnouncementApiService.createAnnouncement(payload).then((r) => r.data),
        onSuccess: () => {
            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.announcements.admin.success" />
                    </Text>,
                    null
                )
            )
            form.reset()
            queryClient.invalidateQueries({ queryKey: ["announcements"] })
        },
    })

    const onPublish = form.onSubmit((values) => {
        publish({
            title: values.title.trim(),
            body: values.body.trim(),
            audience: values.audience,
            programCode: values.audience === AnnouncementAudience.Program ? values.programCode : null,
        })
    })

    return (
        <Flex className={classes.root} direction="column" gap="lg">
            <Title order={2}>
                <FormattedMessage id="pages.announcements.admin.title" />
            </Title>
            <Text c="dimmed">
                <FormattedMessage id="pages.announcements.admin.description" />
            </Text>

            <Card withBorder p="lg">
                <form onSubmit={onPublish}>
                    <Flex direction="column" gap="md">
                        <TextInput
                            label={<FormattedMessage id="pages.announcements.admin.fields.title" />}
                            maxLength={200}
                            {...form.getInputProps("title")}
                        />
                        <Textarea
                            label={<FormattedMessage id="pages.announcements.admin.fields.body" />}
                            description={<FormattedMessage id="pages.announcements.admin.fields.bodyHint" />}
                            minRows={6}
                            autosize
                            maxLength={10000}
                            {...form.getInputProps("body")}
                        />
                        <Select
                            label={<FormattedMessage id="pages.announcements.admin.fields.audience" />}
                            data={[
                                {
                                    value: AnnouncementAudience.All,
                                    label: intl.formatMessage({ id: "pages.announcements.admin.audience.all" }),
                                },
                                {
                                    value: AnnouncementAudience.Program,
                                    label: intl.formatMessage({ id: "pages.announcements.admin.audience.program" }),
                                },
                            ]}
                            {...form.getInputProps("audience")}
                            onChange={(value) => {
                                form.setFieldValue("audience", (value as AnnouncementAudience) || AnnouncementAudience.All)
                                if (value !== AnnouncementAudience.Program) {
                                    form.setFieldValue("programCode", null)
                                }
                            }}
                        />
                        {form.values.audience === AnnouncementAudience.Program && (
                            <Select
                                label={<FormattedMessage id="pages.announcements.admin.fields.program" />}
                                placeholder={intl.formatMessage({
                                    id: "pages.announcements.admin.fields.programPlaceholder",
                                })}
                                data={programOptions}
                                searchable
                                {...form.getInputProps("programCode")}
                            />
                        )}
                        <Button type="submit" leftSection={<IconSend size={16} />} loading={isPending}>
                            <FormattedMessage id="pages.announcements.admin.publish" />
                        </Button>
                    </Flex>
                </form>
            </Card>
        </Flex>
    )
}

export default AnnouncementsAdminPage
