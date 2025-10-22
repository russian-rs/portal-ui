import { ActionIcon, Avatar, Flex, Paper, Text } from "@mantine/core"
import { NoteDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconTrashX } from "@tabler/icons-react"
import { useMutation } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import { NoteApiService } from "src/shared/api/NoteApiService"

interface ApplicationNoteProps {
    note: NoteDto
    userInfo?: UserInfoDto
    onNoteDeleted: (noteId: string) => void
}

export const ApplicationNote = ({ note, userInfo, onNoteDeleted }: ApplicationNoteProps) => {
    const { user: currentUser } = useContext(UserContext)

    const deleteNoteMutation = useMutation({
        mutationFn: () => NoteApiService.deleteNote(note.id),
        onSuccess: () => {
            // Уведомляем родительский компонент
            onNoteDeleted(note.id)
        },
        onError: (error) => {
            console.error("Failed to delete note:", error)
        },
    })

    const onDelete = () => {
        deleteNoteMutation.mutate()
    }

    return (
        <Paper shadow="md" radius="md" p="xs" key={note.id}>
            <Flex direction="column" rowGap="sm">
                <Flex align="center" columnGap="xs">
                    <Avatar size={20} src={userInfo?.avatar?.link} name={userInfo?.fullName || note.createdBy} />
                    <Text c="dimmed" size="sm">
                        {userInfo?.fullName || note.createdBy}
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
                            loading={deleteNoteMutation.isPending}
                            disabled={deleteNoteMutation.isPending}
                            onClick={onDelete}
                        >
                            <IconTrashX size={14} />
                        </ActionIcon>
                    )}
                </Flex>
                <Text
                    size="sm"
                    style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                    }}
                >
                    {note.text}
                </Text>
            </Flex>
        </Paper>
    )
}
