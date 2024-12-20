import { Combobox, Flex, InputBase, Text, useCombobox } from "@mantine/core"
import React, { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { ApplicationStatus, getApplicationStatusColor, getApplicationStatusIcon } from "src/shared/user/applications"

interface ApplicationStatusSelectProps {
    initialStatus: string | undefined
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

    const [value, setValue] = useState<string>(props.initialStatus || ApplicationStatus.CREATED)

    useEffect(() => {
        if (props.onChange) {
            props.onChange(value)
        }
    }, [value])

    const options = Object.values(ApplicationStatus).map((item) => (
        <Combobox.Option value={item} key={item}>
            <Flex align="center" justify="start" columnGap="xs">
                <Flex>{getApplicationStatusIcon(item, 16, getApplicationStatusColor(item))}</Flex>
                <FormattedMessage id={`common.application-status.${item}`} />
            </Flex>
        </Combobox.Option>
    ))

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
