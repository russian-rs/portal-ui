import styled from 'styled-components'
import { Title } from '@mantine/core'

export const NotFoundContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-top: 107px;
    flex: 1 0 auto;
    width: 100%;
    height: calc(100dvh - 160px);
`

export const NotFoundContent = styled(Title)`
    text-align: center;
    white-space: pre-wrap;
`
