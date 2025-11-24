import { Avatar, Badge, Box, Button, Checkbox, Flex, Group, HoverCard, Text } from "@mantine/core"
import { VolunteerHeatMapItem } from "@russian-rs/portal-api-axios"
import { IconCheck, IconCheckupList, IconUser } from "@tabler/icons-react"
import dayjs from "dayjs"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { locales } from "../lib/locales"
import classes from "./VolunteerReportHeatmap.module.scss"

interface VolunteerReportHeatmapProps {
    volunteers: VolunteerHeatMapItem[]
    startDate: dayjs.Dayjs
    onVolunteerSelect: (volunteerId: number) => void
    selectedVolunteers: Set<number>
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

    const getVolunteerStatusColor = (volunteer: VolunteerHeatMapItem) => {
        if (volunteer.totalRequired == 0) return "gray"
        if (volunteer.totalWorked!! < volunteer.totalRequired!!) return "red"
        return "green"
    }

    const getVolunteerStatusText = (volunteer: VolunteerHeatMapItem) => {
        if (volunteer.totalRequired == 0) return "N/A"
        const hoursDiff = volunteer.totalRequired!! - volunteer.totalWorked!!
        if (hoursDiff > 0) return intl.formatMessage({ id: locales.statusMissedWeeks }, { count: hoursDiff })
        return intl.formatMessage({ id: locales.statusAllOk })
    }

    const getStatsForPopover = (volunteer: VolunteerHeatMapItem) => {
        const statusText = getVolunteerStatusText(volunteer)
        const statusColor = getVolunteerStatusColor(volunteer)
        return { volunteer, statusText, statusColor }
    }

    // Получаем цвет для квадратика на основе количества часов за неделю
    const getSquareColor = (volunteer: VolunteerHeatMapItem, weekIndex: number) => {
        const weekInfo = volunteer.weeks.findLast((week) => week.week == weekIndex)!!
        const isCurrentWeek = dayjs().isoWeek() == weekIndex

        if (weekInfo.hoursRequired == 0) {
            return "na"
        }
        if (isCurrentWeek) {
            return "waiting"
        }
        if (weekInfo.hoursWorked == 0) {
            return "noReports"
        }
        if (weekInfo.hoursWorked < weekInfo.hoursRequired) {
            return "partialReports"
        }
        return "fullReports"
    }

    // Получаем подсказку для квадратика (локализовано)
    const getSquareTooltip = (volunteer: VolunteerHeatMapItem, weekIndex: number) => {
        const weekInfo = volunteer.weeks.findLast((week) => week.week == weekIndex)!!

        return intl.formatMessage(
            { id: locales.tooltipReports },
            {
                name: volunteer.volunteerInfo.fullName,
                hours: weekInfo.hoursWorked,
                hoursLabel: intl.formatMessage({ id: locales.hours }),
                from: dayjs(weekInfo.weekStart).format("DD.MM.YYYY"),
                to: dayjs(weekInfo.weekEnd).format("DD.MM.YYYY"),
                week: intl.formatMessage({ id: locales.tooltipWeek }, { num: weekIndex }),
            }
        )
    }

    // Формирует общий текст для окошка информации по квадратику, включая номер недели
    const getSquareInfoLabel = (volunteer: VolunteerHeatMapItem, weekIndex: number) => {
        const color = getSquareColor(volunteer, weekIndex)
        const weekInfo = volunteer.weeks.findLast((week) => week.week == weekIndex)!!
        const weekLabel = intl.formatMessage({ id: locales.tooltipWeek }, { num: weekIndex })
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

        return getSquareTooltip(volunteer, weekIndex)
    }

