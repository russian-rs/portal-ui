import { Select, ActionIcon, Text, Group } from "@mantine/core"
import { IconPlus, IconPencil } from "@tabler/icons-react"
import { useState } from "react"
import { useIntl } from "react-intl"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { useProjects } from "src/app/providers/ProjectsProvider"
import { FormattedMessage } from "react-intl"
import { useComputedColorScheme } from "@mantine/core"

export function ProjectSelectInline({
    value,
    canEdit,
    onChange,
    locale,
}: {
    value: string | null | undefined
    canEdit: boolean
    onChange: (project: string) => void
    locale: string
}) {
    const projects = useProjects()
    const intl = useIntl()
    const [isEditing, setIsEditing] = useState(false)
    const [isDropdownOpened, setDropdownOpened] = useState(false)
    const colorScheme = useComputedColorScheme("light")

    const projectOptions = projects.map((project) => ({
        value: project.code,
        label: getLocalizedName(project, locale),
    }))

    const projectObj = projects.find((p) => p.code === value)

    return (
        <Group gap={4} align="center" wrap="nowrap">
            {isEditing ? (
                <Select
                    data={projectOptions}
                    value={value || null}
                    onChange={(val) => {
                        if (val) {
                            onChange(val)
                            setIsEditing(false)
                        }
                    }}
                    onBlur={() => setIsEditing(false)}
                    autoFocus
                    style={{ width: 180 }}
                    placeholder={intl.formatMessage({ id: "pages.profile.selectProject" })}
                    dropdownOpened={isDropdownOpened}
                    onDropdownOpen={() => setDropdownOpened(true)}
                    onDropdownClose={() => setDropdownOpened(false)}
                    searchable
                />
            ) : (
                <>
                    <Text
                        style={{ whiteSpace: "nowrap" }}
                        size="sm"
                        c={
                            projectObj
                                ? undefined
                                : colorScheme === "dark"
                                  ? "var(--mantine-color-gray-light-color)"
                                  : "dimmed"
                        }
                        fw={projectObj ? undefined : 500}
                    >
                        {projectObj ? (
                            getLocalizedName(projectObj, locale)
                        ) : (
                            <FormattedMessage id="pages.profile.selectProject" />
                        )}
                    </Text>
                    {canEdit && (
                        <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => {
                                setIsEditing(true)
                                setDropdownOpened(true)
                            }}
                        >
                            {value ? <IconPencil size={14} /> : <IconPlus size={16} />}
                        </ActionIcon>
                    )}
                </>
            )}
        </Group>
    )
}
