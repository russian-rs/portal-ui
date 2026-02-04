import { Box, Flex, HoverCard, Loader, Text } from "@mantine/core"
import { HeatMapItem, VolunteerHeatMapItem } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { ReportHeatMapApiService } from "src/shared/api/ReportHeatMapApiService"
import { locales } from "../lib/constants"
import classes from "./CurrentUserHeatmap.module.scss"

export const CurrentUserHeatmap = ({ className }: { className?: string }) => {
    const intl = useIntl()

    const { data, isLoading, isError } = useQuery({
        queryKey: ["currentUserHeatmap"],
        queryFn: () => ReportHeatMapApiService.getCurrentUserHeatMap().then((response) => response.data),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    })

    if (isLoading) {
        return (
            <Flex justify="center" align="center" py="md">
                <Loader />
            </Flex>
        )
    }

    if (isError || !data) {
        return <Flex />
    }

    const getSquareColor = (weekData: HeatMapItem) => {
        if (!weekData) return "na"

        const isCurrentYear = dayjs().year() == dayjs(weekData.weekStart).year()
        const isCurrentWeek = dayjs().isBetween(weekData.weekStart, weekData.weekEnd, "day", "[]")
        const hasReports = weekData.hoursWorked > 0

        if (weekData.hoursRequired === 0) return "na"
        if (isCurrentWeek && isCurrentYear && !hasReports) return "waiting"
        if (weekData.hoursWorked === 0) return "noReports"
        if (weekData.hoursWorked < weekData.hoursRequired) return "partialReports"
        if (weekData.hoursWorked > weekData.hoursRequired) return "overtimeReports"

        return "fullReports"
    }

    const getSquareTooltip = (weekInfo: HeatMapItem) => {
        if (!weekInfo) return ""

        return intl.formatMessage(
            { id: locales.tooltipReports },
            {
                hours: weekInfo.hoursWorked,
                hoursRequired: weekInfo.hoursRequired,
                from: dayjs(weekInfo.weekStart).format("DD.MM.YYYY"),
                to: dayjs(weekInfo.weekEnd).format("DD.MM.YYYY"),
                week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekInfo.week }),
            }
        )
    }

    const getSquareInfoLabel = (weekInfo: HeatMapItem) => {
        if (!weekInfo) return ""

        const color = getSquareColor(weekInfo)
        const weekLabel = intl.formatMessage({ id: locales.tooltipWeek }, { num: weekInfo.week })
        const params = {
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

        return getSquareTooltip(weekInfo)
    }

    const getSummaryText = (heatmap: VolunteerHeatMapItem) => {
        if (heatmap.totalRequired === undefined || heatmap.totalWorked === undefined) {
            return ""
        }
        const h = intl.formatMessage({ id: locales.hours })
        const sign = heatmap.totalWorked - heatmap.totalRequired > 0 ? "+" : ""
        const showDiff = heatmap.totalRequired != heatmap.totalWorked
        let summary = `${heatmap.totalWorked} / ${heatmap.totalRequired} ${h}`
        if (showDiff) {
            summary += ` (${sign}${heatmap.totalWorked - heatmap.totalRequired})`
        }
        return summary
    }

    return (
        <Flex direction="column" gap="xs" className={className}>
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
                    <Box className={`${classes.legendSquare} ${classes.overtimeReports}`} />
                    <Text size="xs">
                        <FormattedMessage id={locales.overtimeReports} />
                    </Text>
                </Flex>

                <Flex align="center" gap={4}>
                    <Box className={`${classes.legendSquare} ${classes.na}`} />
                    <Text size="xs">N/A</Text>
                </Flex>
            </Flex>

            <Flex direction="column" rowGap="md">
                {Object.entries(data).map(([year, heatmap]) => (
                    <Flex direction="column">
                        <Flex direction="row" align="center" columnGap="md">
                            <Text fw="bold" size="xl">
                                {year}
                            </Text>
                            <Text c="gray" size="sm">
                                {getSummaryText(heatmap)}
                            </Text>
                        </Flex>
                        <Flex gap={4} wrap="wrap" className={classes.weeksRow}>
                            {heatmap.weeks.map((weekItem) => (
                                <HoverCard
                                    key={weekItem.week}
                                    position="top"
                                    withArrow
                                    shadow="md"
                                    openDelay={0}
                                    closeDelay={100}
                                    withinPortal
                                >
                                    <HoverCard.Target>
                                        <Box className={`${classes.weekSquare} ${classes[getSquareColor(weekItem)]}`}>
                                            <Text size="xs" fw={500} className={classes.weekNumber}>
                                                {weekItem.week}
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
                                            {getSquareInfoLabel(weekItem)}
                                        </Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            ))}
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    )
}
