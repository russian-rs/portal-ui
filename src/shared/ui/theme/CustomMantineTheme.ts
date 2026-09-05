import { Button, createTheme, DEFAULT_THEME, Input, MantineColor, Modal, Paper } from "@mantine/core"

export const theme = createTheme({
    fontFamily: "Geologica, sans-serif",
    luminanceThreshold: 0.3,
    autoContrast: true,
    focusRing: "auto",
    defaultRadius: "md",
    primaryColor: "ocean",
    defaultGradient: { from: "ocean.7", to: "cyan.7", deg: 110 },
    primaryShade: { light: 7, dark: 4 },
    colors: {
        ocean: [
            "#e9f8f4",
            "#d1eee6",
            "#a3ded0",
            "#75cdbb",
            "#4fbba5",
            "#34a995",
            "#219380",
            "#147e71",
            "#14645d",
            "#14534e",
        ],
        dark: [
            "#e2eeee",
            "#b6cbce",
            "#91aab0",
            "#68858e",
            "#405d66",
            "#2e4852",
            "#233c45",
            "#1a3039",
            "#152831",
            "#101f25",
        ],
    },
    radius: { xs: "6px", sm: "10px", md: "12px", lg: "18px", xl: "26px" },
    headings: { fontFamily: "Geologica, sans-serif", fontWeight: "650" },
    components: {
        Button: Button.extend({ defaultProps: { radius: "md" } }),
        Input: Input.extend({ defaultProps: { size: "md" } }),
        Paper: Paper.extend({ defaultProps: { radius: "lg" } }),
        Modal: Modal.extend({ defaultProps: { radius: "xl", overlayProps: { backgroundOpacity: 0.35, blur: 5 } } }),
    },
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
