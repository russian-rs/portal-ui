import { Box, Flex, HoverCard, Loader, Text } from "@mantine/core"
import { VolunteerHeatMapItem } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { ReportHeatMapApiService } from "src/shared/api/ReportHeatMapApiService"
import { locales } from "../lib/constants"
import classes from "./CurrentUserHeatmap.module.scss"

interface WeekInfo {
    weekNumber: number
    date: dayjs.Dayjs
}

type VolunteerWeek = VolunteerHeatMapItem["weeks"][number]

export const CurrentUserHeatmap: React.FC = () => {
    const intl = useIntl()
    const currentYear = dayjs().year()

    const { data, isLoading, isError } = useQuery({
        queryKey: ["currentUserHeatmap", currentYear],
        queryFn: () =>
            ReportHeatMapApiService.getCurrentUserHeatMap(currentYear).then(
                (response) => response.data as VolunteerHeatMapItem
            ),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    const volunteer = data ?? null

    const weekByNumber = useMemo(() => {
        const map = new Map<number, VolunteerWeek>()
        if (!volunteer) return map

        for (const w of volunteer.weeks) {
            map.set(w.week, w)
        }
        return map
    }, [volunteer])

    const weeks: WeekInfo[] = useMemo(() => {
        if (!volunteer) return []

        const uniqueWeeks: WeekInfo[] = []
        const seen = new Set<number>()

        for (const w of volunteer.weeks) {
            if (seen.has(w.week)) continue
            seen.add(w.week)
            uniqueWeeks.push({
                weekNumber: w.week,
                date: dayjs(w.weekStart),
            })
        }

        uniqueWeeks.sort((a, b) => a.weekNumber - b.weekNumber)
        return uniqueWeeks
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

    const getSquareColor = (weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekNumber)
        if (!weekInfo) return "na"

        const isCurrentWeek = dayjs().isoWeek() === weekNumber

        if (weekInfo.hoursRequired === 0) return "na"
        if (isCurrentWeek) return "waiting"
        if (weekInfo.hoursWorked === 0) return "noReports"
        if (weekInfo.hoursWorked < weekInfo.hoursRequired) return "partialReports"
        return "fullReports"
    }

    const getSquareTooltip = (weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekNumber)
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

    const getSquareInfoLabel = (weekNumber: number) => {
        const weekInfo = weekByNumber.get(weekNumber)
        if (!weekInfo) return ""

        const color = getSquareColor(weekNumber)
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

        return getSquareTooltip(weekNumber)
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
            <Flex gap={4} wrap="wrap" className={classes.weeksRow}>
                {weeks.map((week) => (
                    <HoverCard
                        key={week.weekNumber}
                        position="top"
                        withArrow
                        shadow="md"
                        openDelay={0}
                        closeDelay={100}
                        withinPortal
                    >
                        <HoverCard.Target>
                            <Box className={`${classes.weekSquare} ${classes[getSquareColor(week.weekNumber)]}`}>
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
                                {getSquareInfoLabel(week.weekNumber)}
                            </Text>
                        </HoverCard.Dropdown>
                    </HoverCard>
                ))}
            </Flex>
        </Flex>
    )
}
