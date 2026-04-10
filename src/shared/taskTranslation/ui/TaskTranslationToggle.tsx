import { ActionIcon, Tooltip } from "@mantine/core"
import { IconLanguageHiragana } from "@tabler/icons-react"
import { FormattedMessage, useIntl } from "react-intl"

interface TaskTranslationToggleProps {
    active: boolean
    disabled?: boolean
    onClick: () => void
    className?: string
}

export const TaskTranslationToggle = ({ active, disabled = false, onClick, className }: TaskTranslationToggleProps) => {
    const intl = useIntl()
    const labelId = active
        ? "pages.report.task-translation-toggle-default"
        : "pages.report.task-translation-toggle-sr"

    return (
        <Tooltip label={<FormattedMessage id={labelId} />}>
            <ActionIcon
                variant="light"
                size="sm"
                color={active ? "blue" : "gray"}
                className={className}
                aria-label={intl.formatMessage({ id: labelId })}
                disabled={disabled}
                onClick={onClick}
            >
                <IconLanguageHiragana size={16} />
            </ActionIcon>
        </Tooltip>
    )
}
