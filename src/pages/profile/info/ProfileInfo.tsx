import { Button, Container, Flex, Text } from "@mantine/core"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconBrandTelegram, IconPhone } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import { ProfileAvatar } from "src/pages/profile/avatar/ProfileAvatar"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"
import classes from "./ProfileInfo.module.scss"

interface ProfileInfoProps {
    userInfo: UserInfoDto | undefined
}

export const ProfileInfo = ({ userInfo }: ProfileInfoProps) => {
    const { user: currentUser } = useContext(UserContext)

    return (
        <Flex direction="column" className={classes.infoContainer}>
            <ProfileAvatar link={userInfo?.avatar?.link} editable={currentUser?.username === userInfo?.username} />
            <Text className={classes.userName}>{userInfo?.fullName}</Text>
            <Text c="dimmed">{userInfo?.program}</Text>
            <Container className={commonClasses.divider} />
            <PropertyBox name={"pages.profile.props.city"} value={userInfo?.city} className={classes.propertyBox} />
            <PropertyBox
                name={"pages.profile.props.address"}
                value={userInfo?.address}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.birthDate"}
                value={dayjs(userInfo?.birthDate).format("DD MMMM YYYY")}
                className={classes.propertyBox}
            />
            <Container className={commonClasses.divider} />
            <PropertyBox name={"pages.profile.props.email"} value={userInfo?.email} className={classes.propertyBox} />
            <PropertyBox
                name={"pages.profile.props.telegram"}
                value={userInfo?.telegram}
                icon={<IconBrandTelegram size={18} />}
                href={`https://t.me/${userInfo?.telegram}`}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.phone"}
                value={userInfo?.phone}
                icon={<IconPhone size={18} />}
                className={classes.propertyBox}
            />
            <TooltipLocalized text="pages.profile.buttons.editTooltip" position="bottom">
                <Button disabled={true} className={classes.button} variant="outline">
                    <FormattedMessage id={"pages.profile.buttons.edit"} />
                </Button>
            </TooltipLocalized>
        </Flex>
    )
}
