import { ReportDto, TaskDto } from "@russian-rs/portal-api-axios"
import { IntlShape } from "react-intl"
import { locales } from "src/pages/report/constants"

export const getSpentTimeFromReport = (report: ReportDto, intl: IntlShape): string => {
    const timeInMinutes = report.tasks.map((it) => it.timeSpent).reduce((acc, val) => acc + val, 0)
    return getSpentTime(timeInMinutes, intl)
}

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
