import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"
import { Button } from "@mantine/core"
import { useHistory } from "react-router-dom"

export const Profile = () => {
    const { user } = useContext(UserContext)
    const history = useHistory()

    return (
        <>
            <h1>Hello, {user?.fullName}</h1>
            <Button onClick={() => history.push("/logout")}>Logout</Button>
        </>
    )
}
