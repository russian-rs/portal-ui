import { Flex, Text } from "@mantine/core"
import { StyleProp } from "@mantine/core/lib/core"
import React, { ReactNode } from "react"
import { FormattedMessage } from "react-intl"

export const PropertyBox = ({
    name,
    value,
    align,
    className,
}: {
    name: string
    value?: ReactNode
    align?: StyleProp<React.CSSProperties["alignItems"]>
    className?: string
}) => {
    if (!value) {
        return <Flex />
    }
    return (
        <Flex direction="column" className={className} align={align}>
            <Text c="dimmed" size="xs" ms={align === "flex-end" ? "auto" : ""}>
                <FormattedMessage id={name} />
            </Text>
            <Flex mt={4} gap="xs" align={align}>
                {value}
            </Flex>
        </Flex>
    )
}
