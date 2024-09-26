import { useHistory } from 'react-router-dom'
import {
    Text,
    SimpleGrid,
    Button,
    Container,
    Flex,
    Group,
    Center,
} from '@mantine/core'
import {
    Content,
    Description,
    Root,
    StyledButton,
    StyledGrip,
    StyledImage404,
    StyledTitle,
} from './NotFound.styles'
import { locale } from 'src/pages/notFound/lib/locale'
import { FormattedMessage } from 'react-intl'
import { useSetDocumentTitleByLocale } from 'src/shared/hooks/useDocumentTitle'

export const NotFound = () => {
    useSetDocumentTitleByLocale(locale.documentTitle)

    const history = useHistory()

    return (
        <Flex component={Root} align="center">
            <Container>
                <SimpleGrid cols={{ sm: 2 }} component={StyledGrip}>
                    <StyledImage404 />
                    <Flex
                        direction="column"
                        justify="center"
                        component={Content}
                    >
                        <Center component={StyledTitle}>
                            <FormattedMessage id={locale.title} />
                        </Center>
                        <Text
                            c="dimmed"
                            size="lg"
                            ta="center"
                            component={Description}
                        >
                            <FormattedMessage id={locale.description} />
                        </Text>
                        <Group justify="center">
                            <Button
                                variant="outline"
                                mt="xl"
                                component={StyledButton}
                                onClick={() => history.push('/')}
                            >
                                <FormattedMessage id={locale.homeButton} />
                            </Button>
                        </Group>
                    </Flex>
                </SimpleGrid>
            </Container>
        </Flex>
    )
}
