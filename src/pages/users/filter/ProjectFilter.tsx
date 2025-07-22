import { Select } from "@mantine/core"
import { useIntl } from "react-intl"
import { useProjects } from "src/app/providers/ProjectsProvider"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { locales } from "../lib/locales"

interface ProjectFilterProps {
    value: string | null
    onChange: (project: string | null) => void
    className?: string
    placeholder?: string
}

export function ProjectFilter({ value, onChange, className, placeholder }: ProjectFilterProps) {
    const projects = useProjects()
    const intl = useIntl()

    const projectOptions = [
        { value: "NO_PROJECT", label: intl.formatMessage({ id: locales.noProject }) },
        ...projects.map(project => ({
            value: project.code,
            label: getLocalizedName(project, intl.locale),
        }))
    ]

    return (
        <Select
            data={projectOptions}
            value={value}
            onChange={onChange}
            placeholder={placeholder || intl.formatMessage({ id: locales.filterByProject })}
            clearable
            className={className}
        />
    )
} 