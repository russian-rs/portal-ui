import styled from "styled-components"
import { Center } from "@mantine/core"

export const CenterContainer = styled(Center)`
    height: 100%;
`

export const StyledImage = styled.img`
    width: 300px;
`

export const CustomLoader = styled.div`
    height: 4px;
    width: 287px;
    --c: no-repeat linear-gradient(#3a64e9 0 0);
    background: var(--c), var(--c), #d7b8fc;
    background-size: 60% 100%;
    animation: l16 3s infinite;
    @keyframes l16 {
        0% {
            background-position:
                -150% 0,
                -150% 0;
        }
        66% {
            background-position:
                250% 0,
                -150% 0;
        }
        100% {
            background-position:
                250% 0,
                250% 0;
        }
    }
`
