import { ActionIcon, Avatar, Flex, Paper, Text } from "@mantine/core"
import { NoteDto } from "@russian-rs/portal-api-axios"
import { IconTrashX } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { UserContext } from "src/app/providers/UserContext"
import { NoteApiService } from "src/shared/api/NoteApiService"

interface ApplicationNoteProps {
    note: NoteDto
}

export const ApplicationNote = ({ note }: ApplicationNoteProps) => {
    const { user: currentUser } = useContext(UserContext)
    const [deleting, setDeleting] = useState(false)

    const onDelete = () => {
        setDeleting(true)

        NoteApiService.deleteNote(note.id).then((response) => {
            window.location.reload()
        })
    }

    return (
        <Paper shadow="md" radius="md" p="xs" key={note.id}>
            <Flex direction="column" rowGap="sm">
                <Flex align="center" columnGap="xs">
                    <Avatar size={20} />
                    <Text c="dimmed" size="sm">
                        {note.createdBy}
                    </Text>
                    <Text size="sm" c="dimmed">
                        {dayjs(note.createTime).format("HH:mm DD.MM.YYYY")}
                    </Text>
                    {currentUser?.username === note.createdBy && (
                        <ActionIcon
                            color="red"
                            variant="light"
                            size="sm"
                            ms="auto"
                            loading={deleting}
                            disabled={deleting}
                            onClick={onDelete}
                        >
                            <IconTrashX size={14} />
                        </ActionIcon>
                    )}
                </Flex>
                <Text size="sm">{note.text}</Text>
            </Flex>
        </Paper>
    )
}
