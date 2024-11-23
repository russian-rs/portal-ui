import { MantineColor } from "@mantine/core"
import { TaskDto } from "@russian-rs/portal-api-axios"
import { IntlShape } from "react-intl"
import { locales } from "src/pages/report/constants"

export const getSpentTimeFromTasks = (tasks: TaskDto[], intl: IntlShape): string => {
    const timeInMinutes = tasks.map((it) => it.timeSpent).reduce((acc, val) => acc + val, 0)
    return getSpentTime(timeInMinutes, intl)
}

export const getSpentTime = (timeInMinutes: number, intl: IntlShape): string => {
    const hours = Math.floor(timeInMinutes / 60)
    const minutes = timeInMinutes % 60

    const hoursText = intl.formatMessage({ id: locales.timeSpentHours }, { h: hours })
    const minutesText = intl.formatMessage({ id: locales.timeSpentMinutes }, { m: minutes })

    if (minutes) {
        return `${hoursText} ${minutesText}`
    } else {
        return hoursText
    }
}

export const getReportStatusColor = (status: string | undefined): MantineColor => {
    switch (status) {
        case "CREATED":
            return "blue"
        case "ACCEPTED":
            return "green"
        default:
            return "blue"
    }
}
