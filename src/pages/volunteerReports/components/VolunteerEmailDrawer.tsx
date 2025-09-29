import { Button, Drawer, Flex, Loader, Pill, Text, Textarea, TextInput } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { Link, RichTextEditor } from "@mantine/tiptap"
import { FileInfoDto } from "@russian-rs/portal-api-axios"
import { IconMailForward } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import Highlight from "@tiptap/extension-highlight"
import SubScript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import React, { createRef, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { MailApiService } from "src/shared/api/MailApiService"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { FileUploader, FileUploaderInterface } from "src/shared/ui/fileUploader/FileUploader"
import classes from "./VolunteerEmailDrawer.module.scss"

interface VolunteerEmailDrawerProps {
    opened: boolean
    close: () => void
    recipients: { name: string; email: string }[]
    subject?: string
}

export const VolunteerEmailDrawer = (props: VolunteerEmailDrawerProps) => {
    const intl = useIntl()

    const [topic, setTopic] = useState(props.subject || "")
    const [content, setContent] = useState("")

    const fileUploaderRef = createRef<FileUploaderInterface>()
    const [uploadedFiles, setUploadedFiles] = useState<FileInfoDto[]>([])
    const [loadingFiles, setLoadingFiles] = useState<String[]>([])

    const { isFetching: sending, refetch: send } = useQuery({
        enabled: false,
        queryKey: ["sendVolunteerEmail", topic, content, props.recipients.map((r) => r.email).join(",")],
        queryFn: async () => {
            for (const recipient of props.recipients) {
                await MailApiService.sendMail(
                    topic,
                    content,
                    undefined,
                    recipient.email,
                    undefined,
                    uploadedFiles.map((f) => f.id)
                )
            }
            notifications.show(SuccessNotification(<Text size="sm">Отправлено</Text>, null))
            props.close()
            setTopic("")
            setContent("")
        },
    })

    const editor = useEditor(
        {
            extensions: [
                StarterKit,
                Underline,
                Link,
                Superscript,
                SubScript,
                Highlight,
                TextAlign.configure({ types: ["heading", "paragraph"] }),
            ],
            editable: !sending,
            content: content,
            onUpdate: ({ editor }) => {
                setContent(editor.getHTML())
            },
        },
        [sending]
    )

    const onSend = () => {
        if (topic.trim() === "") {
            alert(intl.formatMessage({ id: "common.email-drawer.emptySubject" }))
            return
        }
        if (content.trim() === "") {
            alert(intl.formatMessage({ id: "common.email-drawer.emptyContent" }))
            return
        }
        send()
    }

    return (
        <Drawer
            opened={props.opened}
            onClose={props.close}
            title={<FormattedMessage id="common.email-drawer.title" />}
            offset={16}
            radius="md"
            size="xl"
        >
            <Flex direction="column" className={classes.drawer}>
                <Textarea
                    label={<FormattedMessage id="common.email-drawer.recipients" />}
                    disabled={true}
                    autosize
                    minRows={1}
                    withAsterisk
                    value={props.recipients.map((r) => `${r.name} <${r.email}>`).join(", ")}
                />
                <TextInput
                    withAsterisk
                    label={<FormattedMessage id="common.email-drawer.subject" />}
                    value={topic}
                    onChange={(event) => setTopic(event.target.value)}
                />
                <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Highlight />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Undo />
                            <RichTextEditor.Redo />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content className={classes.editor} />
                </RichTextEditor>
                <FileUploader
                    ref={fileUploaderRef}
                    maxFiles={5}
                    maxSize={10}
                    onFilesUploaded={(files) => setUploadedFiles(files)}
                    onFilesLoading={(files) => setLoadingFiles(files)}
                />
                {(uploadedFiles.length !== 0 || loadingFiles.length !== 0) && (
                    <Flex className={classes.filesContainer} wrap="wrap">
                        {uploadedFiles.map((file) => (
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
                        ))}
                        {loadingFiles.map((file, index) => (
                            <Pill key={index} className={classes.filePill}>
                                <Flex justify="center" align="center" columnGap={6}>
                                    <Text className={classes.filePillText} truncate="end" c="dimmed">
                                        {file}
                                    </Text>
                                    <Loader size={10} stroke="4" />
                                </Flex>
                            </Pill>
                        ))}
                    </Flex>
                )}
                <Flex>
                    <Button
                        onClick={onSend}
                        className={classes.sendButton}
                        leftSection={sending ? <Loader size={16} /> : <IconMailForward size={16} />}
                        disabled={sending || loadingFiles.length !== 0}
                    >
                        <FormattedMessage id="common.email-drawer.send" />
                    </Button>
                </Flex>
            </Flex>
        </Drawer>
    )
}

export default VolunteerEmailDrawer
