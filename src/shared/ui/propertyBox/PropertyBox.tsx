import { Anchor, Flex, Text } from "@mantine/core"
import { ReactElement, ReactNode } from "react"
import { FormattedMessage } from "react-intl"

export const PropertyBox = ({
    name,
    value,
    icon,
    href,
    justify,
    className,
}: {
    name: string
    value?: ReactNode
    icon?: ReactElement
    href?: string
    justify?: string
    className?: string
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
                            <Text truncate="end" style={{ maxWidth: "100%" }}>
                                {value}
                            </Text>
                        </Anchor>
                    ) : (
                        <Text>{value}</Text>
                    )}
                </Flex>
            ) : (
                <Text mt={4} ms={justify === "flex-end" ? "auto" : ""}>
                    {value}
                </Text>
            )}
        </Flex>
    )
}
