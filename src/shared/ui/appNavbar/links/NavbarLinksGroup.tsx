import {
    Box,
    Collapse,
    Group,
    rem,
    Text,
    ThemeIcon,
    UnstyledButton,
} from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import React, { useState } from "react"
import { FormattedMessage } from "react-intl"
import classes from "src/shared/ui/appNavbar/links/NavbarLinksGroup.module.scss"

interface LinksGroupProps {
    icon: React.FC<any>
    label: string
    initiallyOpened?: boolean
    links?: { label: string; link: string }[]
    link?: string
}

export function LinksGroup({
    icon: Icon,
    label,
    initiallyOpened,
    links,
    link,
}: LinksGroupProps) {
    const hasLinks = Array.isArray(links)
    const [opened, setOpened] = useState(initiallyOpened || false)

    const items = (hasLinks ? links : []).map((link) => (
        <Text<"a">
            component="a"
            className={classes.link}
            href={link.link}
            key={link.label}
        >
            <FormattedMessage id={link.label} />
        </Text>
    ))

    return (
        <>
            <UnstyledButton
                onClick={() => setOpened((o) => !o)}
                className={classes.control}
                component={link ? "a" : "button"}
                href={link ? link : ""}
                target="_blank"
            >
                <Group justify="space-between" gap={0}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <ThemeIcon variant="light" size={30}>
                            <Icon style={{ width: rem(18), height: rem(18) }} />
                        </ThemeIcon>
                        <Box ml="md">
                            <FormattedMessage id={label} />
                        </Box>
                    </Box>
                    {hasLinks && (
                        <IconChevronRight
                            className={classes.chevron}
                            style={{
                                transform: opened ? "rotate(-90deg)" : "none",
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    )
}
