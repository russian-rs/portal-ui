import { Button, Flex, Text } from "@mantine/core"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconId, IconPencil } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import classes from "src/pages/profile/contract/ContractInfo.module.scss"
import { ResidencePermitDrawer } from "src/pages/profile/residencePermit/ResidencePermitDrawer"
import { ResidencePermitDto } from "src/pages/profile/residencePermit/types/residencePermit"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { hasPermission, UserGroup } from "src/shared/user/roles"

interface ResidencePermitInfoProps {
    userInfo: UserInfoDto
    residencePermits: ResidencePermitDto[]
    onUpdate: () => void
}

export const ResidencePermitInfo = ({ userInfo, residencePermits, onUpdate }: ResidencePermitInfoProps) => {
    const { user: currentUser } = useContext(UserContext)
    const [drawerOpened, setDrawerOpened] = useState(false)

    const activePermit = residencePermits.find((p) => dayjs(p.validUntil).isAfter(dayjs())) || residencePermits[0]

    return (
        <Flex className={classes.root}>
            {!activePermit ? (
                <>
                    <Text className={classes.title}>
                        <FormattedMessage id="pages.profile.residencePermit.no-permit" />
                    </Text>
                    {hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER]) && (
                        <Button variant="light" onClick={() => setDrawerOpened(true)}>
                            <FormattedMessage id="pages.profile.residencePermit.button" />
                        </Button>
                    )}
                </>
            ) : (
                <>
                    <Text className={classes.title}>
                        <FormattedMessage id="pages.profile.residencePermit.title" />
                    </Text>
                    <Flex className={classes.props}>
                        <TextPropertyBox
                            name="pages.profile.residencePermit.valid-until"
                            icon={<IconId size={14} />}
                            value={dayjs(activePermit.validUntil).format("DD MMM YYYY")}
                        />
                        <TextPropertyBox
                            name="pages.profile.residencePermit.purpose-of-stay"
                            value={activePermit.purposeOfStay}
                        />
                    </Flex>
                    <Text className={classes.daysLeft}>
                        <FormattedMessage
                            id="pages.profile.residencePermit.days-left"
                            values={{ count: dayjs(activePermit.validUntil).diff(new Date(), "day") }}
                        />
                    </Text>
                    {hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER]) && (
                        <Button
                            variant="outline"
                            leftSection={<IconPencil size={14} />}
                            onClick={() => setDrawerOpened(true)}
                        >
                            <FormattedMessage id="pages.profile.residencePermit.button" />
                        </Button>
                    )}
                </>
            )}
            <ResidencePermitDrawer
                userId={userInfo.id}
                residencePermits={residencePermits}
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                onSuccess={onUpdate}
            />

        </Flex>
    )
}
