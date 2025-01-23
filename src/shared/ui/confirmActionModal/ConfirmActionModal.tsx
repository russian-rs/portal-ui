import { Button, Flex, Modal, Text } from "@mantine/core"
import { ReactNode, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import classes from "./ConfirmActionModal.module.scss"
import { locales } from "./lib/locales"

interface ConfirmActionModalProps {
    opened: boolean
    onClose: () => void
    onConfirm: () => void
    timeout?: number
    title?: ReactNode
    description?: ReactNode
    confirmButtonText?: ReactNode
    cancelButtonText?: ReactNode
}

export const ConfirmActionModal = (props: ConfirmActionModalProps) => {
    const timeout = props.timeout || 10
    const confirmButtonText = props.confirmButtonText || <FormattedMessage id={locales.confirmDefaultButton} />
    const cancelButtonText = props.cancelButtonText || <FormattedMessage id={locales.cancelDefaultButton} />

    const [isConfirmDisabled, setIsConfirmDisabled] = useState(true)
    const [timer, setTimer] = useState(timeout)

    // Handle timer countdown
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (props.opened && isConfirmDisabled) {
            setTimer(timeout) // Reset timer when modal is opened
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        setIsConfirmDisabled(false)
                        clearInterval(interval)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        } else {
            setIsConfirmDisabled(true) // Disable confirm button if modal closes
        }
        return () => clearInterval(interval)
    }, [props.opened])

    return (
        <Modal centered opened={props.opened} onClose={props.onClose} title={props.title}>
            {props.description}
            <Flex className={classes.buttonsGroup}>
                <Button variant="outline" onClick={props.onClose} className={classes.buttonCancel}>
                    {cancelButtonText}
                </Button>
                <Button
                    onClick={() => {
                        props.onConfirm()
                        props.onClose()
                    }}
                    disabled={isConfirmDisabled}
                    className={classes.buttonConfirm}
                >
                    {confirmButtonText}
                </Button>
            </Flex>
            <Flex>
                {timer != 0 && (
                    <Text c="dimmed" className={classes.waitText}>
                        <FormattedMessage id={locales.waitText} values={{ timer: timer }} />
                    </Text>
                )}
            </Flex>
        </Modal>
    )
}
