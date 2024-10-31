import { Button, Container, Flex } from "@mantine/core"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconBrandTelegram, IconPhone } from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import commonClasses from "src/app/styles/private.module.scss"
import classes from "src/pages/profile/Profile.module.scss"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"

export const CommonInfoContainer = ({
    userInfo,
}: {
    userInfo: UserInfoDto | undefined
}) => {
    return (
        <Flex direction="column">
            <PropertyBox
                name={"pages.profile.props.city"}
                value={userInfo?.city}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.address"}
                value={userInfo?.address}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.birthDate"}
                value={userInfo?.birthDate}
                className={classes.propertyBox}
            />
            <Container className={commonClasses.divider} />
            <PropertyBox
                name={"Email"}
                value={userInfo?.email}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"Telegram"}
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
            <TooltipLocalized
                text="pages.profile.buttons.editTooltip"
                position="bottom"
            >
                <Button
                    disabled={true}
                    className={classes.button}
                    variant="outline"
                >
                    <FormattedMessage id={"pages.profile.buttons.edit"} />
                </Button>
            </TooltipLocalized>
        </Flex>
    )
}
