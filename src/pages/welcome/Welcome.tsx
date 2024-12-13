import { Button, Container, Flex, Group, Image, List, ScrollArea, Text, ThemeIcon, Title } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { locale } from "src/pages/welcome/lib/locale"
import image from "src/pages/welcome/resources/image.svg"
import { Dots } from "src/pages/welcome/ui/Dots"
import classes from "src/pages/welcome/Welcome.module.scss"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"

export const Welcome = () => {
    useSetDocumentTitleByLocale(locale.documentTitle)
    const navigate = useNavigate()

    return (
        <Flex className={classes.rootFlex}>
            <Dots className={classes.dots} style={{ left: 0, top: 0 }} />
            <Dots className={classes.dots} style={{ left: 0, top: 140 }} />
            <Dots className={classes.dots} style={{ left: 60, top: 140 }} />
            <Dots className={classes.dots} style={{ right: 0, top: 60 }} />
            <Dots className={classes.dots} style={{ right: 60, top: 240 }} />
            <Dots className={classes.dots} style={{ right: 20, top: 400 }} />
            <ScrollArea className={classes.contentFlex}>
                <Flex align="center">
                    <Container>
                        <Flex>
                            <Flex direction="column">
                                <Title className={classes.title}>
                                    <Flex className={classes.highlight}>
                                        <FormattedMessage id={locale.title} />
                                    </Flex>
                                </Title>
                                <Text c="dimmed" className={classes.description}>
                                    <FormattedMessage id={locale.subTitle} />
                                </Text>

                                <List
                                    spacing="sm"
                                    className={classes.list}
                                    icon={
                                        <ThemeIcon size={20} radius="xl">
                                            <IconCheck className={classes.iconCheck} stroke={1.5} />
                                        </ThemeIcon>
                                    }
                                >
                                    <List.Item>
                                        <b>
                                            <FormattedMessage id={locale.benefitName1} />
                                        </b>{" "}
                                        – <FormattedMessage id={locale.benefitDescription1} />
                                    </List.Item>
                                    <List.Item>
                                        <b>
                                            <FormattedMessage id={locale.benefitName2} />
                                        </b>{" "}
                                        – <FormattedMessage id={locale.benefitDescription2} />
                                    </List.Item>
                                    <List.Item>
                                        <b>
                                            <FormattedMessage id={locale.benefitName3} />
                                        </b>{" "}
                                        – <FormattedMessage id={locale.benefitDescription3} />
                                    </List.Item>
                                </List>

                                <Group className={classes.controlGroup}>
                                    <Button
                                        radius="xl"
                                        size="md"
                                        className={classes.control}
                                        onClick={() => navigate(`/login`)}
                                    >
                                        <FormattedMessage id={locale.buttonLogin} />
                                    </Button>
                                    <Button
                                        variant="default"
                                        radius="xl"
                                        size="md"
                                        className={classes.control}
                                        onClick={() => navigate("/application")}
                                    >
                                        <FormattedMessage id={locale.buttonApplication} />
                                    </Button>
                                </Group>
                            </Flex>
                            <Image src={image} className={classes.image} />
                        </Flex>
                    </Container>
                </Flex>
            </ScrollArea>
        </Flex>
    )
}

export default Welcome
