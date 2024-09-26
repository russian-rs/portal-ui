import { Group } from '@mantine/core'
import { ThemeSwitcher } from 'src/shared/ui/theme/ThemeSwitcher'
import { StyledGroup } from 'src/shared/ui/footer/Footer.styles'
import { LocaleSwitcher } from 'src/shared/ui/locale/LocaleSwitcher'

export const Footer = () => {
    return (
        <>
            <Group component={StyledGroup}>
                <ThemeSwitcher />
                <LocaleSwitcher />
            </Group>
        </>
    )
}

export default Footer
