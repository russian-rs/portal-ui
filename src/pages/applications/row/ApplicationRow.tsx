import { Avatar, Box, Card, Flex, Table, Text } from "@mantine/core"
import { ApplicationDto, ContractDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { ReactNode, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { ContractDate } from "src/pages/applications/contract/ContractDate"
import { ApplicationMenu } from "src/pages/applications/menu/ApplicationMenu"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import { useScreenSize } from "src/shared/hooks/useDesktop"
import { CopyText } from "src/shared/ui/copyText/CopyText"
import { ApplicationStatusSelect } from "src/shared/ui/select/ApplicationStatusSelect"
import { getMantineColor } from "src/shared/ui/theme/CustomMantineTheme"
import { ApplicationStatus } from "src/shared/user/applications"
import classes from "./ApplicationRow.module.scss"

interface ApplicationRowProps {
    applicationDto: ApplicationDto
    isMobile?: boolean
}

export const ApplicationRow = ({ applicationDto, isMobile = false }: ApplicationRowProps) => {
    const [application, setApplication] = useState(applicationDto)
    const [updated, setUpdated] = useState(false)
    const { isLargeDesktop } = useScreenSize()
    const navigate = useNavigate()

    const { isFetching: isUpdating } = useQuery({
        enabled: updated,
        queryKey: ["updateApplication", application],
        queryFn: () => PrivateApplicationApiService.updateApplication(application).then((response) => response.data),
    })

    const onStatusUpdate = (status: string, denyReason?: string) => {
        if (status === ApplicationStatus.DENY && denyReason) {
            setApplication({ ...application, status: status, refuseReason: denyReason })
        } else {
            setApplication({ ...application, status: status })
        }
        setUpdated(true)
    }

    const onContractChanged = (contract: ContractDto) => {
        setApplication({ ...application, contract: contract })
        setUpdated(true)
    }

    if (isMobile) {
        return (
            <Card shadow="sm" padding="sm" radius="md" withBorder className={classes.mobileCard}>
                <Flex direction="column" gap="md">
                    <Flex justify="space-between" align="center">
                        <Flex columnGap="sm" align="center">
                            <Avatar
                                name={application.name}
                                size={40}
                                color={getMantineColor(application.name)}
                                className={classes.avatar}
                                onClick={() => navigate(`/application/${application.id}`)}
                            />
                            <Box>
                                <Text fw={600} size="sm">
                                    {application.name}
                                </Text>
                                <Text c="dimmed" size="xs">
                                    {dayjs(application.created).format("DD MMM YYYY")}
                                </Text>
                            </Box>
                        </Flex>
                        <ApplicationMenu applicationDto={application} />
                    </Flex>

                    <Box className={classes.mobileInfo}>
                        <div className={classes.mobileRow}>
                            <Text size="xs" c="dimmed" className={classes.mobileLabel}>
                                <FormattedMessage id="pages.applications.type" />:
                            </Text>
                            <div>{type(application.type, false)}</div>
                        </div>

                        <div className={classes.mobileRow}>
                            <Text size="xs" c="dimmed" className={classes.mobileLabel}>
                                <FormattedMessage id="pages.applications.email" />:
                            </Text>
                            <div>
                                <CopyText text={application.email} size="xs" />
                            </div>
                        </div>

                        <div className={classes.mobileRow}>
                            <Text size="xs" c="dimmed" className={classes.mobileLabel}>
                                <FormattedMessage id="pages.applications.contractStart" />:
                            </Text>
                            <div>
                                <ContractDate application={application} onChange={onContractChanged} />
                            </div>
                        </div>

                        <div className={classes.mobileRow}>
                            <Text size="xs" c="dimmed" className={classes.mobileLabel}>
                                <FormattedMessage id="pages.applications.status" />:
                            </Text>
                            <div>
                                <ApplicationStatusSelect
                                    application={application}
                                    className={classes.mobileStatusSelect}
                                    disabled={isUpdating}
                                    onChange={onStatusUpdate}
                                />
                            </div>
                        </div>
                    </Box>
                </Flex>
            </Card>
        )
    }

    return (
        <Table.Tr key={application.id}>
            <Table.Td>
                <Text c="dimmed" size={isLargeDesktop ? "sm" : "xs"} className={classes.compactText}>
                    {dayjs(application.created).format(isLargeDesktop ? "DD MMM YYYY" : "DD.MM.YY")}
                </Text>
            </Table.Td>
            <Table.Td>{type(application.type, isLargeDesktop)}</Table.Td>
            <Table.Td>
                <Flex columnGap="sm" align="center" className={classes.compactFlex}>
                    <Avatar
                        name={application.name}
                        size={isLargeDesktop ? 24 : 20}
                        color={getMantineColor(application.name)}
                        className={classes.avatar}
                        onClick={() => navigate(`/application/${application.id}`)}
                    />
                    <Text size={isLargeDesktop ? "sm" : "xs"} truncate="end" className={classes.compactText}>
                        {application.name}
                    </Text>
                </Flex>
            </Table.Td>
            <Table.Td>
                <CopyText text={application.email} size={isLargeDesktop ? "sm" : "xs"} />
            </Table.Td>
            <Table.Td>
                <ContractDate application={application} onChange={onContractChanged} />
            </Table.Td>
            <Table.Td className={classes.statusSelect}>
                <ApplicationStatusSelect
                    application={application}
                    className={classes.statusSelect}
                    disabled={isUpdating}
                    onChange={onStatusUpdate}
                />
            </Table.Td>
            <Table.Td>
                <Flex align="center">
                    <ApplicationMenu applicationDto={application} />
                </Flex>
            </Table.Td>
        </Table.Tr>
    )
}

const type = (type: String | undefined, isLargeDesktop: boolean = true): ReactNode => {
    return (
        <Text c={type === "NEW" ? "cyan" : "red"} size={isLargeDesktop ? "sm" : "xs"} className={classes.compactText}>
            <FormattedMessage id={`common.application-type.${type}`} />
        </Text>
    )
}
