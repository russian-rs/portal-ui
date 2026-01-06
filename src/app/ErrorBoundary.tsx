import { Button, Center, Container, Flex, Text, Title } from "@mantine/core"
import parse from "html-react-parser"
import { Component, ReactNode } from "react"
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl"
import { CopyText } from "src/shared/ui/copyText/CopyText"

interface Props {
    children: ReactNode
}

interface State {
    hasError: boolean
    error?: Error
}

class ErrorBoundaryBase extends Component<Props & WrappedComponentProps, State> {
    constructor(props: Props & WrappedComponentProps) {
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
                            <Flex direction="column" gap="xs" justify="center" align="center">
                                <Text size="sm">
                                    {parse(this.props.intl.formatMessage({ id: "error-boundary.description" }))}
                                </Text>

                                <CopyText style={{ color: "red" }} text={this.state.error?.message ?? "-"} />
                            </Flex>
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

export const ErrorBoundary = injectIntl(ErrorBoundaryBase)
