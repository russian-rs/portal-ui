import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import { Button, Container, Flex, Text } from "@mantine/core"
import { useHistory } from "react-router-dom"

export const Profile = () => {
    const { user } = useContext(UserContext)
    const history = useHistory()

    return (
        <>
            <Flex direction="column">
                <Text size="xl">Hello, {user?.fullName}</Text>
                <Button onClick={() => history.push("/logout")}>Logout</Button>
            </Flex>
        </>
    )
}
