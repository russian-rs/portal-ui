import { useMediaQuery } from "@mantine/hooks"

export const useDesktop = () => {
    const isDesktop = useMediaQuery("(min-width: 36em)", true, {
        getInitialValueInEffect: false,
    })

    return isDesktop === undefined ? true : isDesktop
}
