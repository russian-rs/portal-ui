import {
    Image,
    Container,
    Title,
    Button,
    Group,
    Text,
    List,
    ThemeIcon,
} from '@mantine/core'
import { IconCheck } from '@tabler/icons-react'
import { useHistory } from 'react-router-dom'
import image from '../resources/image.svg'
import classes from './Welcome.module.css'
import { FormattedMessage } from 'react-intl'
import { locale } from 'src/pages/welcome/lib/locale'
import { useSetDocumentTitleByLocale } from 'src/shared/hooks/useDocumentTitle'

export const Welcome = () => {
    useSetDocumentTitleByLocale(locale.documentTitle)
    const history = useHistory()

    return (
        <Container>
            <div className={classes.inner}>
                <div className={classes.content}>
                    <Title className={classes.title}>
                        <span className={classes.highlight}>
                            <FormattedMessage id={locale.title} />
                        </span>
                    </Title>
                    <Text
                        c="dimmed"
                        mt="md"
                        size="xl"
                        className={classes.description}
                    >
                        <FormattedMessage id={locale.subTitle} />
                    </Text>

                    <List
                        mt={30}
                        spacing="sm"
                        size="md"
                        icon={
                            <ThemeIcon size={20} radius="xl">
                                <IconCheck
                                    className={classes.iconCheck}
                                    stroke={1.5}
                                />
                            </ThemeIcon>
                        }
                    >
                        <List.Item>
                            <b>
                                <FormattedMessage id={locale.benefitName1} />
                            </b>{' '}
                            –{' '}
                            <FormattedMessage id={locale.benefitDescription1} />
                        </List.Item>
                        <List.Item>
                            <b>
                                <FormattedMessage id={locale.benefitName2} />
                            </b>{' '}
                            –{' '}
                            <FormattedMessage id={locale.benefitDescription2} />
                        </List.Item>
                        <List.Item>
                            <b>
                                <FormattedMessage id={locale.benefitName3} />
                            </b>{' '}
                            –{' '}
                            <FormattedMessage id={locale.benefitDescription3} />
                        </List.Item>
                    </List>

                    <Group mt={30} ms={30}>
                        <Button
                            radius="xl"
                            size="md"
                            className={classes.control}
                            onClick={() => history.push('/profile')}
                        >
                            <FormattedMessage id={locale.buttonLogin} />
                        </Button>
                        <Button
                            variant="default"
                            radius="xl"
                            size="md"
                            className={classes.control}
                            onClick={() => history.push('/not-found')}
                        >
                            <FormattedMessage id={locale.buttonApplication} />
                        </Button>
                    </Group>

                    <Text
                        c="dimmed"
                        mt="md"
                        ms="md"
                        size="xl"
                        className={classes.description}
                    >
                        <FormattedMessage id={locale.bottomText} />
                    </Text>
                </div>
                <Image src={image} className={classes.image} />
            </div>
        </Container>
    )
}
