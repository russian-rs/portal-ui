import { Button, Combobox, Flex, InputBase, Modal, Text, Textarea, Tooltip, useCombobox } from "@mantine/core"
import { ApplicationDto } from "@russian-rs/portal-api-axios"
import React, { ReactNode, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { DenyReasonModal } from "src/shared/ui/denyReasonModal/DenyReasonModal"
import { ApplicationStatus, getApplicationStatusColor, getApplicationStatusIcon } from "src/shared/user/applications"
import { locales } from "./lib/locales"

interface ApplicationStatusSelectProps {
    application: ApplicationDto
    className?: string
    onChange?: (status: string, comment?: string) => void
    label?: string
    disabled?: boolean
    withoutIcon?: boolean
    showInlineReason?: boolean
}

export const ApplicationStatusSelect = (props: ApplicationStatusSelectProps) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    const [value, setValue] = useState<string>(props.application.status || ApplicationStatus.CREATED)
    const [pauseOpened, setPauseOpened] = useState(false)
    const [denyModalOpened, setDenyModalOpened] = useState(false)
    const [pauseReason, setPauseReason] = useState("")
    const [pendingStatus, setPendingStatus] = useState<string | null>(null)

    const onChange = (newValue: string, comment?: string) => {
        if (props.onChange) {
            props.onChange(newValue, comment)
        }
    }

    const handleStatusChange = (newStatus: string) => {
        if (newStatus === ApplicationStatus.DENY) {
            setPendingStatus(newStatus)
            setDenyModalOpened(true)
            combobox.closeDropdown()
        } else {
            onChange(newStatus)
            setValue(newStatus)
            combobox.closeDropdown()
        }
    }

    const handleDenyConfirm = (reason: string) => {
        if (pendingStatus) {
            onChange(pendingStatus, reason)
            setValue(pendingStatus)
            setPendingStatus(null)
        }
    }

    const handleDenyCancel = () => {
        setDenyModalOpened(false)
        setPendingStatus(null)
        // Возвращаем предыдущее значение статуса
        setValue(props.application.status || ApplicationStatus.CREATED)
    }

    const options = Object.values(ApplicationStatus).map((status) => {
        const tooltip = getTooltip(status, props.application)
        return (
            <Tooltip label={tooltip} key={status} hidden={tooltip == undefined}>
                <Combobox.Option value={status} disabled={isDisabled(status, props.application)}>
                    <Flex align="center" justify="start" columnGap="xs">
                        <Flex>{getApplicationStatusIcon(status, 16, getApplicationStatusColor(status))}</Flex>
                        <FormattedMessage id={`common.application-status.${status}`} />
                    </Flex>
                </Combobox.Option>
            </Tooltip>
        )
    })

    useEffect(() => {
        setValue(props.application.status || ApplicationStatus.CREATED)
    }, [props.application.status])

    return (
        <Flex direction="column">
            {props.label && (
                <Text size="xs" c="dimmed" mb={4}>
                    <FormattedMessage id={props.label} />
                </Text>
            )}
            <Combobox
                store={combobox}
                onOptionSubmit={(val) => {
                    if (val === ApplicationStatus.PAUSED) {
                        setPendingStatus(val)
                        setPauseOpened(true)
                        combobox.closeDropdown()
                        return
                    }
                    if (val === ApplicationStatus.DENY) {
                        setPendingStatus(val)
                        setDenyModalOpened(true)
                        combobox.closeDropdown()
                        return
                    }
                    setValue(val)
                    combobox.closeDropdown()
                    onChange(val)
                }}
            >
                <Combobox.Target>
                    <InputBase
                        component="button"
                        type="button"
                        pointer
                        variant="unstyled"
                        disabled={props.disabled}
                        className={props.className}
                        onClick={() => combobox.toggleDropdown()}
                        leftSection={
                            props.withoutIcon
                                ? undefined
                                : getApplicationStatusIcon(value, 16, getApplicationStatusColor(value))
                        }
                        rightSectionPointerEvents={value === null ? "none" : "all"}
                        rightSection={<Combobox.Chevron />}
                    >
                        <Text size="sm">
                            <FormattedMessage id={`common.application-status.${value}`} />
                        </Text>
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
            {props.showInlineReason === true &&
                value === ApplicationStatus.PAUSED &&
                (props.application.comment || pauseReason) && (
                    <Text
                        size="xs"
                        c="dimmed"
                        mt={6}
                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowWrap: "anywhere" }}
                    >
                        <FormattedMessage id={locales.pauseReason} />: {props.application.comment || pauseReason}
                    </Text>
                )}

            <Modal
                centered
                opened={pauseOpened}
                onClose={() => {
                    setPauseOpened(false)
                    setPauseReason("")
                    setPendingStatus(null)
                }}
                title={<FormattedMessage id={locales.pauseTitle} />}
            >
                <Flex direction="column" gap="md">
                    <Textarea
                        label={<FormattedMessage id={locales.pauseReason} />}
                        placeholder=""
                        autosize
                        minRows={3}
                        value={pauseReason}
                        onChange={(e) => setPauseReason(e.currentTarget.value)}
                        withAsterisk
                    />
                    <Flex justify="flex-end" gap="sm">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setPauseOpened(false)
                                setPauseReason("")
                                setPendingStatus(null)
                            }}
                        >
                            <FormattedMessage id="common.confirm-modal.cancelDefaultButton" />
                        </Button>
                        <Button
                            onClick={() => {
                                const reason = pauseReason.trim()
                                if (!reason || !pendingStatus) {
                                    return
                                }
                                setValue(pendingStatus)
                                onChange(pendingStatus, reason)
                                setPauseOpened(false)
                                setPauseReason("")
                                setPendingStatus(null)
                            }}
                            disabled={pauseReason.trim().length === 0}
                        >
                            <FormattedMessage id={locales.pauseSubmit} />
                        </Button>
                    </Flex>
                </Flex>
            </Modal>

            <DenyReasonModal
                opened={denyModalOpened}
                onClose={handleDenyCancel}
                onConfirm={handleDenyConfirm}
                title={<FormattedMessage id={locales.denyReasonModal.title} />}
                description={<FormattedMessage id={locales.denyReasonModal.description} />}
            />
        </Flex>
    )
}

const isDisabled = (status: ApplicationStatus, application: ApplicationDto): boolean => {
    switch (status) {
        case ApplicationStatus.DONE:
            return application.contract == null
        default:
            return false
    }
}

const getTooltip = (status: ApplicationStatus, application: ApplicationDto): ReactNode => {
    switch (status) {
        case ApplicationStatus.DONE:
            if (!application.contract) {
                return <FormattedMessage id={locales.contractRequired} />
            } else {
                return undefined
            }
        default:
            return undefined
    }
}
