import { Button, Flex, Text } from "@mantine/core"
import { IconChevronLeft, IconHome } from "@tabler/icons-react"
import { useContext, useEffect } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { locales } from "src/pages/notFound/lib/locales"
import { Image404 } from "src/pages/notFound/resources/Image404"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import classes from "./NotFound.module.scss"

export const NotFound = () => {
    setDocumentTitleByLocale(locales.documentTitle)

    const navigate = useNavigate()
    const { user } = useContext(UserContext)

    useEffect(() => {
        navigate("/login")
    }, [user])

    return (
        <Flex className={classes.root}>
            <Image404 className={classes.image} />
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

export default NotFound
