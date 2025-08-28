import { Avatar, Badge, Checkbox, Flex, Table, Text, Tooltip, ActionIcon } from "@mantine/core"
import { IconEye, IconMail, IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react"
import dayjs from "dayjs"
import React, { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { VolunteerReportData } from "../lib/types"
import { locales } from "../lib/locales"
import { VolunteerReportApiService } from "../lib/VolunteerReportApiService"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import classes from "./VolunteerReportTable.module.scss"

interface VolunteerReportTableProps {
    volunteers: VolunteerReportData[]
    selectedVolunteers: Set<string>
    onVolunteerSelect: (volunteerId: string, checked: boolean) => void
    onVolunteerClick: (volunteerId: string) => void
    startDate: dayjs.Dayjs
}

export const VolunteerReportTable: React.FC<VolunteerReportTableProps> = ({
    volunteers,
    selectedVolunteers,
    onVolunteerSelect,
    onVolunteerClick,
    startDate
}) => {
    const intl = useIntl()
    const [mockVolunteers, setMockVolunteers] = useState<VolunteerReportData[]>([])

    useEffect(() => {
        let isMounted = true
        const loadMocks = async () => {
            if (volunteers.length > 0) return
            try {
                const startDate = dayjs().subtract(3, 'month').startOf('month').toISOString()
                const res = await VolunteerReportApiService.getVolunteerReports({
                    startDate,
                    pageRequest: { pageNumber: 0, pageSize: 25 }
                })
                if (isMounted) setMockVolunteers(res.content)
            } catch {

            }
        }
        loadMocks()
        return () => { isMounted = false }
    }, [volunteers.length])

    const data: VolunteerReportData[] = volunteers.length > 0 ? volunteers : mockVolunteers
    const getVolunteerStats = (volunteer: VolunteerReportData) => {
        const totalReports = volunteer.reports.length
        const totalHours = volunteer.reports.reduce((sum, report) => sum + report.hoursSpent, 0)
        const averageHoursPerWeek = totalReports > 0 ? (totalHours / totalReports).toFixed(1) : 0
        
        const lastReport = volunteer.reports.length > 0 
            ? volunteer.reports.reduce((latest, report) => 
                dayjs(report.week).isAfter(dayjs(latest.week)) ? report : latest
              )
            : null
        
        const weeksSinceLastReport = (() => {
            if (!lastReport) return 0
            const currentWeekStart = dayjs().startOf('isoWeek')
            const lastReportWeekStart = dayjs(lastReport.week).startOf('isoWeek')
            let diffWeeks = currentWeekStart.diff(lastReportWeekStart, 'week')
            const hasReportThisWeek = volunteer.reports.some(r =>
                dayjs(r.week).isSame(currentWeekStart, 'isoWeek')
            )
            if (!hasReportThisWeek && diffWeeks > 0) diffWeeks -= 1
            return Math.max(diffWeeks, 0)
        })()

        const lastWeekStart = dayjs().startOf('isoWeek').subtract(1, 'week')
        const lastWeekHours = volunteer.reports
            .filter(r => dayjs(r.week).isSame(lastWeekStart, 'isoWeek'))
            .reduce((sum, r) => sum + r.hoursSpent, 0)
        
        return {
            totalReports,
            totalHours,
            averageHoursPerWeek,
            lastReport,
            weeksSinceLastReport,
            lastWeekHours
        }
    }

    // Агрегаты по всему периоду (с учётом контрактов)
    const getPeriodAggregates = (volunteer: VolunteerReportData) => {
        const now = dayjs()
        const totalWeeks = Math.ceil(now.diff(startDate, 'week', true))
        const firstContractStart = volunteer.contracts && volunteer.contracts.length > 0
            ? volunteer.contracts
                .map(c => dayjs(c.startDate).startOf('isoWeek'))
                .reduce((earliest, d) => (d.isBefore(earliest) ? d : earliest))
            : null

        let missedCount = 0
        let partialCount = 0

        for (let i = 0; i < totalWeeks; i++) {
            const weekStart = startDate.clone().add(i, 'week').startOf('isoWeek')
            const isCurrentWeek = dayjs().isSame(weekStart, 'isoWeek')

            // До начала первого контракта — игнорируем
            if (firstContractStart && weekStart.isBefore(firstContractStart, 'week')) {
                continue
            }
            if (!firstContractStart) {
                // если контрактов нет — считаем все до текущей недели как отсутствующие
                if (!isCurrentWeek) {
                    missedCount += 1
                }
                continue
            }

            const hours = volunteer.reports
                .filter(r => dayjs(r.week).isSame(weekStart, 'isoWeek'))
                .reduce((sum, r) => sum + r.hoursSpent, 0)

            if (isCurrentWeek) {
                // текущую неделю не учитываем для статуса
                continue
            }

            if (hours === 0) missedCount += 1
            else if (hours < 10) partialCount += 1
        }

        return { missedCount, partialCount }
    }

    const getVolunteerStatusColor = (volunteer: VolunteerReportData) => {
        const { missedCount, partialCount } = getPeriodAggregates(volunteer)
        if (missedCount > 0) return 'red'
        if (partialCount > 0) return 'yellow'
        return 'green'
    }

    const getVolunteerStatusText = (volunteer: VolunteerReportData) => {
        const { missedCount, partialCount } = getPeriodAggregates(volunteer)
        if (missedCount > 0) return intl.formatMessage({ id: locales.statusMissedWeeks }, { count: missedCount })
        if (partialCount > 0) return intl.formatMessage({ id: locales.statusPartialLastWeek })
        return intl.formatMessage({ id: locales.statusAllOk })
    }

    const getStatusIcon = (color: 'green' | 'yellow' | 'red') => {
        switch (color) {
            case 'green':
                return <IconCheck size={12} />
            case 'yellow':
                return <IconAlertTriangle size={12} />
            case 'red':
            default:
                return <IconX size={12} />
        }
    }

            if (data.length === 0) {
            return (
                <Flex justify="center" p="xl">
                    <Text c="dimmed"><FormattedMessage id={locales.volunteersNotFound} /></Text>
                </Flex>
            )
        }

    return (
        <div className={classes.tableContainer}>
            <Table className={classes.table}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th style={{ width: '50px' }}>
                            <Checkbox
                                checked={selectedVolunteers.size === data.length && data.length > 0}
                                indeterminate={selectedVolunteers.size > 0 && selectedVolunteers.size < data.length}
                                onChange={(event) => {
                                    if (event.currentTarget.checked) {
                                        data.forEach(v => onVolunteerSelect(v.id, true))
                                    } else {
                                        data.forEach(v => onVolunteerSelect(v.id, false))
                                    }
                                }}
                            />
                        </Table.Th>
                        <Table.Th><FormattedMessage id={locales.volunteer} /></Table.Th>
                        <Table.Th><FormattedMessage id={locales.programColumn} /></Table.Th>
                        <Table.Th><FormattedMessage id={locales.projectColumn} /></Table.Th>
                        <Table.Th><FormattedMessage id={locales.reportsStats} /></Table.Th>
                        <Table.Th><FormattedMessage id={locales.lastReport} /></Table.Th>
                        <Table.Th><FormattedMessage id={locales.status} /></Table.Th>
                        <Table.Th style={{ width: '100px' }}><FormattedMessage id={locales.actions} /></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {data.map((volunteer) => {
                        const stats = getVolunteerStats(volunteer)
                        const isSelected = selectedVolunteers.has(volunteer.id)
                        const statusColor = getVolunteerStatusColor(volunteer)
                        const statusText = getVolunteerStatusText(volunteer)
                        
                        return (
                            <Table.Tr 
                                key={volunteer.id} 
                                className={`${classes.tableRow} ${isSelected ? classes.selectedRow : ''}`}
                            >
                                <Table.Td>
                                    <Checkbox
                                        checked={isSelected}
                                        onChange={(event) => onVolunteerSelect(volunteer.id, event.currentTarget.checked)}
                                    />
                                </Table.Td>
                                
                                <Table.Td>
                                    <Flex align="center" gap="sm" className={classes.volunteerCell}>
                                        <Avatar
                                            size={32}
                                            src={volunteer.avatar?.link}
                                            name={volunteer.fullName}
                                        />
                                        <div>
                                            <Text fw={500} size="sm">
                                                {volunteer.fullName}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {volunteer.email}
                                            </Text>
                                        </div>
                                    </Flex>
                                </Table.Td>
                                
                                <Table.Td>
                                    <Text size="sm">
                                        {volunteer.program ? getLocalizedName(volunteer.program, intl.locale) : intl.formatMessage({ id: 'common.not-selected' })}
                                    </Text>
                                </Table.Td>
                                
                                <Table.Td>
                                    <Text size="sm">
                                        {volunteer.project ? getLocalizedName(volunteer.project, intl.locale) : intl.formatMessage({ id: 'common.not-selected' })}
                                    </Text>
                                </Table.Td>
                                
                                <Table.Td>
                                    <div className={classes.statsCell}>
                                        <Text size="sm" fw={500}>
                                            {stats.totalReports} <FormattedMessage id={locales.reportsStats} />
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            <FormattedMessage id={locales.totalHours} />: {stats.totalHours}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            <FormattedMessage id={locales.avgPerWeek} values={{ value: stats.averageHoursPerWeek }} />
                                        </Text>
                                    </div>
                                </Table.Td>
                                
                                <Table.Td>
                                    {stats.lastReport ? (
                                        <div>
                                            <Text size="sm">
                                                {dayjs(stats.lastReport.week).format('DD.MM.YYYY')}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {stats.lastReport.hoursSpent} <FormattedMessage id={locales.hours} />
                                            </Text>
                                        </div>
                                    ) : (
                                        <Text size="sm" c="dimmed">
                                            <FormattedMessage id={locales.noReports} />
                                        </Text>
                                    )}
                                </Table.Td>
                                
                                <Table.Td>
                                    <Tooltip label={statusText}>
                                        <Badge 
                                            className={classes.statusBadge}
                                            color={statusColor} 
                                            variant="light"
                                            size="md"
                                            radius="sm"
                                            leftSection={getStatusIcon(statusColor as 'green' | 'yellow' | 'red')}
                                        />
                                    </Tooltip>
                                </Table.Td>
                                
                                <Table.Td>
                                    <Flex gap="xs" justify="center">
                                        <Tooltip label={intl.formatMessage({ id: locales.viewProfile })}>
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => onVolunteerClick(volunteer.id)}
                                            >
                                                <IconEye size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        
                                        <Tooltip label={intl.formatMessage({ id: locales.sendMessage })}>
                                            <ActionIcon
                                                variant="subtle"
                                                color="green"
                                                onClick={() => {
                                                    // TODO: Открыть email drawer для одного волонтера
                                                    console.log('Send email to:', volunteer.email)
                                                }}
                                            >
                                                <IconMail size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Flex>
                                </Table.Td>
                            </Table.Tr>
                        )
                    })}
                </Table.Tbody>
            </Table>
        </div>
    )
}
