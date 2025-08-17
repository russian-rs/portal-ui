import { Button, Group, Select, Text, useComputedColorScheme } from "@mantine/core"
import { IconPencil, IconPlus } from "@tabler/icons-react"
import { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { useProjects } from "src/app/providers/ProjectsProvider"
import { getLocalizedName } from "src/shared/utils/getLocalName"

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
            ) : canEdit ? (
                <Button
                    variant="transparent"
                    color={projectObj ? "blue" : "gray"}
                    rightSection={projectObj ? <IconPencil size={14} /> : <IconPlus size={14} />}
                    onClick={() => {
                        setIsEditing(true)
                        setDropdownOpened(true)
                    }}
                    size="sm"
                    fw={projectObj ? undefined : 500}
                >
                    {projectObj ? (
                        getLocalizedName(projectObj, locale)
                    ) : (
                        <FormattedMessage id="pages.profile.selectProject" />
                    )}
                </Button>
            ) : (
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
            )}
        </Group>
    )
}
