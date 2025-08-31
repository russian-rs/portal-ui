import { Title } from "@mantine/core"
import { FormattedMessage } from "react-intl"
import { locales } from "../lib/locales"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"

export default function MintrudReport() {
    setDocumentTitleByLocale(locales.title)
    return (
        <div>
            {/* TODO: здесь разместите содержимое отчёта Минтруд */}
        </div>
    )
}