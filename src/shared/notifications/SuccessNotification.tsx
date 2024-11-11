import { NotificationData } from "@mantine/notifications/lib/notifications.store"
import { IconCheck } from "@tabler/icons-react"
import { ReactNode } from "react"
import classes from "./SuccessNotification.module.scss"

export const SuccessNotification = (
    title: ReactNode,
    body: ReactNode
): NotificationData => {
    return {
        color: "green",
        position: "top-center",
        title: title,
        message: body,
        classNames: classes,
        autoClose: 5000,
        withCloseButton: true,
        icon: <IconCheck />,
    }
}
