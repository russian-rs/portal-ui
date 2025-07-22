import { Select } from "@mantine/core"
import { useIntl } from "react-intl"
import { usePrograms } from "src/app/providers/ProgramsProvider"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { locales } from "../lib/locales"
import { useState, useRef } from "react"

interface ProgramFilterProps {
    value: string | null
    onChange: (program: string | null) => void
    className?: string
    placeholder?: string
}

export function ProgramFilter({ value, onChange, className, placeholder }: ProgramFilterProps) {
    const programs = usePrograms()
    const intl = useIntl()
    const [search, setSearch] = useState("")
    const selectRef = useRef<HTMLInputElement>(null)

    const programOptions = [
        { value: "NO_PROGRAM", label: intl.formatMessage({ id: locales.noProgram }) },
        ...programs.map(program => ({
            value: program.code.toUpperCase(),
            label: getLocalizedName(program, intl.locale),
        }))
    ]

    const handleChange = (newValue: string | null) => {
        onChange(newValue)
    }

    return (
        <Select
            ref={selectRef}
            data={programOptions}
            value={value}
            onChange={handleChange}
            placeholder={placeholder || intl.formatMessage({ id: locales.filterByProgram })}
            clearable
            maxDropdownHeight={400}
            searchValue={search}
            onSearchChange={setSearch}
            className={className}
        />
    )
}