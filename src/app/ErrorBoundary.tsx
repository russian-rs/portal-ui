import { Button, Center, Container, Flex, Text, Title } from "@mantine/core"
import { Component, ReactNode } from "react"
import { FormattedMessage } from "react-intl"

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container>
                    <Center h="100vh">
                        <Flex
                            direction="column"
                            gap="md"
                            justify="center"
                            align="center"
                            style={{
                                textAlign: "center",
                            }}
                        >
                            <Title>
                                <FormattedMessage id="error-boundary.title" />
                            </Title>
                            {/* REVIEW: Don't show the error message to the user if not needed */}
                            <Text>{this.state.error?.message}</Text>
                            <Button onClick={() => window.location.reload()}>
                                <FormattedMessage id="error-boundary.reload-button" />
                            </Button>
                        </Flex>
                    </Center>
                </Container>
            )
        }

        return this.props.children
    }
}
