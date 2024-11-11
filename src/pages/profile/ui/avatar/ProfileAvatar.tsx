import { Avatar, Flex, LoadingOverlay, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconEdit } from "@tabler/icons-react"
import { ChangeEvent, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { FilesApiService } from "src/shared/api/FilesApiService"
import { UserApiService } from "src/shared/api/UserApiService"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import classes from "./ProfileAvatar.module.scss"

export const ProfileAvatar = ({
    link,
}: {
    link: string | null | undefined
}) => {
    const [avatar, setAvatar] = useState<string | null | undefined>(link)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        setAvatar(link)
    }, [link])

    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setUploading(true)
            FilesApiService.uploadFile(file).then((fileInfoResponse) => {
                setAvatar(fileInfoResponse.data.link)
                UserApiService.setAvatar(fileInfoResponse.data.id).then(() => {
                    setUploading(false)
                    notifications.show(
                        SuccessNotification(
                            <Text size="sm">
                                <FormattedMessage id="pages.profile.avatarUpdated" />
                            </Text>,
                            null
                        )
                    )
                })
            })
        }
    }

    return (
        <Flex className={classes.avatarRoot}>
            <label htmlFor="avatar-upload" className={classes.label}>
                <Avatar
                    src={avatar}
                    className={classes.avatar}
                    variant="gradient"
                    gradient={{ from: "#0339FC", to: "#58AEB0" }}
                />
                <div className={classes.overlay}>
                    <IconEdit size={24} color="white" />
                </div>
                <LoadingOverlay
                    visible={uploading}
                    className={classes.loader}
                />
                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                />
            </label>
        </Flex>
    )
}
