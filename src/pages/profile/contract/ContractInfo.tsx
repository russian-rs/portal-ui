import { Button, Flex, Text } from "@mantine/core"
import { ContractDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconContract } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { locales } from "src/pages/profile/contract/lib/locales"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"
import classes from "./ContractInfo.module.scss"

interface ContractInfoProps {
    userInfo: UserInfoDto
    contracts: ContractDto[]
}

export const ContractInfo = ({ contracts, userInfo }: ContractInfoProps) => {
    const navigate = useNavigate()
    const { user: currentUser } = useContext(UserContext)

    if (contracts.length == 0) {
        return <></>
    }

    return (
        <Flex className={classes.root}>
            <Text className={classes.title}>
                <FormattedMessage id={locales.title} />
            </Text>
            <Flex className={classes.props}>
                <TextPropertyBox
                    name={locales.dateUntil}
                    icon={<IconCalendar size={14} />}
                    value={dayjs(getLastContractDate(contracts)).format("DD MMM YYYY")}
                />
                <TextPropertyBox
                    name={locales.type}
                    icon={<IconContract size={14} />}
                    value={<FormattedMessage id={`common.contract-type.${getLastContract(contracts).type}`} />}
                />
            </Flex>
            <Text className={classes.daysLeft}>
                <FormattedMessage id={locales.daysLeft} values={{ count: getDaysLeft(contracts) }} />
            </Text>
            {userInfo.id === currentUser?.id && (
                <TooltipLocalized text={locales.prolongationInfo} position="bottom">
                    <Button
                        variant="light"
                        onClick={() => navigate("/application")}
                        disabled={getDaysLeft(contracts) > 90}
                    >
                        <FormattedMessage id={locales.prolongation} />
                    </Button>
                </TooltipLocalized>
            )}
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
