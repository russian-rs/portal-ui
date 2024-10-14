import { Box, Group, ThemeIcon, UnstyledButton } from "@mantine/core"
import { IconLogout } from "@tabler/icons-react"
import React from "react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import classes from "./LogoutButton.module.scss"

export const LogoutButton = () => {
    const history = useHistory()

    return (
        <>
            <UnstyledButton
                className={classes.container}
                onClick={() => history.push("/logout")}
            >
                <Group justify="space-between">
                    <Box className={classes.button}>
                        <ThemeIcon
                            variant="light"
                            size="lg"
                            color="red"
                            radius={0}
                        >
                            <IconLogout width={18} height={18} />
                        </ThemeIcon>
                        <Box ml="md">
                            <FormattedMessage id="common.buttons.logout" />
                        </Box>
                    </Box>
                </Group>
            </UnstyledButton>
        </>
    )
}
