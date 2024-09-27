import { Group, Text } from '@mantine/core'
import { FormattedMessage } from 'react-intl'
import { FooterBody } from 'src/shared/ui/appFooter/AppFooter.styles'

export const AppFooter = () => {
    return (
        <>
            <FooterBody>
                <Group grow>
                    <Group justify="end">
                        <Text c="dimmed">
                            <FormattedMessage id="footer.copyright" />
                        </Text>
                    </Group>
                </Group>
            </FooterBody>
        </>
    )
}

export default AppFooter
