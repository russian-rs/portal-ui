import { Box, Flex, Group, Text } from "@mantine/core"
import { VolunteerHeatMapItem } from "@russian-rs/portal-api-axios"
import dayjs from "dayjs"
import React, { useMemo } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { locales } from "../lib/locales"
import classes from "./VolunteerReportHeatmap.module.scss"
import { VolunteerRow, WeekInfo } from "./VolunteerRow"

interface Props {
    volunteers: VolunteerHeatMapItem[]
    startDate: dayjs.Dayjs
    onVolunteerSelect: (id: number) => void
    selectedVolunteers: Set<number>
    totalVolunteers: number
}

export const VolunteerReportHeatmap: React.FC<Props> = ({
    volunteers,
    startDate,
    onVolunteerSelect,
    selectedVolunteers,
    totalVolunteers,
}) => {
    const intl = useIntl()

    const endDate = dayjs().startOf("isoWeek")
    const totalWeeks = endDate.diff(startDate.startOf("isoWeek"), "week") + 1

    const weeks: WeekInfo[] = useMemo(() => {
        const arr: WeekInfo[] = []
        let d = startDate.clone().startOf("isoWeek")

        for (let i = 0; i < totalWeeks; i++) {
            arr.push({
                date: d.clone(),
                weekNumber: d.isoWeek(),
            })
            d = d.add(1, "week")
        }

        return arr
    }, [startDate, totalWeeks])

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
            {/* legend */}
            <Flex justify="center" mb="lg">
                <Group gap="xs">
                    <Legend color="noReports" label={locales.noReports} />
                    <Legend color="partialReports" label={locales.partialReports} />
                    <Legend color="fullReports" label={locales.fullReports} />
                    <Legend color="na" label={locales.na} />
                    <Legend color="waiting" label={locales.pending} />
                </Group>
            </Flex>

            <div className={classes.heatmapWrapper}>
                <div className={classes.heatmapGrid}>
                    {/* header */}
                    <div className={classes.headerRow}>
                        <div className={classes.headerSpacer} />
                        <div className={classes.weekHeaders}>
                            {weeks.map((w) => (
                                <div key={w.date.toString()} className={classes.weekHeader}>
                                    <Text size="xs" c="dimmed">
                                        {w.weekNumber}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* rows */}
                    {volunteers.map((v) => (
                        <VolunteerRow
                            key={v.volunteerInfo.id}
                            volunteer={v}
                            weeks={weeks}
                            isSelected={selectedVolunteers.has(v.volunteerInfo.id)}
                            onVolunteerSelect={onVolunteerSelect}
                            startDate={startDate}
                        />
                    ))}
                </div>
            </div>

            <Flex justify="center" mt="lg">
                <Group gap="lg">
                    <Info label={locales.totalVolunteers} value={totalVolunteers} />
                    <Info
                        label={locales.period}
                        value={`${startDate.format("DD.MM.YYYY")} - ${endDate.format("DD.MM.YYYY")}`}
                    />
                    <Info label={locales.totalWeeks} value={totalWeeks} />
                </Group>
            </Flex>
        </Flex>
    )
}

const Legend = ({ color, label }: { color: string; label: string }) => (
    <Flex align="center" gap="xs">
        <Box className={`${classes.legendSquare} ${classes[color]}`} />
        <Text size="xs">
            <FormattedMessage id={label} />
        </Text>
    </Flex>
)

const Info = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Flex align="center" gap="xs">
        <Text size="sm" fw={500}>
            <FormattedMessage id={label} />:
        </Text>
        <Text size="sm" c="dimmed">
            {value}
        </Text>
    </Flex>
)