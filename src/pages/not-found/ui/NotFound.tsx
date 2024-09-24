import { useHistory } from 'react-router-dom'

import { NotFoundContainer, NotFoundContent } from './NotFound.styles'
import { Button, Flex } from '@mantine/core'

export const NotFound = () => {
    const history = useHistory()

    return (
        <NotFoundContainer>
            <img src="/resources/not-found.png" alt="not found" width={300} />

            <NotFoundContent>Страница не найдена</NotFoundContent>
            <Flex direction={'column'} gap={'s4'}>
                <Button onClick={() => history.push('/')}>На главную</Button>
            </Flex>
        </NotFoundContainer>
    )
}
