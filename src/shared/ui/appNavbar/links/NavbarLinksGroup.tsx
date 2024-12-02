import { Box, Collapse, Group, rem, Text, ThemeIcon, UnstyledButton } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import React, { useContext, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import { ItemGroupProps } from "src/shared/ui/appNavbar/AppNavbar"
import classes from "src/shared/ui/appNavbar/links/NavbarLinksGroup.module.scss"

export function LinksGroup({ icon: Icon, label, initiallyOpened, items, link, roles }: ItemGroupProps) {
    const hasChildren = Array.isArray(items)
    const { user } = useContext(UserContext)
    const [opened, setOpened] = useState(initiallyOpened || false)

    const children = (hasChildren ? items : [])
        ?.filter((item) => {
            if (item.roles) {
                if (user) {
                    const groups = user.groups
                    return groups.some((group) => item.roles?.includes(group))
                } else {
                    return item.roles.length == 0
                }
            } else {
                return true
            }
        })
        .map((item) => (
            <Text<"a"> component="a" className={classes.link} href={item.link} key={item.label}>
                <FormattedMessage id={item.label} />
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
                    {hasChildren && (
                        <IconChevronRight
                            className={classes.chevron}
                            style={{
                                transform: opened ? "rotate(-90deg)" : "none",
                            }}
                        />
                    )}
                </Group>
            </UnstyledButton>
            {hasChildren ? <Collapse in={opened}>{children}</Collapse> : null}
        </>
    )
}
