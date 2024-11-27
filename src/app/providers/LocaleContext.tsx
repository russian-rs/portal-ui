import { DatesProvider } from "@mantine/dates"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import "dayjs/locale/ru"
import "dayjs/locale/en"
import "dayjs/locale/sr"
import { flatten } from "flat"
import { createContext, ReactNode, useEffect } from "react"
import { IntlProvider, ResolvedIntlConfig } from "react-intl"
import { Locale } from "src/shared/constants/Locales"
import { LOCALE } from "src/shared/constants/Storage"
import { SimpleLocalStorageService } from "src/shared/localStorage/SimpleLocalStorageService"

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

export const LanguageContextProvider = ({ children }: { children?: ReactNode }) => {
    const { data: messages = {}, isLoading } = useQuery({
        queryKey: ["loadLocale"],
        queryFn: async () => {
            const locales = await loadLocale(defaultContextValue.locale)
            return flatten(locales.default) as ResolvedIntlConfig["messages"]
        },
        retry: 3,
    })

    useEffect(() => {
        dayjs.locale(selectedLocale)
    }, [])

    return (
        <LocaleContext.Provider value={defaultContextValue}>
            <IntlProvider locale={defaultContextValue.locale} messages={messages}>
                <DatesProvider settings={{ locale: selectedLocale }}>{isLoading ? null : children}</DatesProvider>
            </IntlProvider>
        </LocaleContext.Provider>
    )
}
