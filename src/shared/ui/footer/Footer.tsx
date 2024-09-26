import { Group, Text } from '@mantine/core'
import { ThemeSwitcher } from 'src/shared/ui/theme/ThemeSwitcher'
import { StyledGroup } from 'src/shared/ui/footer/Footer.styles'
import { LocaleSwitcher } from 'src/shared/ui/locale/LocaleSwitcher'
import { FormattedMessage } from 'react-intl'

export const Footer = () => {
    return (
        <>
            <Group component={StyledGroup} grow>
                <Group>
                    <ThemeSwitcher />
                    <LocaleSwitcher />
                </Group>
                <Group justify="flex-end">
                    <Text c="dimmed">
                        <FormattedMessage id="footer.copyright" />
                    </Text>
                </Group>
            </Group>
        </>
    )
}

export default Footer
