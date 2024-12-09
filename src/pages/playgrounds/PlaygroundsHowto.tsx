import { Flex, Text, Timeline } from "@mantine/core"
import { IconCircleNumber1, IconCircleNumber2, IconCircleNumber3, IconConfetti } from "@tabler/icons-react"
import parse from "html-react-parser"
import { useContext } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { locales } from "src/pages/playgrounds/lib/locales"
import { hasAccess } from "src/pages/playgrounds/lib/roles"
import classes from "src/pages/playgrounds/PlaygroundsHowto.module.scss"

export const PlaygroundsHowto = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()

    if (!hasAccess(user)) {
        navigate("/unauthorized")
    }

    return (
        <Flex className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Text className={classes.description}>
                <FormattedMessage id={locales.description} />
            </Text>
            <Text className={classes.requirements}>
                <FormattedMessage id={locales.requirements} />
            </Text>
            <Text className={classes.whatsNew}>
                <FormattedMessage id={locales.whatsNew} />
            </Text>
            <Timeline bulletSize={32} lineWidth={4} active={3}>
                <Timeline.Item bullet={<IconCircleNumber1 />} title={<FormattedMessage id={locales.step1Title} />}>
                    <Flex columnGap={4}>
                        <Text c="dimmed" size="sm">
                            {parse(intl.formatMessage({ id: locales.step1Link }))}
                        </Text>
                    </Flex>
                </Timeline.Item>

                <Timeline.Item bullet={<IconCircleNumber2 />} title={<FormattedMessage id={locales.step2Title} />}>
                    <Text c="dimmed">
                        <FormattedMessage id={locales.step2Description} />
                    </Text>
                    <Text c="dimmed" size="sm">
                        {parse(intl.formatMessage({ id: locales.step2Link }))}
                    </Text>
                    <Text c="dimmed" size="sm">
                        {parse(intl.formatMessage({ id: locales.step2Hint }))}
                    </Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconCircleNumber3 />} title={<FormattedMessage id={locales.step3Title} />}>
                    <Text c="dimmed">
                        <FormattedMessage id={locales.step3Description} />
                    </Text>
                    <Text c="dimmed" size="sm">
                        {parse(intl.formatMessage({ id: locales.step3Fields }))}
                    </Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconConfetti />} title={<FormattedMessage id={locales.step4Title} />}>
                    <Text c="dimmed" size="sm">
                        {parse(intl.formatMessage({ id: locales.step4Hint }))}
                    </Text>
                </Timeline.Item>
            </Timeline>
        </Flex>
    )
}

export default PlaygroundsHowto
