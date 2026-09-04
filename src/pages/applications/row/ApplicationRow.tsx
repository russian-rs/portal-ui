import { Avatar, Badge, Box, Card, Flex, Table, Text } from "@mantine/core"
import { ApplicationDto, ContractDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconNotes } from "@tabler/icons-react"
import dayjs from "dayjs"
import { ReactNode } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { ContractDate } from "src/pages/applications/contract/ContractDate"
import { ApplicationMenu } from "src/pages/applications/menu/ApplicationMenu"
import { useApplicationUpdate } from "src/shared/api/applications/useApplicationUpdate"
import { ApplicationAssigneeAvatar } from "../assignee/ApplicationAssigneeAvatar"
import { useScreenSize } from "src/shared/hooks/useDesktop"
import { CopyText } from "src/shared/ui/copyText/CopyText"
import { ApplicationStatusSelect } from "src/shared/ui/select/ApplicationStatusSelect"
import { getMantineColor } from "src/shared/ui/theme/CustomMantineTheme"
import { ApplicationStatus } from "src/shared/user/applications"
import classes from "./ApplicationRow.module.scss"

interface ApplicationRowProps {
    applicationDto: ApplicationDto
    isMobile?: boolean
    assigneeUser?: UserInfoDto
}

export const ApplicationRow = ({
    applicationDto: application,
    isMobile = false,
    assigneeUser,
}: ApplicationRowProps) => {
    const { isLargeDesktop } = useScreenSize()
    const navigate = useNavigate()
    const { mutate: updateApplication, isPending: isUpdating } = useApplicationUpdate()

    const onStatusUpdate = (status: string, comment?: string) => {
        if (status === application.status) return
        updateApplication({
            id: application.id,
            status,
            ...(status === ApplicationStatus.DENY && comment ? { refuseReason: comment } : {}),
            ...(status === ApplicationStatus.PAUSED && comment ? { comment } : {}),
        })
    }

    const onContractChanged = (contract: ContractDto) => {
        updateApplication({ id: application.id, contract })
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

                        <Flex align="center" gap="xs">
                            <ApplicationAssigneeAvatar login={application.assignee} user={assigneeUser} />
                            {application.notes && application.notes.length > 0 && (
                                <Badge variant="light" color="blue" leftSection={<IconNotes size={12} />}>
                                    {application.notes.length}
                                </Badge>
                            )}

                            <ApplicationMenu applicationDto={application} />
                        </Flex>
                    </Flex>

                    <Box className={classes.mobileInfo}>
                        <div className={classes.mobileRow}>
                            <Text size="xs" c="dimmed" className={classes.mobileLabel}>
                                <FormattedMessage id="pages.applications.view.type" />:
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
                                <ContractDate
                                    application={application}
                                    onChange={onContractChanged}
                                    disabled={isUpdating}
                                />
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

                                {application.status === ApplicationStatus.PAUSED && (application as any).comment && (
                                    <Text size="xs" c="dimmed" mt={4} style={{ whiteSpace: "pre-wrap" }}>
                                        {(application as any).comment}
                                    </Text>
                                )}
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
                <Box>
                    <Text c="dimmed" size={isLargeDesktop ? "sm" : "xs"} className={classes.compactText}>
                        {dayjs(application.created).format(isLargeDesktop ? "DD MMM YYYY" : "DD.MM.YY")}
                    </Text>

                    {type(application.type, isLargeDesktop)}
                </Box>
            </Table.Td>
            <Table.Td>
                <Flex columnGap="sm" align="center" className={classes.compactFlex}>
                    <Avatar
                        name={application.name}
                        size={isLargeDesktop ? 24 : 20}
                        color={getMantineColor(application.name)}
                        className={classes.avatar}
                        onClick={() => navigate(`/application/${application.id}`)}
                    />

                    <Flex direction="column" gap="0">
                        <Text size={isLargeDesktop ? "sm" : "xs"} truncate="end" className={classes.compactText}>
                            {application.name}
                        </Text>

                        <CopyText text={application.email} size={isLargeDesktop ? "sm" : "xs"} />
                    </Flex>
                </Flex>
            </Table.Td>
            <Table.Td>
                <ContractDate application={application} onChange={onContractChanged} disabled={isUpdating} />
            </Table.Td>
            <Table.Td className={classes.statusSelect}>
                <div>
                    <ApplicationStatusSelect
                        application={application}
                        className={classes.statusSelect}
                        disabled={isUpdating}
                        onChange={onStatusUpdate}
                        showInlineReason={false}
                    />

                    {application.status === ApplicationStatus.PAUSED && (application as any).comment && (
                        <Text size="xs" c="dimmed" mt={4} style={{ whiteSpace: "pre-wrap" }}>
                            {(application as any).comment}
                        </Text>
                    )}
                </div>
            </Table.Td>
            <Table.Td>
                <Flex align="center" justify="flex-end" gap="xs">
                    <ApplicationAssigneeAvatar login={application.assignee} user={assigneeUser} />
                    {application.notes && application.notes.length > 0 && (
                        <Badge variant="light" color="blue" leftSection={<IconNotes size={12} />}>
                            {application.notes.length}
                        </Badge>
                    )}

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
