import { useMantineColorScheme } from "@mantine/core"
import { useEffect } from "react"
import Turnstile from "react-turnstile"

interface CaptchaSolverProps {
    onSuccess: (token: string) => void
    onError: () => void
    className?: string
}

const CAPTCHA_DISABLED = true

export const CaptchaSolver = (props: CaptchaSolverProps) => {
    const { colorScheme } = useMantineColorScheme()

    useEffect(() => {
        if (CAPTCHA_DISABLED) {
            props.onSuccess("disabled")
        }
    }, [])

    if (CAPTCHA_DISABLED) {
        return null
    }

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
