import { Button, Card, Flex, Select, Text, Textarea, TextInput, Title } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconSend } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import {
    AnnouncementApiService,
    AnnouncementAudience,
    AnnouncementCreateRequest,
} from "src/shared/api/AnnouncementApiService"
import { ProgramsApiService } from "src/shared/api/ProgramsApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { hasPermission } from "src/shared/user/roles"
import classes from "./AnnouncementsAdminPage.module.scss"

const ADMIN_ROLES = ["ADMIN", "ADMIN_VOLUNTEER", "ADMIN_SSO"]

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

    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [audience, setAudience] = useState<AnnouncementAudience>("ALL")
    const [programCode, setProgramCode] = useState<string | null>(null)

    const { data: programs = [] } = useQuery({
        queryKey: ["programs"],
        queryFn: () => ProgramsApiService.getPrograms().then((r) => r.data),
    })

    const { mutate: publish, isPending } = useMutation({
        mutationFn: (payload: AnnouncementCreateRequest) => AnnouncementApiService.create(payload),
        onSuccess: () => {
            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.announcements.admin.success" />
                    </Text>,
                    null
                )
            )
            setTitle("")
            setBody("")
            setAudience("ALL")
            setProgramCode(null)
            queryClient.invalidateQueries({ queryKey: ["announcements"] })
        },
    })

    const onPublish = () => {
        if (title.trim().length < 3) {
            alert(intl.formatMessage({ id: "pages.announcements.admin.emptyTitle" }))
            return
        }
        if (!body.trim()) {
            alert(intl.formatMessage({ id: "pages.announcements.admin.emptyBody" }))
            return
        }
        if (audience === "PROGRAM" && !programCode) {
            alert(intl.formatMessage({ id: "pages.announcements.admin.emptyProgram" }))
            return
        }

        publish({
            title: title.trim(),
            body: body.trim(),
            audience,
            programCode: audience === "PROGRAM" ? programCode : null,
        })
    }

    return (
        <Flex className={classes.root} direction="column" gap="lg">
            <Title order={2}>
                <FormattedMessage id="pages.announcements.admin.title" />
            </Title>
            <Text c="dimmed">
                <FormattedMessage id="pages.announcements.admin.description" />
            </Text>

            <Card withBorder p="lg">
                <Flex direction="column" gap="md">
                    <TextInput
                        label={<FormattedMessage id="pages.announcements.admin.fields.title" />}
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        required
                    />
                    <Textarea
                        label={<FormattedMessage id="pages.announcements.admin.fields.body" />}
                        description={<FormattedMessage id="pages.announcements.admin.fields.bodyHint" />}
                        value={body}
                        onChange={(e) => setBody(e.currentTarget.value)}
                        minRows={6}
                        autosize
                        required
                    />
                    <Select
                        label={<FormattedMessage id="pages.announcements.admin.fields.audience" />}
                        value={audience}
                        onChange={(value) => setAudience((value as AnnouncementAudience) || "ALL")}
                        data={[
                            { value: "ALL", label: intl.formatMessage({ id: "pages.announcements.admin.audience.all" }) },
                            {
                                value: "PROGRAM",
                                label: intl.formatMessage({ id: "pages.announcements.admin.audience.program" }),
                            },
                        ]}
                    />
                    {audience === "PROGRAM" && (
                        <Select
                            label={<FormattedMessage id="pages.announcements.admin.fields.program" />}
                            placeholder={intl.formatMessage({ id: "pages.announcements.admin.fields.programPlaceholder" })}
                            value={programCode}
                            onChange={setProgramCode}
                            data={programs.map((p) => ({ value: p.code, label: p.nameRu || p.code }))}
                            searchable
                            required
                        />
                    )}
                    <Button leftSection={<IconSend size={16} />} loading={isPending} onClick={onPublish}>
                        <FormattedMessage id="pages.announcements.admin.publish" />
                    </Button>
                </Flex>
            </Card>
        </Flex>
    )
}

export default AnnouncementsAdminPage
