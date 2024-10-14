import { Anchor, Center, Group, Text } from "@mantine/core"
import { IconBrandTelegram, IconWorld } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import classes from "src/shared/ui/appFooter/AppFooter.module.scss"
import { FooterContainer } from "src/shared/ui/appFooter/AppFooter.styles"

export const AppFooter = () => {
    return (
        <>
            <FooterContainer className={classes.footerContainer}>
                <Group grow>
                    <Group className={classes.footerContent}>
                        <Text c="dimmed" size="sm">
                            <FormattedMessage id="footer.copyright" />
                        </Text>
                        <Anchor href="https://russian.rs" target="_blank">
                            <Center>
                                <IconWorld size={16} />
                            </Center>
                        </Anchor>
                        <Anchor
                            href="https://t.me/relocateserbia"
                            target="_blank"
                        >
                            <Center>
                                <IconBrandTelegram size={16} />
                            </Center>
                        </Anchor>
                    </Group>
                </Group>
            </FooterContainer>
        </>
    )
}

export default AppFooter
