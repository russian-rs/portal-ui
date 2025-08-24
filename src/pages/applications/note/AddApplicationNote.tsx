import { Button, Flex, Textarea } from "@mantine/core"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import { v4 as uuid } from "uuid"
import classes from "./AddApplicationNote.module.scss"

interface AddApplicationNoteProps {
    applicationId: string
}

export const AddApplicationNote = ({ applicationId }: AddApplicationNoteProps) => {
    const intl = useIntl()
    const [noteText, setNoteText] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSave()
        }
    }

    const handleSave = async () => {
        if (!noteText.trim()) return

        setIsLoading(true)
        try {
            await PrivateApplicationApiService.addNoteToApplication(applicationId, {
                id: uuid(),
                text: noteText,
            })

            window.location.reload()
        } catch (error) {
            console.error("Failed to add note:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Flex direction="column" gap="sm" className={classes.container}>
            <Textarea
                className={classes.textarea}
                placeholder={intl.formatMessage({
                    id: "pages.applications.addNote",
                })}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={handleKeyPress}
                minRows={3}
                maxRows={6}
            />

            <Button onClick={handleSave} loading={isLoading} disabled={!noteText.trim()} size="sm">
                <FormattedMessage id="common.save" />
            </Button>
        </Flex>
    )
}
