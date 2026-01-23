import { Accordion, Alert, Box, Flex, HoverCard, Loader, Text } from "@mantine/core"
import { VolunteerHeatMapItem } from "@russian-rs/portal-api-axios"
import { IconAlertHexagon, IconChecks } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { ReportHeatMapApiService } from "src/shared/api/ReportHeatMapApiService"
import { START_YEAR } from "src/shared/constants/Shared"
import { locales } from "../lib/constants"
import classes from "./CurrentUserHeatmap.module.scss"

interface WeekInfo {
    weekNumber: number
    date: dayjs.Dayjs
    weekEnd: string
}

type VolunteerWeek = VolunteerHeatMapItem["weeks"][number]

export const CurrentUserHeatmap: React.FC = () => {
    const intl = useIntl()
    const currentYear = dayjs().year()
    const currentWeek = dayjs().isoWeek()
    const currentDate = dayjs()
    const years = useMemo(() => {
        const yearsList: number[] = []
        for (let year = START_YEAR; year <= currentYear; year++) {
            yearsList.push(year)
        }
        return yearsList
    }, [currentYear])

    const { data, isLoading, isError } = useQuery({
        queryKey: ["currentUserHeatmap", years],
        queryFn: async () => {
            const results = await Promise.all(
                years.map((year) =>
                    ReportHeatMapApiService.getCurrentUserHeatMap(year)
                        .then((response) => response.data as VolunteerHeatMapItem)
                        .catch(() => null)
                )
            )

            const validResults = results.filter((r): r is VolunteerHeatMapItem => r !== null)
            if (validResults.length === 0) return null

            const volunteerInfo = validResults[0].volunteerInfo

            const weeksMap = new Map<string, VolunteerWeek>()
            for (const result of validResults) {
                for (const week of result.weeks) {
                    const weekKey = week.weekEnd
                    const existing = weeksMap.get(weekKey)
                    if (existing) {
                        weeksMap.set(weekKey, {
                            ...week,
                            hoursWorked: (existing.hoursWorked ?? 0) + (week.hoursWorked ?? 0),
                            hoursRequired: (existing.hoursRequired ?? 0) + (week.hoursRequired ?? 0),
                        })
                    } else {
                        weeksMap.set(weekKey, week)
                    }
                }
            }

            const totalRequired = validResults.reduce((sum, r) => sum + (r.totalRequired ?? 0), 0)
            const totalWorked = validResults.reduce((sum, r) => sum + (r.totalWorked ?? 0), 0)

            return {
                volunteerInfo,
                weeks: Array.from(weeksMap.values()),
                totalRequired,
                totalWorked,
            } as VolunteerHeatMapItem
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    const volunteer = data ?? null

    const weekByNumber = useMemo(() => {
        // Используем дату конца недели как ключ, чтобы избежать конфликтов
        // между неделями с одинаковым номером из разных годов
        const map = new Map<string, VolunteerWeek>()
        if (!volunteer) return map

        for (const w of volunteer.weeks) {
            map.set(w.weekEnd, w)
        }
        return map
    }, [volunteer])

    const currentYearWeeks: WeekInfo[] = useMemo(() => {
        if (!volunteer) return []

        const weeks = volunteer.weeks.filter((w) => {
            const weekYear = dayjs(w.weekEnd).year()
            return weekYear === currentYear
        })

        const allWeeks: WeekInfo[] = weeks.map((w) => ({
            weekNumber: w.week,
            date: dayjs(w.weekEnd),
            weekEnd: w.weekEnd,
        }))

        allWeeks.sort((a, b) => dayjs(a.weekEnd).diff(dayjs(b.weekEnd), "week"))
        return allWeeks
    }, [volunteer, currentYear])

    const pastYearsWeeksByYear = useMemo(() => {
        if (!volunteer) return new Map<number, WeekInfo[]>()

        const weeksByYear = new Map<number, WeekInfo[]>()
        
        volunteer.weeks.forEach((w) => {
            const weekYear = dayjs(w.weekEnd).year()
            if (weekYear < currentYear) {
                if (!weeksByYear.has(weekYear)) {
                    weeksByYear.set(weekYear, [])
                }
                weeksByYear.get(weekYear)!.push({
                    weekNumber: w.week,
                    date: dayjs(w.weekEnd),
                    weekEnd: w.weekEnd,
                })
            }
        })

        weeksByYear.forEach((weeks, year) => {
            weeks.sort((a, b) => dayjs(a.weekEnd).diff(dayjs(b.weekEnd), "week"))
        })

        return weeksByYear
    }, [volunteer, currentYear])

    const pastYears = useMemo(() => {
        const years = Array.from(pastYearsWeeksByYear.keys()).sort((a, b) => b - a)
        return years.reverse()
    }, [pastYearsWeeksByYear])

    const { required, worked } = useMemo(() => {
        if (!volunteer) return { required: 0, worked: 0 }
        
        const totalRequired = volunteer.totalRequired ?? 0
        const totalWorked = volunteer.totalWorked ?? 0
        
        return { required: totalRequired, worked: totalWorked }
    }, [volunteer])

    if (isLoading) {
        return (
            <Flex justify="center" align="center" py="md">
                <Loader />
            </Flex>
        )
    }

    if (isError || !volunteer) {
        return (
            <Flex justify="center" align="center" py="md">
                <Text size="sm" c="dimmed">
                    Не удалось загрузить данные по вашей активности.
                </Text>
            </Flex>
        )
    }

    const getSquareColor = (weekEnd: string, weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekEnd)
        if (!weekInfo) return "na"

        const weekDate = dayjs(weekEnd).endOf("isoWeek")
        const weekYear = weekDate.year()
        const isCurrentWeek = currentWeek === weekNumber && currentYear === weekYear

        if (weekInfo.hoursRequired === 0) return "na"
        if (isCurrentWeek) return "waiting"
        if (weekInfo.hoursWorked === 0) return "noReports"
        if (weekInfo.hoursWorked < weekInfo.hoursRequired) return "partialReports"
        return "fullReports"
    }

    const getSquareTooltip = (weekEnd: string, weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekEnd)
        if (!weekInfo) return ""

        return intl.formatMessage(
            { id: locales.tooltipReports },
            {
                name: volunteer.volunteerInfo.fullName,
                hours: weekInfo.hoursWorked,
                hoursLabel: intl.formatMessage({ id: locales.hours }),
                from: dayjs(weekInfo.weekStart).format("DD.MM.YYYY"),
                to: dayjs(weekInfo.weekEnd).format("DD.MM.YYYY"),
                week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekNumber }),
            }
        )
    }

    const getSquareInfoLabel = (weekEnd: string, weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekEnd)
        if (!weekInfo) return ""

        const color = getSquareColor(weekEnd, weekNumber)
        const weekLabel = intl.formatMessage({ id: locales.tooltipWeek }, { num: weekNumber })
        const params = {
            name: volunteer.volunteerInfo.fullName,
            from: dayjs(weekInfo.weekStart).format("DD.MM.YYYY"),
            to: dayjs(weekInfo.weekEnd).format("DD.MM.YYYY"),
            week: weekLabel,
        }

        if (color === "na") {
            return intl.formatMessage({ id: locales.tooltipNA }, params)
        }
        if (color === "waiting") {
            return intl.formatMessage({ id: locales.tooltipWaiting }, params)
        }

        return getSquareTooltip(weekEnd, weekNumber)
    }
    
    const deficit = Math.max(required - worked, 0)

    let summaryColor: string = "gray"
    if (required === 0) {
        summaryColor = "gray"
    } else if (deficit > 0) {
        summaryColor = "red"
    } else {
        summaryColor = "green"
    }

    return (
        <Flex direction="column" gap="xs" className={classes.root}>
            <Text size="sm">
                <FormattedMessage id={locales.heatmapDescription} />
            </Text>
            <Flex gap="md" wrap="wrap" className={classes.legend}>
                <Flex align="center" gap={4}>
                    <Box className={`${classes.legendSquare} ${classes.noReports}`} />
                    <Text size="xs">
                        <FormattedMessage id={locales.noReports} />
                    </Text>
                </Flex>

                <Flex align="center" gap={4}>
                    <Box className={`${classes.legendSquare} ${classes.partialReports}`} />
                    <Text size="xs">
                        <FormattedMessage id={locales.partialReports} />
                    </Text>
                </Flex>

                <Flex align="center" gap={4}>
                    <Box className={`${classes.legendSquare} ${classes.fullReports}`} />
                    <Text size="xs">
                        <FormattedMessage id={locales.fullReports} />
                    </Text>
                </Flex>

                <Flex align="center" gap={4}>
                    <Box className={`${classes.legendSquare} ${classes.na}`} />
                    <Text size="xs">N/A</Text>
                </Flex>
            </Flex>
            {pastYears.length > 0 && (
                <Accordion mt="md">
                    {pastYears.reverse().map((year) => {
                        const yearWeeks = pastYearsWeeksByYear.get(year) || []
                        return (
                            <Accordion.Item key={year} value={year.toString()}>
                                <Accordion.Control>
                                    <Text size="sm" fw={500}>
                                        <FormattedMessage id={locales.yearLabel} values={{ year }} />
                                    </Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Flex gap={4} wrap="wrap" className={classes.weeksRow}>
                                        {yearWeeks.map((week) => (
                                            <HoverCard
                                                key={week.weekEnd}
                                                position="top"
                                                withArrow
                                                shadow="md"
                                                openDelay={0}
                                                closeDelay={100}
                                                withinPortal
                                            >
                                                <HoverCard.Target>
                                                    <Box
                                                        className={`${classes.weekSquare} ${classes[getSquareColor(week.weekEnd, week.weekNumber)]}`}
                                                    >
                                                        <Text size="xs" fw={500} className={classes.weekNumber}>
                                                            {week.weekNumber}
                                                        </Text>
                                                    </Box>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown
                                                    style={{
                                                        maxWidth: "min(86vw, 420px)",
                                                        overflowWrap: "anywhere",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    <Text size="xs" style={{ whiteSpace: "normal", lineHeight: 1.35 }}>
                                                        {getSquareInfoLabel(week.weekEnd, week.weekNumber)}
                                                    </Text>
                                                </HoverCard.Dropdown>
                                            </HoverCard>
                                        ))}
                                    </Flex>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    })}
                </Accordion>
            )}
            <Flex gap={4} wrap="wrap" className={classes.weeksRow}>
                {currentYearWeeks.map((week) => (
                    <HoverCard
                        key={week.weekEnd}
                        position="top"
                        withArrow
                        shadow="md"
                        openDelay={0}
                        closeDelay={100}
                        withinPortal
                    >
                        <HoverCard.Target>
                            <Box
                                className={`${classes.weekSquare} ${classes[getSquareColor(week.weekEnd, week.weekNumber)]}`}
                            >
                                <Text size="xs" fw={500} className={classes.weekNumber}>
                                    {week.weekNumber}
                                </Text>
                            </Box>
                        </HoverCard.Target>
                        <HoverCard.Dropdown
                            style={{
                                maxWidth: "min(86vw, 420px)",
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                            }}
                        >
                            <Text size="xs" style={{ whiteSpace: "normal", lineHeight: 1.35 }}>
                                {getSquareInfoLabel(week.weekEnd, week.weekNumber)}
                            </Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                ))}
            </Flex>
           
            <Flex mt="xs">
                <Alert
                    color={summaryColor}
                    variant="light"
                    className={classes.alert}
                    classNames={{ title: classes.alertTitle }}
                    title={
                        required === 0 ? (
                            <FormattedMessage id={locales.summaryRequiredZero} />
                        ) : deficit > 0 ? (
                            <FormattedMessage id={locales.summaryDeficit} values={{ worked, required, deficit }} />
                        ) : (
                            <FormattedMessage id={locales.summaryOk} values={{ worked, required }} />
                        )
                    }
                    icon={deficit > 0 ? <IconAlertHexagon size={16} /> : <IconChecks size={16} />}
                ></Alert>
            </Flex>
        </Flex>
    )
}
