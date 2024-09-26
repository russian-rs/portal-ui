import { Button, Flex, Title } from '@mantine/core'
import { useHistory } from 'react-router-dom'

export const Welcome = () => {
    const history = useHistory()

    return (
        <>
            <Flex direction="column" align="center" justify="center">
                <Title>Главная страница</Title>
                <Flex gap={4}>
                    <Button onClick={() => history.push('/profile')}>
                        Портал волонтера
                    </Button>
                    <Button
                        onClick={() => history.push('/welcome/application')}
                    >
                        Заявка на волонтерство
                    </Button>
                </Flex>
            </Flex>
        </>
    )
}