    const getProgramDescription = (volunteer: VolunteerHeatMapItem): string => {
        const program = volunteer.volunteerInfo.program
            ? getLocalizedName(volunteer.volunteerInfo.program, intl.locale)
            : null
        const project = volunteer.volunteerInfo.project
            ? getLocalizedName(volunteer.volunteerInfo.project, intl.locale)
            : null
        if (program && project) {
            if (program == project) {
                return program
            } else {
                return `${program} • ${project}`
            }
        }
        if (program) {
            return program
        }
        return ""
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
        <Flex className={classes.heatmapContainer}>
            <Flex justify="center" mb="lg">
                <Group gap="xs">
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
                        const isSelected = selectedVolunteers.has(volunteer.volunteerInfo.id)

                        return (
                            <div key={volunteer.volunteerInfo.id} className={classes.volunteerRow}>
                                <div className={classes.volunteerInfo}>
                                    <div className={classes.volunteerHeader}>
                                        <Flex align="center" gap="sm" style={{ minWidth: 0 }}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => onVolunteerSelect(volunteer.volunteerInfo.id)}
                                            />
                                            <Flex align="center" gap="sm" style={{ minWidth: 0, cursor: "default" }}>
                                                <Avatar
                                                    size={28}
                                                    src={volunteer.volunteerInfo.avatar?.link}
                                                    name={volunteer.volunteerInfo.fullName}
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() =>
                                                        window.open(
                                                            `/profile/${volunteer.volunteerInfo.username}`,
                                                            "_blank"
                                                        )
                                                    }
                                                />
                                                <HoverCard
                                                    shadow="md"
                                                    position="right"
                                                    withArrow
                                                    openDelay={0}
                                                    closeDelay={100}
                                                >
                                                    <HoverCard.Target>
                                                        <div style={{ minWidth: 0 }}>
                                                            <Text
                                                                size="sm"
                                                                fw={500}
                                                                className={`${classes.volunteerName} ${isSelected ? classes.selectedVolunteer : ""}`}
                                                                style={{ cursor: "pointer" }}
                                                                onClick={() =>
                                                                    onVolunteerSelect(volunteer.volunteerInfo.id)
                                                                }
                                                            >
                                                                {volunteer.volunteerInfo.fullName}
                                                            </Text>
                                                            <Text
                                                                size="xs"
                                                                c="dimmed"
                                                                className={classes.volunteerName}
                                                            >
                                                                {getProgramDescription(volunteer)}
                                                            </Text>
                                                        </div>
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
                                                                <Flex direction="column" gap="sm">
                                                                    <Text size="s" fw={600} mb={8}>
                                                                        {volunteer.volunteerInfo.fullName}
                                                                    </Text>
                                                                    <Text size="xs">
                                                                        <FormattedMessage id={locales.totalHours} />:{" "}
                                                                        {s.volunteer.totalWorked} •{" "}
                                                                        <FormattedMessage
                                                                            id={locales.requiredHoursForPeriod}
                                                                        />
                                                                        : {s.volunteer.totalRequired}
                                                                    </Text>
                                                                    <Badge
                                                                        size="xs"
                                                                        color={s.statusColor}
                                                                        variant="light"
                                                                    >
                                                                        {s.statusText}
                                                                    </Badge>
                                                                    <Flex gap="xs">
                                                                        <Button
                                                                            variant="outline"
                                                                            leftSection={<IconUser size={16} />}
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    `/profile/${volunteer.volunteerInfo.username}`,
                                                                                    "_blank"
                                                                                )
                                                                            }
                                                                        >
                                                                            <FormattedMessage id={locales.profile} />
                                                                        </Button>
                                                                        <Button
                                                                            variant="outline"
                                                                            leftSection={<IconCheckupList size={16} />}
                                                                            onClick={() =>
                                                                                window.open(
                                                                                    `/reports?login=${volunteer.volunteerInfo.username}`,
                                                                                    "_blank"
                                                                                )
                                                                            }
                                                                        >
                                                                            <FormattedMessage id={locales.reports} />
                                                                        </Button>
                                                                    </Flex>
                                                                </Flex>
                                                            )
                                                        })()}
                                                    </HoverCard.Dropdown>
                                                </HoverCard>
                                            </Flex>
                                        </Flex>
                                        <Badge
                                            size="xs"
                                            variant="filled"
                                            color={getVolunteerStatusColor(volunteer)}
                                            leftSection={
                                                getVolunteerStatusColor(volunteer) == "green" ? (
                                                    <IconCheck size={12} style={{ marginRight: 2, marginBottom: 1 }} />
                                                ) : undefined
                                            }
                                            px={6}
                                            py={2}
                                            styles={{ section: { marginRight: 0 } }}
                                        >
                                            {volunteer.totalRequired == 0
                                                ? "N/A"
                                                : `${volunteer.totalWorked}/${volunteer.totalRequired}`}
                                        </Badge>
                                    </div>
                                </div>
                                <div className={classes.weekSquares}>
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
                                                <Box
                                                    className={`${classes.weekSquare} ${classes[getSquareColor(volunteer, week.weekNumber)]}`}
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
                                                    {getSquareInfoLabel(volunteer, week.weekNumber)}
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
        </Flex>
    )
}
