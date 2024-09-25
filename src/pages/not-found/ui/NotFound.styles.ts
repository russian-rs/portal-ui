import { Title } from '@mantine/core'
import styled from 'styled-components'

export const Root = styled.div`
    height: 100vh;
    width: 100vw;
`

export const StyledTitle = styled(Title)`
    font-weight: 900;
    font-size: 34px;
    margin-bottom: var(--mantine-spacing-md);
    font-family:
        Greycliff CF,
        var(--mantine-font-family),
        serif;

    @media (max-width: $mantine-breakpoint-sm) {
        font-size: 32px;
    }
`

export const StyledButton = styled.button`
    @media (max-width: $mantine-breakpoint-sm) {
        width: 100%;
    }
`
