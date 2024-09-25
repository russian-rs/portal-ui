import { useHistory } from 'react-router-dom'
import { Text, SimpleGrid, Button, Image, Container, Flex } from '@mantine/core'
import image from './404.svg'
import {
    Root,
    StyledButton,
    StyledTitle,
} from 'src/pages/not-found/ui/NotFound.styles'

export const NotFound = () => {
    const history = useHistory()

    return (
        <Flex component={Root} align="center">
            <Container>
                <SimpleGrid cols={{ sm: 2 }}>
                    <div>
                        <StyledTitle>Something is not right...</StyledTitle>
                        <Text c="dimmed" size="lg">
                            Page you are trying to open does not exist. You may
                            have mistyped the address, or the page has been
                            moved to another URL. If you think this is an error
                            contact support.
                        </Text>
                        <Button
                            variant="outline"
                            size="md"
                            mt="xl"
                            component={StyledButton}
                            onClick={() => history.push('/')}
                        >
                            Get back to home page
                        </Button>
                    </div>
                    <Image src={image} />
                </SimpleGrid>
            </Container>
        </Flex>
    )
}
