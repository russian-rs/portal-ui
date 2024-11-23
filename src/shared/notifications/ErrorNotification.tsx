import { NotificationData } from "@mantine/notifications/lib/notifications.store"
import { IconExclamationCircle } from "@tabler/icons-react"
import { ReactNode } from "react"
import classes from "src/shared/notifications/ErrorNotification.module.scss"

export const ErrorNotification = (title: ReactNode, body?: ReactNode): NotificationData => {
    return {
        color: "red",
        position: "top-center",
        title: title,
        message: body,
        classNames: classes,
        autoClose: 5000,
        withCloseButton: true,
        icon: <IconExclamationCircle />,
    }
}
