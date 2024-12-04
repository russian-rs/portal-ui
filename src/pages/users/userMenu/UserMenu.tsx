import { Loader, Menu } from "@mantine/core"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import {
    IconCheckupList,
    IconDotsVertical,
    IconEye,
    IconLock,
    IconLockOpen2,
    IconMessageCircle,
} from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import { UserApiService } from "src/shared/api/UserApiService"
import { locales } from "../lib/locales"
import classes from "./UserMenu.module.scss"

interface UserMenuProps {
    user: UserInfoDto
}

export const UserMenu = ({ user }: UserMenuProps) => {
    const history = useHistory()

    const [userDto, setUserDto] = useState(user)

    const { isFetching: isActivating, refetch: activate } = useQuery({
        enabled: false,
        queryKey: ["activate"],
        queryFn: () =>
            UserApiService.activateAccount(userDto.id).then(() => {
                window.location.reload()
            }),
    })

    const { isFetching: isDectivating, refetch: deactivate } = useQuery({
        enabled: false,
        queryKey: ["deactivate"],
        queryFn: () =>
            UserApiService.deactivateAccount(userDto.id).then(() => {
                window.location.reload()
            }),
    })

    return (
        <Menu shadow="md" width={200} closeOnItemClick={false}>
            <Menu.Target>
                <IconDotsVertical size={16} className={classes.dots} />
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>
                    <FormattedMessage id={locales.menuCommon} />
                </Menu.Label>
                <Menu.Item
                    leftSection={<IconEye size={14} />}
                    onClick={() => history.push(`/profile/${userDto.username}`)}
                >
                    <FormattedMessage id={locales.menuView} />
                </Menu.Item>
                <Menu.Item leftSection={<IconMessageCircle size={14} />} disabled={true}>
                    <FormattedMessage id={locales.menuContact} />
                </Menu.Item>
                <Menu.Item leftSection={<IconCheckupList size={14} />} disabled={true}>
                    <FormattedMessage id={locales.menuReports} />
                </Menu.Item>
                <Menu.Divider />

                <Menu.Label>
                    <FormattedMessage id={locales.menuControl} />
                </Menu.Label>
                {userDto.active && (
                    <Menu.Item
                        color="red"
                        leftSection={isDectivating ? <Loader size={14} /> : <IconLock size={14} />}
                        disabled={isActivating}
                        onClick={() => deactivate()}
                    >
                        <FormattedMessage id={locales.menuDeactivate} />
                    </Menu.Item>
                )}
                {!userDto.active && (
                    <Menu.Item
                        leftSection={isActivating ? <Loader size={14} /> : <IconLockOpen2 size={14} />}
                        disabled={isDectivating}
                        onClick={() => activate()}
                    >
                        <FormattedMessage id={locales.menuActivate} />
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    )
}
