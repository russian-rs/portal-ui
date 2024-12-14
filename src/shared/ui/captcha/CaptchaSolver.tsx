import { useMantineColorScheme } from "@mantine/core"
import Turnstile from "react-turnstile"

interface CaptchaSolverProps {
    onSuccess: (token: string) => void
    onError: () => void
    className?: string
}

export const CaptchaSolver = (props: CaptchaSolverProps) => {
    const { colorScheme } = useMantineColorScheme()
    return (
        <Turnstile
            sitekey="0x4AAAAAAA2M-IgmNKwHscBl"
            theme={colorScheme}
            className={props.className}
            size="flexible"
            onSuccess={(token) => {
                props.onSuccess(token)
            }}
            onError={() => {
                props.onError()
            }}
            onExpire={() => {
                props.onError()
            }}
        />
    )
}
