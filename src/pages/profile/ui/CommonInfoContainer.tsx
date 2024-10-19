import { Button, Container, Flex } from "@mantine/core"
import { IconBrandTelegram, IconPhone } from "@tabler/icons-react"
import { useContext } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import classes from "src/pages/profile/Profile.module.scss"
import { PropertyBox } from "src/shared/ui/propertyBox/PropertyBox"
import { TooltipLocalized } from "src/shared/ui/tooltip/TooltipLocalized"

export const CommonInfoContainer = () => {
    const { user } = useContext(UserContext)

    return (
        <Flex direction="column">
            <PropertyBox
                name={"pages.profile.props.city"}
                value={"Beograd"}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.address"}
                value={"11050, Ustanićka 128/53"}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.birthDate"}
                value={"03.11.1998"}
                className={classes.propertyBox}
            />
            <Container className={commonClasses.divider} />
            <PropertyBox
                name={"Email"}
                value={user?.email}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"Telegram"}
                value={"aminovmaksim"}
                icon={<IconBrandTelegram size={18} />}
                href={"https://t.me/zortan3302"}
                className={classes.propertyBox}
            />
            <PropertyBox
                name={"pages.profile.props.phone"}
                value={"+381677621034"}
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
