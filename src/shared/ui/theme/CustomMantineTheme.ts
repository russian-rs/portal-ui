import { createTheme, DEFAULT_THEME, MantineColor } from "@mantine/core"

export const theme = createTheme({
    fontFamily: "Geologica, sans-serif",
    luminanceThreshold: 0.5,
    focusRing: "never",
    defaultRadius: "md",
})

export const getMantineColor = (input: string | undefined | null): MantineColor => {
    if (!input) {
        return "dark"
    }
    // Generate a numeric hash from the string
    const hash = input.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Get all color keys from MantineThemeColors
    const colorKeys = Object.keys(DEFAULT_THEME.colors) as MantineColor[]

    // Map the hash to a color key
    const colorIndex = hash % colorKeys.length

    return colorKeys[colorIndex]
}
