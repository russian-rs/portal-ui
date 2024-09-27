import { Group, Image } from '@mantine/core'
import { ThemeSwitcher } from 'src/shared/ui/theme/ThemeSwitcher'
import { LocaleSwitcher } from 'src/shared/ui/locale/LocaleSwitcher'
import { StyledGroup } from './GlobalHeader.styles'
import image from '/resources/pv_logo_light.png'

export const GlobalHeader = () => {
    return (
        <>
            <Group grow component={StyledGroup}>
                <Group>
                    <Image src={image} height={32} />
                </Group>
                <Group justify="flex-end">
                    <LocaleSwitcher />
                    <ThemeSwitcher />
                </Group>
            </Group>
        </>
    )
}

export default GlobalHeader
