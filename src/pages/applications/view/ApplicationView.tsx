import { Blockquote, Divider, Flex, Text } from "@mantine/core"
import {
    IconArrowRight,
    IconAt,
    IconBrandTelegram,
    IconBriefcase,
    IconBriefcaseOff,
    IconCake,
    IconClock,
    IconEPassport,
    IconLanguageHiragana,
    IconLocation,
    IconPhone,
    IconWorld,
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { FormattedMessage } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { defaultApplicationDto } from "src/pages/applications/view/lib/defaults"
import { PrivateApplicationApiService } from "src/shared/api/PrivateApplicationApiService"
import { setDocumentTitleByString } from "src/shared/hooks/useDocumentTitle"
import { CopyText } from "src/shared/ui/copyText/CopyText"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { ApplicationStatusSelect } from "src/shared/ui/select/ApplicationStatusSelect"
import classes from "./ApplicationView.module.scss"
import { locales } from "./lib/locales"

export const ApplicationView = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    if (!id) {
        navigate("/not-found", { replace: true })
    }

    const { data: application, isFetching } = useQuery({
        queryKey: ["getApplication", id],
        initialData: defaultApplicationDto,
        queryFn: () =>
            PrivateApplicationApiService.getApplication(id!!).then((response) => {
                return response.data
            }),
    })

    if (isFetching) {
        return (
            <Flex className={classes.root} align="center" justify="center">
                <LoadingScreen />
            </Flex>
        )
    }

    setDocumentTitleByString(application.name)

    const onStatusChange = (status: string) => {
        PrivateApplicationApiService.updateApplication({ ...application, status: status })
    }

    return (
        <Flex className={classes.root}>
            <Flex align="center" columnGap="lg">
                <Text className={classes.title}>
                    <FormattedMessage id={locales.title} />
                </Text>
                <ApplicationStatusSelect
                    initialStatus={application.status}
                    className={classes.statusSelect}
                    onChange={onStatusChange}
                />
            </Flex>
            <Flex columnGap="sm">
                <Text className={classes.name} variant="gradient">
                    {application.name}
                </Text>
                {application.patronymic && (
                    <Text className={classes.name} variant="gradient">
                        ( {application.patronymic} )
                    </Text>
                )}
            </Flex>
            <Flex columnGap="xl">
                <PropertyBox
                    name={locales.createdAt}
                    value={dayjs(application.created).format("DD MMMM YYYY, HH:mm")}
                    icon={<IconClock size={14} />}
                />
                <PropertyBox
                    name={locales.type}
                    value={<FormattedMessage id={`common.application-type.${application.type}`} />}
                />
            </Flex>
            <Flex className={classes.fields}>
                {application.email && (
                    <PropertyBox
                        name={locales.email}
                        value={<CopyText text={application.email} />}
                        icon={<IconAt size={14} />}
                    />
                )}
                {application.phone && (
                    <PropertyBox
                        name={locales.phone}
                        value={<CopyText text={application.phone} />}
                        icon={<IconPhone size={14} />}
                    />
                )}
                {application.telegram && (
                    <PropertyBox
                        name={locales.telegram}
                        value={application.telegram}
                        href={`https://t.me/${application.telegram}`}
                        icon={<IconBrandTelegram size={14} />}
                    />
                )}
                {application.birthDate && (
                    <PropertyBox
                        name={locales.birthDate}
                        value={dayjs(application.birthDate).format("DD MMM YYYY")}
                        icon={<IconCake size={14} />}
                    />
                )}
                {application.passport && (
                    <PropertyBox
                        name={locales.passport}
                        value={<CopyText text={application.passport} />}
                        icon={<IconEPassport size={14} />}
                    />
                )}
                {application.citizenship && (
                    <PropertyBox
                        name={locales.citizenship}
                        value={application.citizenship}
                        icon={<IconWorld size={14} />}
                    />
                )}
            </Flex>
            <Divider />
            <Flex columnGap={4}>
                {application.inSerbia ? (
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.inSerbia} />
                    </Text>
                ) : (
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.outSerbia} />
                    </Text>
                )}
                {application.residenceRequired ? (
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.residenceRequired} />
                    </Text>
                ) : (
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.residenceNotRequired} />
                    </Text>
                )}
            </Flex>
            {application.inSerbia && (
                <Flex className={classes.fields}>
                    {application.enterDate && (
                        <PropertyBox
                            name={locales.enterDate}
                            value={dayjs(application.enterDate).format("DD MMM YYYY")}
                            icon={<IconArrowRight size={14} />}
                        />
                    )}
                    {application.address && (
                        <PropertyBox
                            name={locales.address}
                            value={<CopyText text={application.address} />}
                            icon={<IconLocation size={14} />}
                        />
                    )}
                </Flex>
            )}
            <Divider />
            <Flex direction="column" rowGap="md">
                {application.occupation && <PropertyBox name={locales.occupation} value={application.occupation} />}
            </Flex>
            {application.hasExperience && (
                <PropertyBox
                    name={locales.experience}
                    value={application.experience}
                    icon={<IconBriefcase size={14} />}
                />
            )}
            {!application.hasExperience && (
                <Flex columnGap="sm" align="center">
                    <IconBriefcaseOff size={16} color="gray" />
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.noExperience} />
                    </Text>
                </Flex>
            )}
            {application.languages && (
                <PropertyBox
                    name={locales.languages}
                    value={application.languages}
                    icon={<IconLanguageHiragana size={16} />}
                />
            )}
            {application.skills && (
                <PropertyBox
                    name={locales.skills}
                    value={<Text className={classes.textCard}>{application.skills}</Text>}
                />
            )}
            {application.goal && (
                <PropertyBox
                    name={locales.goal}
                    value={<Blockquote className={classes.textCard}>{application.goal}</Blockquote>}
                />
            )}
            {application.bio && (
                <PropertyBox
                    name={locales.bio}
                    value={<Blockquote className={classes.textCard}>{application.bio}</Blockquote>}
                />
            )}
        </Flex>
    )
}

export default ApplicationView
