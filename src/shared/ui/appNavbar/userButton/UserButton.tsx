import { Avatar, Group, Text, UnstyledButton } from "@mantine/core"
import { IconChevronRight } from "@tabler/icons-react"
import { useContext } from "react"
import { useHistory } from "react-router-dom"
import { UserContext } from "src/app/providers/UserContext"
import classes from "./UserButton.module.scss"

export function UserButton() {
    const { user } = useContext(UserContext)
    const history = useHistory()

    return (
        <UnstyledButton
            className={classes.user}
            onClick={() => {
                history.push("/profile")
            }}
        >
            <Group>
                <Avatar
                    src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png"
                    radius="md"
                    size={48}
                />

                <div style={{ flex: 1 }}>
                    <Text fw={500}>{user?.fullName}</Text>

                    <Text c="dimmed" size="xs">
                        {user?.email}
                    </Text>
                </div>

                <IconChevronRight className={classes.chevron} />
            </Group>
        </UnstyledButton>
    )
}
