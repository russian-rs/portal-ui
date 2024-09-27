import { Group, Text } from '@mantine/core'
import { FormattedMessage } from 'react-intl'
import { FooterContainer } from 'src/shared/ui/appFooter/AppFooter.styles'
import classes from './AppFooter.module.css'

export const AppFooter = () => {
    return (
        <>
            <FooterContainer className={classes.footerContainer}>
                <Group grow>
                    <Group justify="end">
                        <Text c="dimmed">
                            <FormattedMessage id="footer.copyright" />
                        </Text>
                    </Group>
                </Group>
            </FooterContainer>
        </>
    )
}

export default AppFooter
