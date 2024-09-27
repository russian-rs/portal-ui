import { Group, Image } from '@mantine/core'
import { ThemeSwitcher } from 'src/shared/ui/theme/ThemeSwitcher'
import { LocaleSwitcher } from 'src/shared/ui/locale/LocaleSwitcher'
import image from '/resources/pv_logo_light.png'
import classes from './AppHeader.module.css'

export const AppHeader = () => {
    return (
        <>
            <Group grow className={classes.rootGroup}>
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

export default AppHeader
