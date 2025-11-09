import { Box, Flex, Text, Group, Badge, Popover } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import dayjs from "dayjs"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { VolunteerReportData } from "../lib/types"
import { locales } from "../lib/locales"
import classes from "./VolunteerReportHeatmap.module.scss"

interface VolunteerReportHeatmapProps {
    volunteers: VolunteerReportData[]
    startDate: dayjs.Dayjs
    onVolunteerSelect: (volunteerId: string) => void
    selectedVolunteers: Set<string>
    totalVolunteers: number
}

export const VolunteerReportHeatmap: React.FC<VolunteerReportHeatmapProps> = ({
    volunteers,
    startDate,
    onVolunteerSelect,
    selectedVolunteers,
    totalVolunteers,
}) => {
    const intl = useIntl()
    const endDate = dayjs().startOf("isoWeek")
    const totalWeeks = endDate.diff(startDate.startOf("isoWeek"), "week") + 1
    const cellSizePx = 20

    // Генерируем недели для отображения
    const generateWeeks = () => {
        const weeks = []
        let currentDate = startDate.clone().startOf("isoWeek")

        for (let i = 0; i < totalWeeks; i++) {
            weeks.push({
                date: currentDate.clone(),
                weekNumber: i + 1,
            })
            currentDate = currentDate.add(1, "week")
        }

        return weeks
    }

    const weeks = generateWeeks()

    // Получаем цвет для квадратика на основе количества часов за неделю и дат контрактов
    const getSquareColor = (volunteer: VolunteerReportData, weekIndex: number) => {
        const weekStart = startDate.clone().add(weekIndex, "week").startOf("isoWeek")
        const isCurrentWeek = dayjs().isSame(weekStart, "isoWeek")

        // Недели ДО начала первого контракта — N/A (серые)
        const firstContractStart =
            volunteer.contracts && volunteer.contracts.length > 0
                ? volunteer.contracts
                      .map((c) => dayjs(c.startDate).startOf("isoWeek"))
                      .reduce((earliest, d) => (d.isBefore(earliest) ? d : earliest))
                : null
        if (firstContractStart && weekStart.isBefore(firstContractStart, "week")) {
            return "na"
        }

        // Если нет контрактов вовсе — все недели N/A
        if (!firstContractStart) {
            return "na"
        }

        // Ищем отчеты за эту неделю
        const reportsForWeek = volunteer.reports.filter((report) => {
            const reportDate = dayjs(report.week)
            return reportDate.isSame(weekStart, "isoWeek")
        })

        if (reportsForWeek.length === 0) {
            // Текущая неделя без отчёта — ожидание (белый)
            return isCurrentWeek ? "waiting" : "noReports"
        }

        const totalHours = reportsForWeek.reduce((sum, report) => sum + report.hoursSpent, 0)
        if (totalHours === 0) {
            return isCurrentWeek ? "waiting" : "noReports"
        }
        if (totalHours >= 10) return "fullReports"
        return "partialReports" // 1–9 часов
    }

    // Получаем подсказку для квадратика (локализовано)
    const getSquareTooltip = (volunteer: VolunteerReportData, weekIndex: number) => {
        const weekStart = startDate.clone().add(weekIndex, "week").startOf("isoWeek")
        const weekEnd = weekStart.clone().add(1, "week")

        const reportsForWeek = volunteer.reports.filter((report) => {
            const reportDate = dayjs(report.week)
            return reportDate.isSame(weekStart, "isoWeek")
        })

        if (reportsForWeek.length === 0) {
            return intl.formatMessage(
                { id: locales.tooltipNoReports },
                {
                    name: volunteer.fullName,
                    from: weekStart.format("DD.MM.YYYY"),
                    to: weekEnd.format("DD.MM.YYYY"),
                    week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekIndex + 1 }),
                }
            )
        }

        const totalHours = reportsForWeek.reduce((sum, report) => sum + report.hoursSpent, 0)
        const reportCount = reportsForWeek.length

        return intl.formatMessage(
            { id: locales.tooltipReports },
            {
                name: volunteer.fullName,
                count: reportCount,
                hours: totalHours,
                hoursLabel: intl.formatMessage({ id: locales.hours }),
                from: weekStart.format("DD.MM.YYYY"),
                to: weekEnd.format("DD.MM.YYYY"),
                week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekIndex + 1 }),
            }
        )
    }

    // Формирует общий текст для окошка информации по квадратику, включая номер недели
    const getSquareInfoLabel = (volunteer: VolunteerReportData, weekIndex: number) => {
        const color = getSquareColor(volunteer, weekIndex)
        const weekStart = startDate.clone().add(weekIndex, "week").startOf("isoWeek")
        const weekEnd = weekStart.clone().add(1, "week")
        const weekLabel = intl.formatMessage({ id: locales.tooltipWeek }, { num: weekIndex + 1 })

        if (color === "na") {
            return intl.formatMessage(
                { id: locales.tooltipNA },
                {
                    name: volunteer.fullName,
                    from: weekStart.format("DD.MM.YYYY"),
                    to: weekEnd.format("DD.MM.YYYY"),
                    week: weekLabel,
                }
            )
        }
        if (color === "waiting") {
            return intl.formatMessage(
                { id: locales.tooltipWaiting },
                {
                    name: volunteer.fullName,
                    from: weekStart.format("DD.MM.YYYY"),
                    to: weekEnd.format("DD.MM.YYYY"),
                    week: weekLabel,
                }
            )
        }

        return getSquareTooltip(volunteer, weekIndex)
    }

    const getVolunteerStats = (volunteer: VolunteerReportData) => {
        const totalReports = volunteer.reports.length
        const totalHours = volunteer.reports.reduce((sum, report) => sum + report.hoursSpent, 0)
        const missedWeeks = totalWeeks - totalReports

        return { totalReports, totalHours, missedWeeks }
    }

    if (volunteers.length === 0) {
        return (
            <Box p="xl" ta="center">
                <Text c="dimmed">
                    <FormattedMessage id={locales.noData} />
                </Text>
            </Box>
        )
    }

    return (
        <div className={classes.heatmapContainer}>
            <Flex justify="center" mb="lg">
                <Group gap="xs">
                    <Text size="sm" fw={500}>
                        <FormattedMessage id={locales.legend} />:
                    </Text>
                    <Flex align="center" gap="xs">
                        <Box className={`${classes.legendSquare} ${classes.noReports}`} />
                        <Text size="xs">
                            <FormattedMessage id={locales.noReports} />
                        </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Box className={`${classes.legendSquare} ${classes.partialReports}`} />
                        <Text size="xs">
                            <FormattedMessage id={locales.partialReports} />
                        </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Box className={`${classes.legendSquare} ${classes.fullReports}`} />
                        <Text size="xs">
                            <FormattedMessage id={locales.fullReports} />
                        </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Box className={`${classes.legendSquare} ${classes.na}`} />
                        <Text size="xs">N/A</Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Box className={`${classes.legendSquare} ${classes.waiting}`} />
                        <Text size="xs">
                            <FormattedMessage id={locales.pending} />
                        </Text>
                    </Flex>
                </Group>
            </Flex>

            <div className={classes.heatmapWrapper}>
                <div className={classes.heatmapGrid}>
                    {/* Header row with week numbers */}
                    <div className={classes.headerRow}>
                        <div className={classes.headerSpacer} />
                        <div className={classes.weekHeaders}>
                            {weeks.map((w) => (
                                <div key={w.weekNumber} className={classes.weekHeader}>
                                    <Text size="xs" c="dimmed">
                                        {w.weekNumber}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>
                    {volunteers.map((volunteer) => {
                        const weeksColors = weeks.map((_, idx) => getSquareColor(volunteer, idx))
                        const missedCount = weeksColors.filter((c) => c === "noReports").length
                        const partialCount = weeksColors.filter((c) => c === "partialReports").length
                        const allNA = weeksColors.length > 0 && weeksColors.every((c) => c === "na")
                        const isSelected = selectedVolunteers.has(volunteer.id)

                        return (
                            <div key={volunteer.id} className={classes.volunteerRow}>
                                <div className={classes.volunteerInfo}>
                                    <div className={classes.volunteerHeader}>
                                        <Text
                                            size="sm"
                                            fw={500}
                                            className={`${classes.volunteerName} ${isSelected ? classes.selectedVolunteer : ""}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => onVolunteerSelect(volunteer.id)}
                                        >
                                            {volunteer.fullName}
                                        </Text>
                                        <Badge
                                            size="xs"
                                            variant="filled"
                                            color={
                                                allNA
                                                    ? "gray"
                                                    : missedCount > 0
                                                      ? "red"
                                                      : partialCount > 0
                                                        ? "yellow"
                                                        : "green"
                                            }
                                            leftSection={
                                                !allNA && missedCount === 0 && partialCount === 0 ? (
                                                    <IconCheck size={12} style={{ marginRight: 0 }} />
                                                ) : undefined
                                            }
                                            px={6}
                                            py={2}
                                            styles={{ section: { marginRight: 0 } }}
                                        >
                                            {allNA
                                                ? "N/A"
                                                : missedCount > 0
                                                  ? String(missedCount)
                                                  : partialCount > 0
                                                    ? String(partialCount)
                                                    : ""}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={classes.weekSquares}>
                                    {weeks.map((_, weekIndex) => (
                                        <Popover key={weekIndex} position="top" withArrow shadow="md" withinPortal>
                                            <Popover.Target>
                                                <Box
                                                    className={`${classes.weekSquare} ${classes[getSquareColor(volunteer, weekIndex)]}`}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </Popover.Target>
                                            <Popover.Dropdown
                                                style={{
                                                    maxWidth: "min(86vw, 420px)",
                                                    overflowWrap: "anywhere",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                <Text size="xs" style={{ whiteSpace: "normal", lineHeight: 1.35 }}>
                                                    {getSquareInfoLabel(volunteer, weekIndex)}
                                                </Text>
                                            </Popover.Dropdown>
                                        </Popover>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            <Flex justify="center" mt="lg">
                <Group gap="lg">
                    <Flex align="center" gap="xs">
                        <Text size="sm" fw={500}>
                            <FormattedMessage id={locales.totalVolunteers} />:
                        </Text>
                        <Text size="sm" c="dimmed">
                            {totalVolunteers}
                        </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Text size="sm" fw={500}>
                            <FormattedMessage id={locales.period} />:
                        </Text>
                        <Text size="sm" c="dimmed">
                            {startDate.format("DD.MM.YYYY")} - {endDate.format("DD.MM.YYYY")}
                        </Text>
                    </Flex>
                    <Flex align="center" gap="xs">
                        <Text size="sm" fw={500}>
                            <FormattedMessage id={locales.totalWeeks} />:
                        </Text>
                        <Text size="sm" c="dimmed">
                            {totalWeeks}
                        </Text>
                    </Flex>
                </Group>
            </Flex>
        </div>
    )
}
