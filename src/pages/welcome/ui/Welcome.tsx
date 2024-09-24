import { Button } from '@mantine/core'
import { useHistory } from 'react-router-dom'

export const Welcome = () => {
    const history = useHistory()

    return (
        <>
            <h1>Главная страница</h1>
            <Button onClick={() => history.push('/profile')}>
                Портал волонтера
            </Button>
            <Button onClick={() => history.push('/welcome/application')}>
                Заявка на волонтерство
            </Button>
        </>
    )
}
