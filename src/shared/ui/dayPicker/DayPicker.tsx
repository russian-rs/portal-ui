import { CloseButton, Flex, Input, Popover, Text } from "@mantine/core"
import { DatePicker, DatePickerProps } from "@mantine/dates"
import { IconCalendar } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import classes from "./DayPicker.module.scss"

interface DayPickerProps {
    className?: string
    onChange?: (date: Date | null) => void
    value?: Date | null
    initialDate?: string | null
    label?: React.ReactNode
    placeholder?: string
    error?: React.ReactNode
    minDate?: Date
    maxDate?: Date
    withAsterisk?: boolean
    description?: React.ReactNode
}

export const DayPicker = (
    props: DayPickerProps & {
        targetClassName?: string
    }
) => {
    const [value, setValue] = useState<Date | null>(null)

    useEffect(() => {
        if (props.initialDate) {
            const date = dayjs(props.initialDate)
            if (date.isValid()) {
                setValue(date.toDate())
            }
        }
    }, [props.initialDate])

    useEffect(() => {
        if (props.value !== undefined) {
            if (props.value === null) {
                setValue(null)
            } else if (dayjs(props.value).isValid()) {
                setValue(props.value)
            }
        }
    }, [props.value])

    const onChange = (date: Date | null) => {
        setValue(date)
        if (props.onChange) {
            props.onChange(date)
        }
    }

    const dayRenderer: DatePickerProps["renderDay"] = (date) => {
        const day = date.getDate()
        const weekDay = date.getDay()
        const weekNumber = dayjs(date).isoWeek()
        return (
            <Flex className={classes.dayContainer}>
                {weekDay == 1 && <div className={classes.weekNumber}>{weekNumber}</div>}
                <div className={classes.firstDay}>{day}</div>
            </Flex>
        )
    }

    const placeholder = value ? (
        <Text className={classes.text} truncate="end">
            {dayjs(value).format("DD MMM YYYY")}
        </Text>
    ) : (
        <Text className={classes.placeholder} size="sm">
            {props.placeholder || <FormattedMessage id="common.day-picker.empty" />}
        </Text>
    )

    return (
        <Popover position="bottom" withArrow shadow="md">
            <Popover.Target>
                <Flex direction="column" rowGap={4} className={props.targetClassName}>
                    <Flex direction="column">
                        {props.label && (
                            <Text size="sm">
                                {props.label}
                                {props.withAsterisk && (
                                    <Text component="span" c="red" ml={4}>
                                        *
                                    </Text>
                                )}
                            </Text>
                        )}
                        {props.description && (
                            <Text size="xs" c="dimmed">
                                {props.description}
                            </Text>
                        )}
                    </Flex>
                    <Input
                        className={`${classes.input} ${props.className || ""}`}
                        component="button"
                        pointer
                        error={props.error}
                        rightSectionPointerEvents="all"
                        leftSection={<IconCalendar size={16} />}
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => {
                                    setValue(null)
                                }}
                                style={{ display: value ? undefined : "none" }}
                            />
                        }
                    >
                        {placeholder}
                    </Input>
                    {props.error && typeof props.error === "string" && (
                        <Text size="xs" c="red">
                            {props.error}
                        </Text>
                    )}
                </Flex>
            </Popover.Target>
            <Popover.Dropdown>
                <DatePicker
                    renderDay={dayRenderer}
                    className={classes.calendar}
                    size="xs"
                    maxLevel="month"
                    value={value}
                    onChange={onChange}
                    minDate={props.minDate}
                    maxDate={props.maxDate}
                />
            </Popover.Dropdown>
        </Popover>
    )
}
