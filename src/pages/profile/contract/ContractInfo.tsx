import { Button, Flex, Text } from "@mantine/core"
import { ContractDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconContract } from "@tabler/icons-react"
import dayjs from "dayjs"
import { FormattedMessage } from "react-intl"
import { locales } from "src/pages/profile/contract/lib/locales"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"
import classes from "./ContractInfo.module.scss"

interface ContractInfoProps {
    contracts: ContractDto[]
}

export const ContractInfo = ({ contracts }: ContractInfoProps) => {
    if (contracts.length == 0) {
        return <></>
    }

    return (
        <Flex className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Flex className={classes.props}>
                <PropertyBox
                    name={locales.dateUntil}
                    icon={<IconCalendar size={14} />}
                    value={dayjs(getLastContractDate(contracts)).format("DD MMM YYYY")}
                />
                <PropertyBox
                    name={locales.type}
                    icon={<IconContract size={14} />}
                    value={<FormattedMessage id={`common.contract-type.${getLastContract(contracts).type}`} />}
                />
            </Flex>
            <Text className={classes.daysLeft}>
                <FormattedMessage id={locales.daysLeft} values={{ count: getDaysLeft(contracts) }} />
            </Text>
            <TooltipLocalized text={locales.prolongationDisable} position="bottom">
                <Button disabled={true} variant="light">
                    <FormattedMessage id={locales.prolongation} />
                </Button>
            </TooltipLocalized>
        </Flex>
    )
}

const getLastContract = (contracts: ContractDto[]): ContractDto => {
    return contracts.reduce((max, current) => {
        return new Date(current.endDate) > new Date(max.endDate) ? current : max
    }, contracts[0])
}

const getLastContractDate = (contracts: ContractDto[]): Date => {
    return new Date(getLastContract(contracts).endDate)
}

const getDaysLeft = (contracts: ContractDto[]): number => {
    const endDate = getLastContractDate(contracts)
    return dayjs(endDate).diff(new Date(), "day")
}
