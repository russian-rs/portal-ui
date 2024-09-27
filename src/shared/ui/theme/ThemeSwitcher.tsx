import {
    ActionIcon,
    Group,
    useComputedColorScheme,
    useMantineColorScheme,
} from "@mantine/core"
import { IconMoon, IconSun } from "@tabler/icons-react"

export const ThemeSwitcher = () => {
    const computedColorScheme = useComputedColorScheme("light")
    const { setColorScheme } = useMantineColorScheme({
        keepTransitions: true,
    })

    const switchColorScheme = () => {
        if (computedColorScheme === "light") {
            setColorScheme("dark")
        } else {
            setColorScheme("light")
        }
    }

    const getIcon = (currentTheme: "light" | "dark") => {
        if (currentTheme === "light") {
            return (
                <IconMoon
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                />
            )
        } else {
            return (
                <IconSun style={{ width: "70%", height: "70%" }} stroke={1.5} />
            )
        }
    }

    return (
        <>
            <ActionIcon
                variant="default"
                color="gray"
                size="lg"
                radius="md"
                aria-label="Switch color scheme"
                onClick={switchColorScheme}
            >
                {getIcon(computedColorScheme)}
            </ActionIcon>
        </>
    )
}
