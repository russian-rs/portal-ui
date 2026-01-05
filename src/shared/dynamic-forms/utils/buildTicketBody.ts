import { CaseValues } from "src/shared/dynamic-forms/types"

function esc(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;")
}

export function buildDefinitionList(items: Array<{ label: string; value: string | undefined | null }>): string {
    const rows = items
        .filter((i) => (i.value ?? "").toString().trim().length > 0)
        .map((i) => `<p><strong>${esc(i.label)}:</strong> ${esc(String(i.value ?? ""))}</p>`)
        .join("")
    return rows.length > 0 ? rows : "<p>(нет данных)</p>"
}

export function getValue(values: CaseValues, key: string): string {
    return (values[key] ?? "").toString()
}

