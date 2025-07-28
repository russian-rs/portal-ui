import { Anchor, Flex, Text } from "@mantine/core"
import { ReactElement, ReactNode } from "react"
import { FormattedMessage } from "react-intl"

export const TextPropertyBox = ({
    name,
    value,
    icon,
    href,
    justify,
    className,
    valueColor,
}: {
    name: string
    value?: ReactNode
    icon?: ReactElement
    href?: string
    justify?: string
    className?: string
    valueColor?: string
}) => {
    if (!value) {
        return <Flex />
    }
    return (
        <Flex direction="column" className={className}>
            <Text c="dimmed" size="xs" ms={justify === "flex-end" ? "auto" : ""}>
                <FormattedMessage id={name} />
            </Text>
            {icon ? (
                <Flex align="center" mt={4} gap="xs" justify={justify}>
                    {icon}
                    {href ? (
                        <Anchor href={href} target="_blank" style={{ maxWidth: "90%" }}>
                            <Text truncate="end" style={{ maxWidth: "100%" }} size="sm" c={valueColor}>
                                {value}
                            </Text>
                        </Anchor>
                    ) : (
                        <Text size="sm" c={valueColor}>{value}</Text>
                    )}
                </Flex>
            ) : (
                <Text mt={4} ms={justify === "flex-end" ? "auto" : ""} size="sm" c={valueColor}>
                    {value}
                </Text>
            )}
        </Flex>
    )
}
