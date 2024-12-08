import { Button, Flex, Text } from "@mantine/core"
import { IconChevronLeft, IconHome, IconLockAccess } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import { locales } from "./lib/locales"
import classes from "./UnauthorizedPage.module.scss"

export const UnauthorizedPage = () => {
    useSetDocumentTitleByLocale(locales.documentTitle)

    const navigate = useNavigate()

    return (
        <Flex className={classes.root}>
            <IconLockAccess className={classes.image} />
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Text className={classes.description}>
                <FormattedMessage id={locales.description} />
            </Text>
            <Flex columnGap="sm">
                <Button
                    variant="light"
                    color="cyan"
                    onClick={() => navigate(-1)}
                    leftSection={<IconChevronLeft size={16} />}
                >
                    <FormattedMessage id={locales.backButton} />
                </Button>
                <Button variant="light" onClick={() => navigate("/")} leftSection={<IconHome size={16} />}>
                    <FormattedMessage id={locales.homeButton} />
                </Button>
            </Flex>
        </Flex>
    )
}

export default UnauthorizedPage
