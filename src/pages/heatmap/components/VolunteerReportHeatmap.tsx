import { Box, Flex, Text, Group, Badge, Avatar, HoverCard, Checkbox } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import dayjs from "dayjs"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { VolunteerReportData } from "../lib/types"
import { locales } from "../lib/locales"
import classes from "./VolunteerReportHeatmap.module.scss"
import { getLocalizedName } from "src/shared/utils/getLocalName"

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
                weekNumber: currentDate.isoWeek(),
            })
            currentDate = currentDate.add(1, "week")
        }

        return weeks
    }

    const weeks = generateWeeks()

    const getPeriodAggregates = (volunteer: VolunteerReportData) => {
        const now = dayjs()
        const totalWeeksLocal = Math.ceil(now.diff(startDate, "week", true))
        const firstContractStart =
            volunteer.contracts && volunteer.contracts.length > 0
                ? volunteer.contracts
                      .map((c) => dayjs(c.startDate).startOf("isoWeek"))
                      .reduce((earliest, d) => (d.isBefore(earliest) ? d : earliest))
                : null

        if (!firstContractStart) {
            return { missedCount: 0, partialCount: 0, hasContracts: false }
        }

        let missedCount = 0
        let partialCount = 0

        for (let i = 0; i < totalWeeksLocal; i++) {
            const weekStart = startDate.clone().add(i, "week").startOf("isoWeek")
            const isCurrentWeek = dayjs().isSame(weekStart, "isoWeek")

            if (firstContractStart && weekStart.isBefore(firstContractStart, "week")) continue
            if (isCurrentWeek) continue

            const hours = volunteer.reports
                .filter((r) => dayjs(r.week).isSame(weekStart, "isoWeek"))
                .reduce((sum, r) => sum + r.hoursSpent, 0)

            if (hours === 0) missedCount += 1
            else if (hours < 10) partialCount += 1
        }

        return { missedCount, partialCount, hasContracts: true }
    }

    const getVolunteerStatusColor = (volunteer: VolunteerReportData) => {
        const { missedCount, partialCount, hasContracts } = getPeriodAggregates(volunteer)
        if (!hasContracts) return "gray"
        if (missedCount > 0) return "red"
        if (partialCount > 0) return "yellow"
        return "green"
    }

    const getVolunteerStatusText = (volunteer: VolunteerReportData) => {
        const { missedCount, partialCount, hasContracts } = getPeriodAggregates(volunteer)
        if (!hasContracts) return "N/A"
        if (missedCount > 0) return intl.formatMessage({ id: locales.statusMissedWeeks }, { count: missedCount })
        if (partialCount > 0) return intl.formatMessage({ id: locales.statusPartialLastWeek })
        return intl.formatMessage({ id: locales.statusAllOk })
    }

    const getWorkedVsRequired = (volunteer: VolunteerReportData) => {
        const end = dayjs().startOf("isoWeek")
        const firstContractStart =
            volunteer.contracts && volunteer.contracts.length > 0
                ? volunteer.contracts
                      .map((c) => dayjs(c.startDate).startOf("isoWeek"))
                      .reduce((earliest, d) => (d.isBefore(earliest) ? d : earliest))
                : null
        if (!firstContractStart) return { text: "N/A", worked: 0, required: 0 }

        const totalWeeksLocal = end.diff(startDate.startOf("isoWeek"), "week") + 1
        let effectiveWeeks = 0
        for (let i = 0; i < totalWeeksLocal; i++) {
            const weekStart = startDate.clone().add(i, "week").startOf("isoWeek")
            if (!weekStart.isBefore(firstContractStart, "week")) effectiveWeeks += 1
        }
        const required = effectiveWeeks * 10
        const worked = volunteer.reports
            .filter((r) => {
                const d = dayjs(r.week)
                const startBoundary = startDate.startOf("isoWeek")
                const endBoundary = end.endOf("isoWeek")
                return d.isBetween(startBoundary, endBoundary, "day", "[]")
            })
            .reduce((sum, r) => sum + r.hoursSpent, 0)
        return { text: `${worked}/${required}`, worked, required }
    }

    const getStatsForPopover = (volunteer: VolunteerReportData) => {
        const totalReports = volunteer.reports.length
        const totalHours = volunteer.reports.reduce((sum, report) => sum + report.hoursSpent, 0)
        const lastReport =
            volunteer.reports.length > 0
                ? volunteer.reports.reduce((latest, report) =>
                      dayjs(report.week).isAfter(dayjs(latest.week)) ? report : latest
                  )
                : null
        const workedRequired = getWorkedVsRequired(volunteer)
        const statusText = getVolunteerStatusText(volunteer)
        const statusColor = getVolunteerStatusColor(volunteer)
        return { totalReports, totalHours, lastReport, workedRequired, statusText, statusColor }
    }

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
                    week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekStart.isoWeek() }),
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
                week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekStart.isoWeek() }),
            }
        )
    }

    // Формирует общий текст для окошка информации по квадратику, включая номер недели
    const getSquareInfoLabel = (volunteer: VolunteerReportData, weekIndex: number) => {
        const color = getSquareColor(volunteer, weekIndex)
        const weekStart = startDate.clone().add(weekIndex, "week").startOf("isoWeek")
        const weekEnd = weekStart.clone().add(1, "week")
        const weekLabel = intl.formatMessage({ id: locales.tooltipWeek }, { num: weekStart.isoWeek() })

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
                                <div
                                    key={w.date.startOf("isoWeek").format("YYYY-MM-DD")}
                                    className={classes.weekHeader}
                                >
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
                        // Считаем часы: факт/норма за период
                        const firstContractStart =
                            volunteer.contracts && volunteer.contracts.length > 0
                                ? volunteer.contracts
                                      .map((c) => dayjs(c.startDate).startOf("isoWeek"))
                                      .reduce((earliest, d) => (d.isBefore(earliest) ? d : earliest))
                                : null
                        const workedHours = volunteer.reports
                            .filter((r) => {
                                const d = dayjs(r.week)
                                const startBoundary = startDate.startOf("isoWeek")
                                const endBoundary = endDate.endOf("isoWeek")
                                return d.isBetween(startBoundary, endBoundary, "day", "[]")
                            })
                            .reduce((sum, r) => sum + r.hoursSpent, 0)
                        const effectiveWeeks = weeks.filter((w) => {
                            if (!firstContractStart) return false
                            return !w.date.isBefore(firstContractStart, "week")
                        }).length
                        const requiredHours = firstContractStart ? effectiveWeeks * 10 : 0

                        return (
                            <div key={volunteer.id} className={classes.volunteerRow}>
                                <div className={classes.volunteerInfo}>
                                    <div className={classes.volunteerHeader}>
                                        <Flex align="center" gap="sm" style={{ minWidth: 0 }}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => onVolunteerSelect(volunteer.id)}
                                            />
                                            <HoverCard
                                                shadow="md"
                                                position="top"
                                                withArrow
                                                openDelay={0}
                                                closeDelay={100}
                                            >
                                                <HoverCard.Target>
                                                    <Flex
                                                        align="center"
                                                        gap="sm"
                                                        style={{ minWidth: 0, cursor: "default" }}
                                                    >
                                                        <Avatar
                                                            size={28}
                                                            src={volunteer.avatar?.link}
                                                            name={volunteer.fullName}
                                                        />
                                                        <div style={{ minWidth: 0 }}>
                                                            <Text
                                                                size="sm"
                                                                fw={500}
                                                                className={`${classes.volunteerName} ${isSelected ? classes.selectedVolunteer : ""}`}
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() => onVolunteerSelect(volunteer.id)}
                                                            >
                                                                {volunteer.fullName}
                                                            </Text>
                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                                className={classes.volunteerName}
                                                            >
                                                                {volunteer.program
                                                                    ? getLocalizedName(volunteer.program, intl.locale)
                                                                    : intl.formatMessage({ id: locales.noProgram })}
                                                            </Text>
                                                        </div>
                                                    </Flex>
                                                </HoverCard.Target>
                                                <HoverCard.Dropdown
                                                    style={{
                                                        maxWidth: "min(86vw, 460px)",
                                                        overflowWrap: "anywhere",
                                                        wordBreak: "break-word",
                                                    }}
                                                >
                                                    {(() => {
                                                        const s = getStatsForPopover(volunteer)
                                                        return (
                                                            <div>
                                                                <Text size="xs" fw={600} mb={4}>
                                                                    <FormattedMessage id={locales.reportsStats} />
                                                                </Text>
                                                                <Text size="xs">
                                                                    {s.totalReports}{" "}
                                                                    <FormattedMessage id={locales.piecesShort} /> •{" "}
                                                                    <FormattedMessage id={locales.totalHours} />:{" "}
                                                                    {s.totalHours} •{" "}
                                                                    <FormattedMessage
                                                                        id={locales.requiredHoursForPeriod}
                                                                    />
                                                                    : {s.workedRequired.required}
                                                                </Text>
                                                                <Text size="xs" fw={600} mt="xs" mb={4}>
                                                                    <FormattedMessage id={locales.lastReport} />
                                                                </Text>
                                                                {volunteer.contracts &&
                                                                volunteer.contracts.length === 0 ? (
                                                                    <Text size="xs" c="dimmed">
                                                                        N/A
                                                                    </Text>
                                                                ) : s.lastReport ? (
                                                                    <Text size="xs">
                                                                        {dayjs(s.lastReport.week).format("DD.MM.YYYY")}{" "}
                                                                        — {s.lastReport.hoursSpent}{" "}
                                                                        <FormattedMessage id={locales.hours} />
                                                                    </Text>
                                                                ) : (
                                                                    <Text size="xs" c="dimmed">
                                                                        <FormattedMessage id={locales.noReports} />
                                                                    </Text>
                                                                )}
                                                                <Text size="xs" fw={600} mt="xs" mb={4}>
                                                                    <FormattedMessage id={locales.status} />
                                                                </Text>
                                                                <Badge size="xs" color={s.statusColor} variant="light">
                                                                    {s.statusText} • {s.workedRequired.text}
                                                                </Badge>
                                                            </div>
                                                        )
                                                    })()}
                                                </HoverCard.Dropdown>
                                            </HoverCard>
                                        </Flex>
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
                                            {allNA || !firstContractStart ? "N/A" : `${workedHours}/${requiredHours}`}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={classes.weekSquares}>
                                    {weeks.map((_, weekIndex) => (
                                        <HoverCard
                                            key={weekIndex}
                                            position="top"
                                            withArrow
                                            shadow="md"
                                            openDelay={0}
                                            closeDelay={100}
                                            withinPortal
                                        >
                                            <HoverCard.Target>
                                                <Box
                                                    className={`${classes.weekSquare} ${classes[getSquareColor(volunteer, weekIndex)]}`}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            </HoverCard.Target>
                                            <HoverCard.Dropdown
                                                style={{
                                                    maxWidth: "min(86vw, 420px)",
                                                    overflowWrap: "anywhere",
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                <Text size="xs" style={{ whiteSpace: "normal", lineHeight: 1.35 }}>
                                                    {getSquareInfoLabel(volunteer, weekIndex)}
                                                </Text>
                                            </HoverCard.Dropdown>
                                        </HoverCard>
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
