import { ActionIcon, Text } from '@mantine/core'
import { useContext } from 'react'
import { LocaleContext } from 'src/app/providers/LocaleContext'
import { Locale } from 'src/shared/constants/Locales'

export const LocaleSwitcher = () => {
    const { locale, setLocale } = useContext(LocaleContext)

    const getFontWeight = (iconLocale: Locale) => {
        if (iconLocale === locale) {
            return 700
        } else {
            return 300
        }
    }

    return (
        <>
            <ActionIcon.Group>
                <ActionIcon
                    variant="default"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Russian language"
                    onClick={() => setLocale(Locale.RU)}
                >
                    <Text fw={getFontWeight(Locale.RU)}>{Locale.RU}</Text>
                </ActionIcon>
                <ActionIcon
                    variant="default"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="English language"
                    onClick={() => setLocale(Locale.EN)}
                >
                    <Text fw={getFontWeight(Locale.EN)}>{Locale.EN}</Text>
                </ActionIcon>
                <ActionIcon
                    variant="default"
                    color="gray"
                    size="lg"
                    radius="md"
                    aria-label="Serbian language"
                    onClick={() => setLocale(Locale.SR)}
                >
                    <Text fw={getFontWeight(Locale.SR)}>{Locale.SR}</Text>
                </ActionIcon>
            </ActionIcon.Group>
        </>
    )
}
