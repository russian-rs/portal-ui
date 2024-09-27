import { Locale } from "src/shared/constants/Locales"
import { SimpleLocalStorageService } from "src/shared/localStorage/SimpleLocalStorageService"
import { LOCALE } from "src/shared/constants/Storage"
import { createContext, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { flatten } from "flat"
import { IntlProvider, ResolvedIntlConfig } from "react-intl"

function loadLocale(locale: Locale) {
    return import(`src/shared/locales/${locale}.json`)
}

const savedLocale = SimpleLocalStorageService.getItem(LOCALE) as Locale
export const selectedLocale = savedLocale || Locale.RU

if (!savedLocale) {
    SimpleLocalStorageService.setItem(LOCALE, selectedLocale)
}

const setLocale = (locale: Locale) => {
    SimpleLocalStorageService.setItem(LOCALE, locale)
    window.location.reload()
}

interface LocaleContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
}

const defaultContextValue: LocaleContextType = {
    locale: selectedLocale,
    setLocale: setLocale,
}

export const LocaleContext = createContext(defaultContextValue)

export const LanguageContextProvider = ({
    children,
}: {
    children?: ReactNode
}) => {
    const { data: messages = {}, isLoading } = useQuery({
        queryKey: ["loadLocale"],
        queryFn: async () => {
            const locales = await loadLocale(defaultContextValue.locale)
            return flatten(locales.default) as ResolvedIntlConfig["messages"]
        },
        retry: 3,
    })

    return (
        <LocaleContext.Provider value={defaultContextValue}>
            <IntlProvider
                locale={defaultContextValue.locale}
                messages={messages}
            >
                {isLoading ? null : children}
            </IntlProvider>
        </LocaleContext.Provider>
    )
}
