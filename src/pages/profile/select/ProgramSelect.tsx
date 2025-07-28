import { Select, ActionIcon, Text, Group } from "@mantine/core"
import { IconPlus, IconPencil } from "@tabler/icons-react"
import { useState } from "react"
import { useIntl } from "react-intl"
import { getLocalizedName } from "src/shared/utils/getLocalName"
import { usePrograms } from "src/app/providers/ProgramsProvider"
import { FormattedMessage } from "react-intl"
import { useComputedColorScheme } from "@mantine/core"

export function ProgramSelectInline({
  value,
  canEdit,
  onChange,
  locale,
}: {
  value: string | null | undefined
  canEdit: boolean
  onChange: (program: string) => void
  locale: string
}) {
  const programs = usePrograms()
  const intl = useIntl()
  const [isEditing, setIsEditing] = useState(false)
  const [isDropdownOpened, setDropdownOpened] = useState(false)
  const colorScheme = useComputedColorScheme("light")

  const programOptions = programs.map(program => ({
    value: program.code,
    label: getLocalizedName(program, locale),
  }))

  const programObj = programs.find(p => p.code === value)

  return (
    <Group gap={4} align="center" wrap="nowrap">
      {isEditing ? (
        <Select
          data={programOptions}
          value={value || null}
          onChange={val => {
            if (val) {
              onChange(val)
              setIsEditing(false)
            }
          }}
          onBlur={() => setIsEditing(false)}
          autoFocus
          style={{ width: 180 }}
          placeholder={intl.formatMessage({ id: "pages.profile.selectProgram" })}
          dropdownOpened={isDropdownOpened}
          onDropdownOpen={() => setDropdownOpened(true)}
          onDropdownClose={() => setDropdownOpened(false)}
        />
      ) : (
        <>
          <Text style={{ whiteSpace: "nowrap" }} size="sm" c={programObj ? undefined : (colorScheme === "dark" ? "var(--mantine-color-gray-light-color)" : "dimmed")} fw={programObj ? undefined : 500}>
            {programObj ? getLocalizedName(programObj, locale) : (
              <FormattedMessage id="pages.profile.selectProgram" />
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