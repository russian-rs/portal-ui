import { Flex, Text } from "@mantine/core"
import { FormattedMessage } from "react-intl"
import { locales } from "src/pages/application/existing/lib/locales"
import classes from "./Existing.module.scss"

export const Existing = () => {
    return (
        <Flex className={classes.root} align="center" justify="center">
            <Text className={classes.title} variant="gradient">
                <FormattedMessage id={locales.title} />
            </Text>
            <Text ta="center">
                <FormattedMessage id={locales.description} />
            </Text>
        </Flex>
    )
}

export default Existing
