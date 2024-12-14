import { Flex } from "@mantine/core"
import { Terms } from "src/pages/application/terms/Terms"
import classes from "./Application.module.scss"

export const Application = () => {
    return (
        <Flex className={classes.root}>
            <Terms onAccepted={() => {}} />
        </Flex>
    )
}

export default Application
