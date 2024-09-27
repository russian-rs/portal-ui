import {
    Image,
    Container,
    Title,
    Button,
    Group,
    Text,
    List,
    ThemeIcon,
    Flex,
} from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { useHistory } from "react-router-dom"
import { Dots } from "src/pages/welcome/ui/Dots"
import image from "../resources/image.svg"
import classes from "./Welcome.module.css"
import { FormattedMessage } from "react-intl"
import { locale } from "src/pages/welcome/lib/locale"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"

export const Welcome = () => {
    useSetDocumentTitleByLocale(locale.documentTitle)
    const history = useHistory()

    return (
        <Flex align="center" className={classes.rootFlex}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
            <Dots className={classes.dots} style={{ right: 60, top: 240 }} />
            <Dots className={classes.dots} style={{ right: 20, top: 400 }} />
            <Container>
                <Flex>
                    <Flex direction="column">
                        <Title className={classes.title}>
                            <span className={classes.highlight}>
                                <FormattedMessage id={locale.title} />
                            </span>
                        </Title>
                        <Text c="dimmed" className={classes.description}>
                            <FormattedMessage id={locale.subTitle} />
                        </Text>

                        <List
                            spacing="sm"
                            className={classes.list}
                            icon={
                                <ThemeIcon size={20} radius="xl">
                                    <IconCheck
                                        className={classes.iconCheck}
                                        stroke={1.5}
                                    />
                                </ThemeIcon>
                            }
                        >
                            <List.Item>
                                <b>
                                    <FormattedMessage
                                        id={locale.benefitName1}
                                    />
                                </b>{" "}
                                –{" "}
                                <FormattedMessage
                                    id={locale.benefitDescription1}
                                />
                            </List.Item>
                            <List.Item>
                                <b>
                                    <FormattedMessage
                                        id={locale.benefitName2}
                                    />
                                </b>{" "}
                                –{" "}
                                <FormattedMessage
                                    id={locale.benefitDescription2}
                                />
                            </List.Item>
                            <List.Item>
                                <b>
                                    <FormattedMessage
                                        id={locale.benefitName3}
                                    />
                                </b>{" "}
                                –{" "}
                                <FormattedMessage
                                    id={locale.benefitDescription3}
                                />
                            </List.Item>
                        </List>

                        <Group className={classes.controlGroup}>
                            <Button
                                radius="xl"
                                size="md"
                                className={classes.control}
                                onClick={() => history.push("/profile")}
                            >
                                <FormattedMessage id={locale.buttonLogin} />
                            </Button>
                            <Button
                                variant="default"
                                radius="xl"
                                size="md"
                                className={classes.control}
                                onClick={() => history.push("/not-found")}
                            >
                                <FormattedMessage
                                    id={locale.buttonApplication}
                                />
                            </Button>
                        </Group>
                    </Flex>
                    <Image src={image} className={classes.image} />
                </Flex>
            </Container>
        </Flex>
    )
}
