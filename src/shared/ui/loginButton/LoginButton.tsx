import { Button, Flex } from "@mantine/core"
import { IconLogin2 } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import classes from "./LoginButton.module.scss"

export const LoginButton = () => {
    const history = useHistory()

    return (
        <>
            <Button
                variant="light"
                color="blue"
                radius={0}
                rightSection={<IconLogin2 size={18} />}
                onClick={() => history.push("/profile")}
            >
                <Flex className={classes.text}>
                    <FormattedMessage id="common.buttons.login" />
                </Flex>
            </Button>
        </>
    )
}
