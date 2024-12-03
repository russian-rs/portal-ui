import { Menu } from "@mantine/core"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import {
    IconCheckupList,
    IconDotsVertical,
    IconEye,
    IconLock,
    IconLockOpen2,
    IconMessageCircle,
} from "@tabler/icons-react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import { locales } from "../lib/locales"
import classes from "./UserMenu.module.scss"

interface UserMenuProps {
    user: UserInfoDto
}

export const UserMenu = ({ user }: UserMenuProps) => {
    const history = useHistory()

    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <IconDotsVertical size={16} className={classes.dots} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <FormattedMessage id={locales.menuCommon} />
                </Menu.Label>
                <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => history.push(`/profile/${user.username}`)}
                >
                    <FormattedMessage id={locales.menuView} />
                </Menu.Item>
                <Menu.Item leftSection={<IconMessageCircle size={14} />}>
                    <FormattedMessage id={locales.menuContact} />
                </Menu.Item>
                <Menu.Item leftSection={<IconCheckupList size={14} />}>
                    <FormattedMessage id={locales.menuReports} />
                </Menu.Item>
                <Menu.Divider />

                <Menu.Label>
                    <FormattedMessage id={locales.menuControl} />
                </Menu.Label>
                {user.active && (
                    <Menu.Item color="red" leftSection={<IconLock size={14} />}>
                        <FormattedMessage id={locales.menuDeactivate} />
                    </Menu.Item>
                )}
                {!user.active && (
                    <Menu.Item leftSection={<IconLockOpen2 size={14} />}>
                        <FormattedMessage id={locales.menuActivate} />
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}
