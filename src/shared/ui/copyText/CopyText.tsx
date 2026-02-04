import { MantineSize, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconClipboardCheck } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"
import classes from "./CopyText.module.scss"
import { locales } from "./lib/locales"

interface CopyTextProps {
    text: string | null | undefined
    size?: MantineSize
    className?: string
    style?: React.CSSProperties
}

export const CopyText = (props: CopyTextProps) => {
    if (!props.text) {
        return <div></div>
    }

    const handleCopy = async () => {
        await navigator.clipboard.writeText(props.text!!)
        notifications.show(
            SuccessNotification(
                <Text size="sm">
                    <FormattedMessage id={locales.notification} />
                </Text>,
                null,
                <IconClipboardCheck />
            )
        )
    }

    return (
        <TooltipLocalized text={locales.tooltip} position="bottom">
            <Text
                component="span"
                className={`${props.className} ${classes.copyable}`}
                style={props.style}
                size={props.size}
                onClick={handleCopy}
            >
                {props.text}
            </Text>
        </TooltipLocalized>
    )
}
