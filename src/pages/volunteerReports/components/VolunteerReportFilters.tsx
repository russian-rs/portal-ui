import { Box, Flex, Input, Paper, Select, Text, Button, Checkbox } from "@mantine/core"
import { IconSearch, IconFilter, IconX } from "@tabler/icons-react"
import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { ProgramFilter, ProjectFilter } from "src/shared/ui/filter"
import { locales } from "../lib/locales"
import classes from "./VolunteerReportFilters.module.scss"

interface VolunteerReportFiltersProps {
    search: string
    onSearchChange: (value: string) => void
    selectedProgram: string | null
    onProgramChange: (value: string | null) => void
    selectedProject: string | null
    onProjectChange: (value: string | null) => void
    periodMonths: string
    onPeriodChange: (value: string) => void
    hideNA: boolean
    onHideNAChange: (value: boolean) => void
    onReset: () => void
}

export const VolunteerReportFilters: React.FC<VolunteerReportFiltersProps> = ({
    search,
    onSearchChange,
    selectedProgram,
    onProgramChange,
    selectedProject,
    onProjectChange,
    periodMonths,
    onPeriodChange,
    hideNA,
    onHideNAChange,
    onReset,
}) => {
    const intl = useIntl()
    const hasActiveFilters = search || selectedProgram || selectedProject || periodMonths !== "3"

    return (
        <Paper withBorder p="md" className={classes.filtersContainer}>
            <Flex direction="column" gap="md">
                <Flex align="center" gap="sm">
                    <IconFilter size={20} />
                    <Text fw={500}>
                        <FormattedMessage id={locales.filters} />
                    </Text>
                    {hasActiveFilters && (
                        <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconX size={14} />}
                            onClick={onReset}
                            color="gray"
                        >
                            <FormattedMessage id={locales.reset} />
                        </Button>
                    )}
                </Flex>
                <Flex gap="md" wrap="wrap" align="flex-end">
                    <Box className={classes.filterItem}>
                        <Input
                            placeholder={intl.formatMessage({ id: locales.search })}
                            value={search}
                            onChange={(event) => onSearchChange(event.currentTarget.value)}
                            leftSection={<IconSearch size={16} />}
                            className={classes.searchInput}
                        />
                    </Box>
                    <Box className={classes.filterItem}>
                        <ProgramFilter
                            value={selectedProgram}
                            onChange={onProgramChange}
                            placeholder={intl.formatMessage({ id: locales.program })}
                        />
                    </Box>
                    <Box className={classes.filterItem}>
                        <ProjectFilter
                            value={selectedProject}
                            onChange={onProjectChange}
                            placeholder={intl.formatMessage({ id: locales.project })}
                        />
                    </Box>
                    <Box className={classes.filterItem}>
                        <Select
                            label={intl.formatMessage({ id: locales.period })}
                            placeholder={intl.formatMessage({ id: locales.period })}
                            value={periodMonths}
                            onChange={(value) => onPeriodChange(value || "3")}
                            data={[
                                { value: "3", label: "Последние 3 месяца" },
                                { value: "6", label: "Последние 6 месяцев" },
                                { value: "year", label: "С начала года" },
                            ]}
                            className={classes.periodSelect}
                        />
                    </Box>
                    <Box className={classes.filterItem}>
                        <Checkbox
                            label="Скрывать без контрактов (N/A)"
                            checked={hideNA}
                            onChange={(e) => onHideNAChange(e.currentTarget.checked)}
                        />
                    </Box>
                </Flex>
            </Flex>
        </Paper>
    )
}
