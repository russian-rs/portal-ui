import { Blockquote, Button, Divider, Flex, Text } from "@mantine/core"
import { ApplicationDto, ContractDto } from "@russian-rs/portal-api-axios"
import {
    IconArrowRight,
    IconAt,
    IconBrandTelegram,
    IconBriefcaseOff,
    IconCake,
    IconClock,
    IconContract,
    IconEPassport,
    IconLanguageHiragana,
    IconLocation,
    IconPhone,
    IconWorld,
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useNavigate, useParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { ContractDate } from "src/pages/applications/contract/ContractDate"
import { defaultApplicationDto } from "src/pages/applications/view/lib/defaults"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import generateContractPdf from "src/shared/docs/contract"
import { setDocumentTitleByString } from "src/shared/hooks/useDocumentTitle"
import { CopyText } from "src/shared/ui/copyText/CopyText"
import { LoadingScreen } from "src/shared/ui/loading/LoadingScreen"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { ApplicationStatusSelect } from "src/shared/ui/select/ApplicationStatusSelect"
import { hasPermission } from "src/shared/user/roles"
import classes from "./ApplicationView.module.scss"
import { locales } from "./lib/locales"
import { allowedRoles } from "./lib/roles"

export const ApplicationView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    const intl = useIntl()

    if (!id) {
        navigate("/not-found", { replace: true })
    }

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    const [application, setApplication] = useState<ApplicationDto>(defaultApplicationDto)
    setDocumentTitleByString(application.name)

    const { isFetching: isLoading } = useQuery({
        queryKey: ["getApplication", id],
        queryFn: () =>
            PrivateApplicationApiService.getApplication(id!!).then((response) => {
                setApplication(response.data)
                return response.data
            }),
    })

    useQuery({
        enabled: application !== defaultApplicationDto,
        queryKey: ["updateApplication", application],
        queryFn: () =>
            PrivateApplicationApiService.updateApplication(application).then((response) => {
                return response.data
            }),
    })

    if (isLoading) {
        return (
            <Flex className={classes.root} align="center" justify="center">
                <LoadingScreen />
            </Flex>
        )
    }

    const onStatusChange = (status: string) => {
        setApplication({ ...application, status: status })
    }

    const onContractChanged = (contract: ContractDto) => {
        setApplication({ ...application, contract: contract })
    }

    return (
        <Flex className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Flex className={classes.wrapContainer}>
                <Flex direction="column" gap="md" className={classes.info}>
                    <Text className={classes.name} variant="gradient">
                        {application.name + (application.patronymic ? ` (${application.patronymic})` : "")}
                    </Text>
                    <Flex columnGap="xl">
                        <TextPropertyBox
                            name={locales.createdAt}
                            value={dayjs(application.created).format("DD MMMM YYYY, HH:mm")}
                            icon={<IconClock size={14} />}
                        />
                        <TextPropertyBox
                            name={locales.type}
                            value={<FormattedMessage id={`common.application-type.${application.type}`} />}
                        />
                    </Flex>
                    <Flex className={classes.fields}>
                        {application.email && (
                            <TextPropertyBox
                                name={locales.email}
                                value={<CopyText text={application.email} />}
                                icon={<IconAt size={14} />}
                            />
                        )}
                        {application.phone && (
                            <TextPropertyBox
                                name={locales.phone}
                                value={<CopyText text={application.phone} />}
                                icon={<IconPhone size={14} />}
                            />
                        )}
                        {application.telegram && (
                            <TextPropertyBox
                                name={locales.telegram}
                                value={application.telegram}
                                href={`https://t.me/${application.telegram}`}
                                icon={<IconBrandTelegram size={14} />}
                            />
                        )}
                        {application.birthDate && (
                            <TextPropertyBox
                                name={locales.birthDate}
                                value={dayjs(application.birthDate).format("DD MMM YYYY")}
                                icon={<IconCake size={14} />}
                            />
                        )}
                        {application.passport && (
                            <TextPropertyBox
                                name={locales.passport}
                                value={<CopyText text={application.passport} />}
                                icon={<IconEPassport size={14} />}
                            />
                        )}
                        {application.citizenship && (
                            <TextPropertyBox
                                name={locales.citizenship}
                                value={application.citizenship}
                                icon={<IconWorld size={14} />}
                            />
                        )}
                    </Flex>
                    <Divider className={classes.divider} />
                    <Text size="sm" c="dimmed">
                        {(application.inSerbia
                            ? intl.formatMessage({ id: locales.inSerbia })
                            : intl.formatMessage({ id: locales.outSerbia })
                        )
                            .concat(" ")
                            .concat(
                                application.residenceRequired
                                    ? intl.formatMessage({ id: locales.residenceRequired })
                                    : intl.formatMessage({ id: locales.residenceNotRequired })
                            )}
                    </Text>
                    {application.inSerbia && (
                        <Flex className={classes.fields}>
                            {application.enterDate && (
                                <TextPropertyBox
                                    name={locales.enterDate}
                                    value={dayjs(application.enterDate).format("DD MMM YYYY")}
                                    icon={<IconArrowRight size={14} />}
                                />
                            )}
                            {application.address && (
                                <TextPropertyBox
                                    name={locales.address}
                                    value={<CopyText text={application.address} />}
                                    icon={<IconLocation size={14} />}
                                />
                            )}
                        </Flex>
                    )}
                    <Divider className={classes.divider} />
                    <Flex direction="column" rowGap="md">
                        {application.occupation && (
                            <TextPropertyBox name={locales.occupation} value={application.occupation} />
                        )}
                    </Flex>
                    {application.hasExperience && (
                        <TextPropertyBox
                            name={locales.experience}
                            value={<Text className={classes.textCard}>{application.experience}</Text>}
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
                        <TextPropertyBox
                            name={locales.languages}
                            value={application.languages}
                            icon={<IconLanguageHiragana size={16} />}
                        />
                    )}
                    {application.skills && (
                        <TextPropertyBox
                            name={locales.skills}
                            value={application.skills}
                            className={classes.textCard}
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
                <Flex gap="md" mt={16} direction="column" className={classes.controls}>
                    <PropertyBox
                        align="start"
                        name={locales.status}
                        value={
                            <ApplicationStatusSelect
                                application={application}
                                className={classes.statusSelect}
                                onChange={onStatusChange}
                            />
                        }
                    />
                    <PropertyBox
                        name={locales.contractStart}
                        value={
                            <ContractDate
                                application={application}
                                onChange={onContractChanged}
                                className={classes.contractDate}
                            />
                        }
                    />
                    <Button
                        variant="gradient"
                        rightSection={<IconContract size={14} />}
                        disabled={application.contract == null}
                        className={classes.contractGenerate}
                        onClick={() => {
                            generateContractPdf(application)
                        }}
                    >
                        Скачать договор
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default ApplicationView
