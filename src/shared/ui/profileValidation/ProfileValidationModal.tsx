import { Button, Modal, Text, Stack, List, ThemeIcon } from "@mantine/core"
import { IconBell, IconCheck } from "@tabler/icons-react"
import { FormattedMessage, useIntl } from "react-intl"
import { useProfileValidation } from "src/app/providers/ProfileValidationProvider"
import { useNavigate } from "react-router"
import { useContext } from "react"
import { UserContext } from "src/app/providers/UserContext"

export const ProfileValidationModal = () => {
    const { missingFields, showProfileModal, setShowProfileModal, openEditProfile } = useProfileValidation()
    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const intl = useIntl()

    const handleClose = () => {
        setShowProfileModal(false)
    }

    const handleEditProfile = () => {
        openEditProfile()
    }

    return (
        <Modal
            opened={showProfileModal}
            onClose={handleClose}
            title={
                <Stack gap={8} align="center">
                    <ThemeIcon size={48} radius="xl" color="blue">
                        <IconBell size={24} />
                    </ThemeIcon>
                    <Text size="lg" fw={600} ta="center">
                        <FormattedMessage id="pages.profile.validation.title" />
                    </Text>
                </Stack>
            }
            centered
            size="md"
            closeOnClickOutside={false}
            closeOnEscape={false}
            withCloseButton={false}
        >
            <Stack gap="md">
                <Text size="sm" c="dimmed" ta="center">
                    <FormattedMessage id="pages.profile.validation.description" />
                </Text>

                <List
                    spacing="xs"
                    size="sm"
                    center
                    icon={
                        <ThemeIcon color="red" size={20} radius="xl">
                            <IconCheck size={12} />
                        </ThemeIcon>
                    }
                >
                    {missingFields.map((field, index) => (
                        <List.Item key={index}>
                            <Text size="sm">{field}</Text>
                        </List.Item>
                    ))}
                </List>

                <Text size="sm" c="dimmed" ta="center">
                    <FormattedMessage id="pages.profile.validation.footer" />
                </Text>

                <Button
                    onClick={handleEditProfile}
                    size="md"
                    fullWidth
                >
                    <FormattedMessage id="pages.profile.validation.goToProfile" />
                </Button>
            </Stack>
        </Modal>
    )
} 