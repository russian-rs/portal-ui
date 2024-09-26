import { Title } from '@mantine/core'
import styled from 'styled-components'

export const Root = styled.div`
    height: 100vh;
`

export const StyledTitle = styled(Title)`
    font-weight: 900;
    font-size: 34px;
    margin-bottom: var(--mantine-spacing-md);

    @media (max-width: $mantine-breakpoint-sm) {
        font-size: 32px;
    }
`

export const StyledButton = styled.button`
    @media (max-width: $mantine-breakpoint-sm) {
        width: 100%;
    }
`
