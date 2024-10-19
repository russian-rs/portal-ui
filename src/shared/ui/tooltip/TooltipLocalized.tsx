import { Tooltip } from "@mantine/core"
import { FloatingPosition } from "@mantine/core/lib/components/Floating"
import { ReactNode } from "react"
import { FormattedMessage } from "react-intl"

export const TooltipLocalized = ({
    text,
    position,
    children,
}: {
    text: string
    position?: FloatingPosition
    children: ReactNode
}) => {
    return (
        <Tooltip label={<FormattedMessage id={text} />} position={position}>
            {children}
        </Tooltip>
    )
}
