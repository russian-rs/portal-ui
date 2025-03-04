import { Flex, RingProgress, Text } from "@mantine/core"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import parse from "html-react-parser"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { defaultApplicationStatus } from "src/pages/application/view/lib/defaults"
import { locales } from "src/pages/application/view/lib/locales"
import { PublicApplicationApiService } from "src/shared/api/applications/PublicApplicationApiService"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import classes from "./ViewStatus.module.scss"

export const ViewStatus = () => {
    const { id } = useParams()
    const intl = useIntl()
    const navigate = useNavigate()

    if (!id) {
        navigate("/not-found", { replace: true })
    }

    const { data: application, isFetching } = useQuery({
        queryKey: ["getApplication", id],
        initialData: defaultApplicationStatus,
        queryFn: () =>
            PublicApplicationApiService.getApplicationStatus(id!!)
                .then((response) => {
                    return response.data
                })
                .catch(() => {
                    navigate("/not-found", { replace: true })
                    return defaultApplicationStatus
                }),
    })

    if (isFetching) {
        return (
            <Flex className={classes.root} align="center" justify="center">
                <LoadingScreen />
            </Flex>
        )
    }

    return (
        <Flex className={classes.root} align="center" justify="center">
            <Text className={classes.title} variant="gradient">
                <FormattedMessage id={locales.title} />
            </Text>
            <Flex columnGap="xl" rowGap="lg" wrap="wrap" align="center" justify="center">
                <Flex direction="column" justify="center" align="center">
                    <RingProgress sections={[{ value: application.progress, color: "blue" }]} />
                    <Text ta="center">{application.progress} %</Text>
                </Flex>
                <Flex direction="column" rowGap="md" justify="center" align="center">
                    <Flex align="center" columnGap="md">
                        {intl.formatMessage(
                            { id: locales.lastStatus },
                            { status: intl.formatMessage({ id: `common.application-status.${application.status}` }) }
                        )}
                    </Flex>
                    {application.status === "DENY" && (
                        <Flex align="center" columnGap="md">
                            <FormattedMessage id={locales.refuseReason} values={{ reason: application.refuseReason }} />
                        </Flex>
                    )}
                    <Flex align="center" columnGap="md">
                        <FormattedMessage
                            id={locales.lastUpdate}
                            values={{ date: dayjs(application.lastUpdate).format("DD MMMM YYYY") }}
                        />
                    </Flex>
                </Flex>
            </Flex>
            <Text c="dimmed" ta="center">
                {parse(
                    intl.formatMessage({ id: locales.link }, { link: `https://portal.russian.rs/application/${id}` })
                )}
            </Text>
            <Text c="dimmed" ta="center">
                {parse(intl.formatMessage({ id: locales.questions }))}
            </Text>
        </Flex>
    )
}

export default ViewStatus
