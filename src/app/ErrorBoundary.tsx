import { Button, Center, Code, Container, Flex, ScrollArea, Text, Title } from "@mantine/core"
import parse from "html-react-parser"
import { Component, ReactNode } from "react"
import { FormattedMessage, injectIntl, WrappedComponentProps } from "react-intl"

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

    // Метод для перехода на главную
    handleGoHome = () => {
        // Используем href для полного перехода, чтобы очистить память и состояние ошибки
        window.location.href = "/"
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
                                {/* Блок со Stack Trace */}
                                {this.state.error?.stack && (
                                    <ScrollArea h={250} offsetScrollbars>
                                        <Code block color="red.1" c="red.9" style={{ textAlign: "left" }}>
                                            {this.state.error.stack}
                                        </Code>
                                    </ScrollArea>
                                )}
                            </Flex>
                            <Button onClick={this.handleGoHome}>
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
