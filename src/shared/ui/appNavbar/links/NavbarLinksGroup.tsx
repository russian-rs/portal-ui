import { Anchor, Box, Collapse, Group, rem, ThemeIcon, UnstyledButton } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import React, { useContext, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import { ItemGroupProps } from "src/shared/ui/appNavbar/AppNavbar"
import classes from "src/shared/ui/appNavbar/links/NavbarLinksGroup.module.scss"
import { hasPermission } from "src/shared/user/roles"
import { Link } from "react-router"

export function LinksGroup({ icon: Icon, label, initiallyOpened, items, link, roles }: ItemGroupProps) {
    const hasChildren = Array.isArray(items)
    const { user } = useContext(UserContext)
    const [opened, setOpened] = useState(initiallyOpened || false)

    const children = (hasChildren ? items : [])
        ?.filter((item) => hasPermission(user, item.roles, item.hideFrom))
        .map((item) => {
            const isExternal = item.link?.startsWith("http://") || item.link?.startsWith("https://")
            return isExternal ? (
                <Anchor className={classes.link} href={item.link} key={item.label}>
                    <FormattedMessage id={item.label} />
                </Anchor>
            ) : (
                <Anchor component={Link} className={classes.link} to={item.link} key={item.label}>
                    <FormattedMessage id={item.label} />
                </Anchor>
            )
        })

    return (
        <>
            <UnstyledButton
                onClick={() => setOpened((o) => !o)}
                className={classes.control}
                component={link ? "a" : "button"}
                href={link ? link : ""}
                target={link?.startsWith("http") ? "_blank" : undefined}
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
