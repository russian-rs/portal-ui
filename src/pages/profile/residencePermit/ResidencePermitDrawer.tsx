import { Accordion, Button, Drawer, Flex, Text, Group } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import { IconPlus } from "@tabler/icons-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import { updateResidencePermits, deleteResidencePermit } from "src/shared/api/user/UserApiService"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { hasPermission, UserGroup } from "src/shared/user/roles"
import { v4 as uuid } from "uuid"
import { ResidencePermitForm } from "./ResidencePermitForm"
import { ResidencePermitDto } from "./types/residencePermit"
import { FileInfoDto } from "@russian-rs/portal-api-axios"

interface ResidencePermitDrawerProps {
    opened: boolean
    onClose: () => void
    userId: number
    residencePermits: ResidencePermitDto[]
    onSuccess?: () => void
}

export const ResidencePermitDrawer = ({ opened, onClose, userId, residencePermits, onSuccess }: ResidencePermitDrawerProps) => {
    const queryClient = useQueryClient()
    const { user: currentUser } = useContext(UserContext)
    const [localPermits, setLocalPermits] = useState<ResidencePermitDto[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        if (opened) {
            setLocalPermits(residencePermits)
            setEditingId(null)
        }
    }, [opened, residencePermits])

    const isAdmin = hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER])

    const { mutate: savePermits } = useMutation({
        mutationFn: async (updatedPermits: ResidencePermitDto[]) => {
            return updateResidencePermits(userId, updatedPermits)
        },
        onSuccess: () => {
            notifications.show(
                SuccessNotification(<FormattedMessage id="pages.profile.residencePermit.created" />, null)
            )
            queryClient.invalidateQueries({ queryKey: ["getInfo"] })
            if (onSuccess) onSuccess()
            onClose()
        },
        onError: () => {
            notifications.show(
                ErrorNotification(<FormattedMessage id="pages.profile.residencePermit.createError" />)
            )
        },
    })

    const { mutate: deletePermit } = useMutation({
        mutationFn: async (permitId: string) => {
            return deleteResidencePermit(userId, permitId)
        },
        onSuccess: (_, permitId) => {
            setLocalPermits((prev) => prev.filter((p) => p.id !== permitId))
            notifications.show(
                SuccessNotification(<FormattedMessage id="pages.profile.residencePermit.created" />, null)
            )
            queryClient.invalidateQueries({ queryKey: ["getInfo"] })
            if (onSuccess) onSuccess()
        },
        onError: () => {
            notifications.show(
                ErrorNotification(<FormattedMessage id="pages.profile.residencePermit.createError" />)
            )
        },
    })

    const handleAdd = () => {
        const newPermit: ResidencePermitDto = {
            id: uuid(),
            nationality: "",
            registrationNumber: "",
            validUntil: "",
            purposeOfStay: "",
            identityNumber: "",
            issuingDate: "",
            issuingAuthority: "",
            stateOfBirth: "",
            note: "",
            frontSidePhoto: null as unknown as FileInfoDto,
            backSidePhoto: null as unknown as FileInfoDto,
        }
        setLocalPermits([...localPermits, newPermit])
        setEditingId(newPermit.id)
    }

    const handleUpdate = (updatedPermit: ResidencePermitDto) => {
        const newPermits = localPermits.map((p) => (p.id === updatedPermit.id ? updatedPermit : p))
        setLocalPermits(newPermits)
        savePermits(newPermits)
        setEditingId(null)
    }

    const handleDelete = (id: string) => {
        if (isAdmin) {
            const isNew = !residencePermits.find(p => p.id === id);
            if (isNew) {
                setLocalPermits(localPermits.filter(p => p.id !== id));
                setEditingId(null);
            } else {
                deletePermit(id);
            }
        }
    }

    return (
        <Drawer
            opened={opened}
            onClose={onClose}
            title={<FormattedMessage id="pages.profile.residencePermit.add" />}
            position="right"
            size="lg"
        >
            {editingId ? (
                (() => {
                    const permit = localPermits.find((p) => p.id === editingId)
                    if (!permit) return null
                    return (
                        <ResidencePermitForm
                            initialValues={permit}
                            onSubmit={handleUpdate}
                            onDelete={() => handleDelete(permit.id)}
                            canDelete={isAdmin}
                            isNew={!residencePermits.find((p) => p.id === permit.id)}
                            onCancel={() => {
                                const isNew = !residencePermits.find(p => p.id === editingId)
                                if (isNew) {
                                    setLocalPermits(localPermits.filter(p => p.id !== editingId))
                                }
                                setEditingId(null)
                            }}
                        />
                    )
                })()
            ) : (
                <Flex direction="column" gap="md">
                    {localPermits.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">
                            <FormattedMessage id="pages.profile.residencePermit.no-permit" />
                        </Text>
                    ) : (
                        <Accordion variant="contained">
                            {localPermits.map((permit, index) => (
                                <Accordion.Item key={permit.id} value={permit.id}>
                                    <Accordion.Control>
                                        <Group justify="space-between">
                                            <Text fw={500}>
                                                <FormattedMessage
                                                    id="pages.profile.residencePermit.number"
                                                    values={{ number: index + 1 }}
                                                />
                                            </Text>
                                            <Text size="sm" c="dimmed">
                                                {permit.validUntil ? dayjs(permit.validUntil).format("DD.MM.YYYY") : ""}
                                            </Text>
                                        </Group>
                                    </Accordion.Control>
                                    <Accordion.Panel>
                                        <Flex direction="column" gap="xs">
                                            <Text size="sm">
                                                <b><FormattedMessage id="pages.profile.residencePermit.nationality" />:</b> {permit.nationality}
                                            </Text>
                                            <Text size="sm">
                                                <b><FormattedMessage id="pages.profile.residencePermit.purpose-of-stay" />:</b> {permit.purposeOfStay}
                                            </Text>
                                            <Button
                                                variant="light"
                                                size="xs"
                                                onClick={() => setEditingId(permit.id)}
                                                fullWidth
                                                mt="sm"
                                            >
                                                <FormattedMessage id="pages.profile.buttons.edit" />
                                            </Button>
                                        </Flex>
                                    </Accordion.Panel>
                                </Accordion.Item>
                            ))}
                        </Accordion>
                    )}

                    {isAdmin && (
                        <Button
                            leftSection={<IconPlus size={16} />}
                            onClick={handleAdd}
                            variant="outline"
                        >
                            <FormattedMessage id="pages.profile.residencePermit.button" />
                        </Button>
                    )}
                </Flex>
            )}
        </Drawer>
    )
}
