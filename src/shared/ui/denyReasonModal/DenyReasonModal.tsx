import { Button, Flex, Modal, Textarea } from "@mantine/core"
import { ReactNode, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import classes from "./DenyReasonModal.module.scss"
import { locales } from "./lib/locales"

interface DenyReasonModalProps {
    opened: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
    title?: ReactNode
    description?: ReactNode
    confirmButtonText?: ReactNode
    cancelButtonText?: ReactNode
}

export const DenyReasonModal = (props: DenyReasonModalProps) => {
    const intl = useIntl()
    const [reason, setReason] = useState("")
    const confirmButtonText = props.confirmButtonText || <FormattedMessage id={locales.confirmDefaultButton} />
    const cancelButtonText = props.cancelButtonText || <FormattedMessage id={locales.cancelDefaultButton} />

    const handleConfirm = () => {
        if (reason.trim()) {
            props.onConfirm(reason.trim())
            props.onClose()
            setReason("")
        }
    }

    const handleClose = () => {
        props.onClose()
        setReason("")
    }

    return (
        <Modal centered opened={props.opened} onClose={handleClose} title={props.title}>
            {props.description}
            <Textarea
                placeholder={intl.formatMessage({ id: locales.reasonPlaceholder })}
                value={reason}
                onChange={(event) => setReason(event.currentTarget.value)}
                minRows={3}
                maxRows={6}
                className={classes.reasonInput}
            />
            <Flex className={classes.buttonsGroup}>
                <Button variant="outline" onClick={handleClose} className={classes.buttonCancel}>
                    {cancelButtonText}
                </Button>
                <Button onClick={handleConfirm} disabled={!reason.trim()} className={classes.buttonConfirm}>
                    {confirmButtonText}
                </Button>
            </Flex>
        </Modal>
    )
}
