import { MultiSelect } from "@mantine/core"
import { useIntl } from "react-intl"
import { usePrograms } from "src/app/providers/ProgramsProvider"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { locales } from "../lib/locales"
import { useState } from "react"

interface ProgramFilterProps {
    value: string[]
    onChange: (programs: string[]) => void
    maxValues?: number
}

export function ProgramFilter({ value, onChange, maxValues }: ProgramFilterProps) {
    const programs = usePrograms()
    const intl = useIntl()
    const [search, setSearch] = useState("")

    const programOptions = [
        { value: "no_program", label: intl.formatMessage({ id: locales.noProgram }) },
        ...programs.map(program => ({
            value: program.code,
            label: getLocalizedName(program, intl.locale),
        }))
    ]

    return (
        <MultiSelect
            data={programOptions}
            value={value}
            onChange={onChange}
            placeholder={value.length === 0 ? intl.formatMessage({ id: locales.filterByProgram }) : ""}
            style={{ width: "14rem" }}
            clearable
            maxDropdownHeight={400}
            searchValue={search}
            onSearchChange={setSearch}
            maxValues={maxValues}
        />
    )
}