import { Flex, SimpleGrid, Title, Text } from '@mantine/core'
import styled from 'styled-components'
import { Image404 } from 'src/shared/ui/notFound/resources/Image404'

export const Root = styled.div`
    height: 100%;
`

export const StyledGrip = styled(SimpleGrid)`
    position: relative;
`

export const Content = styled(Flex)`
    padding-top: 220px;
    position: relative;
    z-index: 1;

    @media (max-width: $mantine-breakpoint-sm) {
        padding-top: 120px;
    }
`

export const StyledTitle = styled(Title)`
    font-weight: 900;
    font-size: 34px;
    margin-bottom: var(--mantine-spacing-md);

    @media (max-width: $mantine-breakpoint-sm) {
        font-size: 16px;
    }
`

export const Description = styled.div`
    max-width: 600px;
    margin: var(--mantine-spacing-xl) auto calc(var(--mantine-spacing-xl));
`

export const StyledButton = styled.button`
    @media (max-width: $mantine-breakpoint-sm) {
        width: 100%;
    }
`

export const StyledImage404 = styled(Image404)`
    position: absolute;
    inset: 0;
    opacity: 0.75;
    color: light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6));
`
