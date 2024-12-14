import { Flex } from "@mantine/core"
import { useState } from "react"
import { Navigate } from "react-router"
import { Terms } from "src/pages/application/terms/Terms"
import classes from "./Application.module.scss"

export const Application = () => {
    const [termsAccepted, setTermsAccepted] = useState(false)

    if (!termsAccepted) {
        return (
            <Flex className={classes.root}>
                <Terms onAccepted={() => setTermsAccepted(true)} />
            </Flex>
        )
    }

    return <Navigate to="/application/form" replace={true} />
}

export default Application
