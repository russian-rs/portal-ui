import { Group, Text } from '@mantine/core'
import { FormattedMessage } from 'react-intl'
import classes from './Footer.module.css'
import { StyledGroup } from 'src/shared/ui/footer/Footer.styles'

export const Footer = () => {
    return (
        <>
            <Group grow component={StyledGroup}>
                <Group justify="end" className={classes.copyright}>
                    <Text c="dimmed">
                        <FormattedMessage id="footer.copyright" />
                    </Text>
                </Group>
            </Group>
        </>
    )
}

export default Footer
