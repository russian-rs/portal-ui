import { useHistory } from 'react-router-dom'
import { Text, SimpleGrid, Button, Image, Container, Flex } from '@mantine/core'
import image from 'src/pages/notFound/resources/404.png'
import { Root, StyledButton, StyledTitle } from './NotFound.styles'
import { locale } from 'src/pages/notFound/lib/locale'
import { FormattedMessage } from 'react-intl'
import { useSetDocumentTitleByLocale } from 'src/shared/hooks/useDocumentTitle'

export const NotFound = () => {
    useSetDocumentTitleByLocale(locale.documentTitle)

    const history = useHistory()

    return (
        <Flex component={Root} align="center">
            <Container>
                <SimpleGrid cols={{ sm: 2 }}>
                    <Image src={image} />
                    <Flex direction="column" justify="center">
                        <StyledTitle>
                            <FormattedMessage id={locale.title} />
                        </StyledTitle>
                        <Text c="dimmed" size="lg">
                            <FormattedMessage id={locale.description} />
                        </Text>
                        <Button
                            variant="outline"
                            mt="xl"
                            component={StyledButton}
                            onClick={() => history.push('/')}
                        >
                            <FormattedMessage id={locale.homeButton} />
                        </Button>
                    </Flex>
                </SimpleGrid>
            </Container>
        </Flex>
    )
}
