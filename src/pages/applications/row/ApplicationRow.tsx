import { Avatar, Flex, Table, Text } from "@mantine/core"
import { ApplicationDto, ContractDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { ReactNode, useState } from "react"
import { FormattedMessage } from "react-intl"
import { ContractDate } from "src/pages/applications/contract/ContractDate"
import { ApplicationMenu } from "src/pages/applications/menu/ApplicationMenu"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import { CopyText } from "src/shared/ui/copyText/CopyText"
import { ApplicationStatusSelect } from "src/shared/ui/select/ApplicationStatusSelect"
import { getMantineColor } from "src/shared/ui/theme/CustomMantineTheme"
import classes from "./ApplicationRow.module.scss"

interface ApplicationRowProps {
    applicationDto: ApplicationDto
}

export const ApplicationRow = ({ applicationDto }: ApplicationRowProps) => {
    const [application, setApplication] = useState(applicationDto)
    const [updated, setUpdated] = useState(false)

    const { isFetching: isUpdating } = useQuery({
        enabled: updated,
        queryKey: ["updateApplication", application],
        queryFn: () => PrivateApplicationApiService.updateApplication(application).then((response) => response.data),
    })

    const onStatusUpdate = (status: string) => {
        setApplication({ ...application, status: status })
        setUpdated(true)
    }

    const onContractChanged = (contract: ContractDto) => {
        setApplication({ ...application, contract: contract })
        setUpdated(true)
    }

    return (
        <Table.Tr key={application.id}>
            <Table.Td>{dayjs(application.created).format("DD MMM YYYY")}</Table.Td>
            <Table.Td>{type(application.type)}</Table.Td>
            <Table.Td>
                <Flex columnGap="sm" align="center">
                    <Avatar
                        name={application.name}
                        size={24}
                        color={getMantineColor(application.name)}
                        className={classes.avatar}
                        onClick={() => window.open(`/application/${application.id}`)}
                    />
                    <Text size="sm">{application.name}</Text>
                </Flex>
            </Table.Td>
            <Table.Td>
                <CopyText text={application.email} size="sm" />
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

const type = (type: String | undefined): ReactNode => {
    return (
        <Text c={type === "NEW" ? "cyan" : "red"} size="sm">
            <FormattedMessage id={`common.application-type.${type}`} />
        </Text>
    )
}
