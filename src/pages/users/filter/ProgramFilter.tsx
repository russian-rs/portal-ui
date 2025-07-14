import { MultiSelect } from "@mantine/core"
import { useIntl } from "react-intl"
import { usePrograms } from "src/app/providers/ProgramsProvider"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { locales } from "../lib/locales"
import { useState, useRef } from "react"

interface ProgramFilterProps {
    value: string[]
    onChange: (programs: string[]) => void
    maxValues?: number
    className?: string
    autoClose?: boolean
    placeholder?: string
}

export function ProgramFilter({ value, onChange, maxValues, className, autoClose, placeholder }: ProgramFilterProps) {
    const programs = usePrograms()
    const intl = useIntl()
    const [search, setSearch] = useState("")
    const selectRef = useRef<HTMLInputElement>(null)

    const programOptions = [
        { value: "no_program", label: intl.formatMessage({ id: locales.noProgram }) },
        ...programs.map(program => ({
            value: program.code,
            label: getLocalizedName(program, intl.locale),
        }))
    ]

    const handleChange = (newValue: string[]) => {
        onChange(newValue)
        if (autoClose && maxValues === 1 && newValue.length > 0) {
            setTimeout(() => {
                selectRef.current?.blur()
            }, 100)
        }
    }

    return (
        <MultiSelect
            ref={selectRef}
            data={programOptions}
            value={value}
            onChange={handleChange}
            placeholder={value.length === 0 ? (placeholder || intl.formatMessage({ id: locales.filterByProgram })) : ""}
            clearable
            maxDropdownHeight={400}
            searchValue={search}
            onSearchChange={setSearch}
            maxValues={maxValues}
            className={className}
        />
    )
}