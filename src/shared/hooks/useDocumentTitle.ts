import { useEffect } from "react"

import { PrimitiveType } from "intl-messageformat"

import { useFormatMessage } from "./useFormatMessage"

const DEFAULT_TITLE = "Портал волонтера"

export function useSetDocumentTitleByLocale(
    locale: string,
    values?: Record<string, PrimitiveType>
) {
    const formatMessage = useFormatMessage()
    const title = formatMessage(locale, values)

    useEffect(() => {
        document.title = title

        return () => {
            document.title = DEFAULT_TITLE
        }
    }, [title])
}

export const setDocumentTitleByString = (
    title: string | PrimitiveType[] | null | undefined
) => {
    if (title) {
        if (Array.isArray(title)) {
            document.title = title.filter(Boolean).join(" | ")
        } else {
            document.title = title
        }
    }
}
