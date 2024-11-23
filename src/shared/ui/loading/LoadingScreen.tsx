import { Center, Flex, Image, Text } from "@mantine/core"
import { useEffect, useState } from "react"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import classes from "./LoadingScreen.module.scss"

export const LoadingScreen = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 500)
        // Clear timeout if the component is unmounted
        return () => clearTimeout(timer)
    }, [])

    if (!visible) {
        return <></>
    }

    return (
        <Center className={classes.center}>
            <Flex justify="center" align="center" direction="column" gap="lg">
                <CustomLoader />
                <Image src="/resources/pv_title.png" className={classes.image} />
                <CustomLoader />
                <Text c="blue">Идет загрузка ...</Text>
            </Flex>
        </Center>
    )
}
