import { Section } from './LoadingScreen.styles'
import { Loader, Title } from '@mantine/core'

export function LoadingScreen() {
    return (
        <Section>
            <Title order={1}>Портал волонтера</Title>
            <img src="/resources/app-logo.png" alt={'welcome logo'} />
            <Loader />
        </Section>
    )
}
