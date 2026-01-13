import { Flex, Select, Text, Textarea, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import React, { useMemo } from "react"
import { useIntl } from "react-intl"
import { CaseField, CaseValues } from "src/shared/dynamic-forms/types"

type Props = {
    fields: CaseField[]
    values: CaseValues
    onChange: (next: CaseValues) => void
    errors?: Record<string, string>
}

export const CaseForm: React.FC<Props> = ({ fields, values, onChange, errors }) => {
    const intl = useIntl()

    const update = (name: string, value: string) => {
        onChange({ ...values, [name]: value })
    }

    const rendered = useMemo(() => {
        const isVisible = (field: CaseField) => {
            if (!field.visibleWhen) return true
            const current = (values[field.visibleWhen.field] ?? "").toString()
            return current === field.visibleWhen.equals
        }

        return fields.filter(isVisible).map((field) => {
            const label = intl.formatMessage({ id: field.labelKey })
            const error = errors?.[field.name]
            const required = Boolean(field.required)
            const value = values[field.name] ?? ""

            if (field.type === "text") {
                return (
                    <TextInput
                        key={field.name}
                        withAsterisk={required}
                        label={label}
                        value={value}
                        error={error}
                        onChange={(e) => update(field.name, e.currentTarget.value)}
                    />
                )
            }

            if (field.type === "textarea") {
                return (
                    <Textarea
                        key={field.name}
                        withAsterisk={required}
                        label={label}
                        value={value}
                        error={error}
                        autosize
                        minRows={3}
                        onChange={(e) => update(field.name, e.currentTarget.value)}
                    />
                )
            }

            if (field.type === "select") {
                const data = field.options.map((o) => ({
                    value: o.value,
                    label: intl.formatMessage({ id: o.labelKey }),
                }))
                return (
                    <Select
                        key={field.name}
                        withAsterisk={required}
                        label={label}
                        value={value || null}
                        error={error}
                        allowDeselect={!required}
                        data={data}
                        onChange={(v) => update(field.name, v ?? "")}
                    />
                )
            }

            if (field.type === "date") {
                return (
                    <Flex key={field.name} direction="column" gap={4}>
                        <DateInput
                            withAsterisk={required}
                            label={label}
                            value={value ? new Date(value) : null}
                            onChange={(d) => update(field.name, d ? d.toISOString().slice(0, 10) : "")}
                            error={Boolean(error)}
                        />
                        {error ? (
                            <Text size="xs" c="red.7">
                                {error}
                            </Text>
                        ) : null}
                    </Flex>
                )
            }

            return null
        })
    }, [fields, values, errors, intl])

    return (
        <Flex direction="column" gap="md">
            {rendered}
        </Flex>
    )
}

export default CaseForm
