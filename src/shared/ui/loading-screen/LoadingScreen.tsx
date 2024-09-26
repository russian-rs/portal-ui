import {
    CenterContainer,
    CustomLoader,
    StyledImage,
} from './LoadingScreen.styles'
import { Center, Flex, Image } from '@mantine/core'
import { useEffect, useState } from 'react'

export function LoadingScreen() {
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
        <Center component={CenterContainer}>
            <Flex justify="center" align="center" direction="column" gap="lg">
                <CustomLoader />
                <Image src="/resources/pv_title.png" component={StyledImage} />
                <CustomLoader />
            </Flex>
        </Center>
    )
}
