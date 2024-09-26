import { useCallback } from 'react'
import { useIntl } from 'react-intl'

import { FormatXMLElementFn, PrimitiveType } from 'intl-messageformat'

type Values = Record<
    string,
    PrimitiveType | FormatXMLElementFn<string, string> | any
>

export type FormatMessage = (id: string, values?: Values) => string

export function useFormatMessage(): FormatMessage {
    const intl = useIntl()

    // @ts-ignore
    return useCallback(
        (id, values) => intl.formatMessage({ id }, values),
        [intl]
    )
}
