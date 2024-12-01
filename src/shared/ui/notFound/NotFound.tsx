import { Button, Flex, Text } from "@mantine/core"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { locales } from "src/shared/ui/notFound/lib/locales"
import classes from "src/shared/ui/notFound/NotFound.module.scss"
import { Image404 } from "src/shared/ui/notFound/resources/Image404"

export const NotFound = () => {
    useSetDocumentTitleByLocale(locales.documentTitle)

    const history = useHistory()

    return (
        <Flex className={classes.root}>
            <Image404 className={classes.image} />
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Text className={classes.description}>
                <FormattedMessage id={locales.description} />
            </Text>
            <Button variant="outline" onClick={() => history.push("/")}>
                <FormattedMessage id={locales.homeButton} />
            </Button>
        </Flex>
    )
}

export default NotFound
