import { Button, Card, Flex, Text } from "@mantine/core"
import { IconLifebuoy } from "@tabler/icons-react"
import React, { useContext, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import TicketModal from "src/shared/ui/ticketModal/TicketModal"
import classes from "./SupportPage.module.scss"
import { locales } from "./lib/locales"

export const SupportPage: React.FC = () => {
    const { user } = useContext(UserContext)
    const [ticketDrawerOpen, setTicketDrawerOpen] = useState(false)

    setDocumentTitleByLocale(locales.title)

    if (!user) {
        return null
    }

    return (
        <Flex className={classes.root} direction="column" gap="lg">
            <Card withBorder shadow="sm" className={classes.card}>
                <Flex direction="column" gap="sm">
                    <Text size="xl" fw={700}>
                        <FormattedMessage id={locales.heading} />
                    </Text>
                    <Text c="dimmed">
                        <FormattedMessage id={locales.description} />
                    </Text>
                    <Flex>
                        <Button leftSection={<IconLifebuoy size={16} />} onClick={() => setTicketDrawerOpen(true)}>
                            <FormattedMessage id={locales.button} />
                        </Button>
                    </Flex>
                </Flex>
            </Card>

            <TicketModal
                opened={ticketDrawerOpen}
                close={() => setTicketDrawerOpen(false)}
                fromUser={user ?? undefined}
            />
        </Flex>
    )
}

export default SupportPage
