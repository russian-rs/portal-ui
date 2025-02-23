import { Combobox, Flex, InputBase, Text, Tooltip, useCombobox } from "@mantine/core"
import { ApplicationDto } from "@russian-rs/portal-api-axios"
import React, { ReactNode, useState } from "react"
import { FormattedMessage } from "react-intl"
import { ApplicationStatus, getApplicationStatusColor, getApplicationStatusIcon } from "src/shared/user/applications"
import { locales } from "./lib/locales"

interface ApplicationStatusSelectProps {
    application: ApplicationDto
    className?: string
    onChange?: (status: string) => void
    label?: string
    disabled?: boolean
    withoutIcon?: boolean
}

export const ApplicationStatusSelect = (props: ApplicationStatusSelectProps) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    const [value, setValue] = useState<string>(props.application.status || ApplicationStatus.CREATED)

    const onChange = (newValue: string) => {
        if (props.onChange) {
            props.onChange(newValue)
        }
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
