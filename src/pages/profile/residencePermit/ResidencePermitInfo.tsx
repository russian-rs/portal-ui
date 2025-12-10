import { ActionIcon, Button, Center, Flex, Image, Modal, SimpleGrid, Text } from "@mantine/core"
import { ResidencePermitDto, UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconCalendar, IconChevronLeft, IconChevronRight, IconEye, IconId, IconPencil } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import classes from "src/pages/profile/contract/ContractInfo.module.scss"
import { ResidencePermitDrawer } from "src/pages/profile/residencePermit/ResidencePermitDrawer"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { hasPermission, UserGroup } from "src/shared/user/roles"

interface ResidencePermitInfoProps {
    userInfo: UserInfoDto
    residencePermits: ResidencePermitDto[]
    onUpdate: () => void
}

export const ResidencePermitInfo = ({ userInfo, residencePermits, onUpdate }: ResidencePermitInfoProps) => {
    const { user: currentUser } = useContext(UserContext)
    const [drawerOpened, setDrawerOpened] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // При обновлении списка или загрузке находим актуальный ВНЖ
    useEffect(() => {
        if (residencePermits.length > 0) {
            const activeIndex = residencePermits.findIndex((p) => dayjs(p.validUntil).isAfter(dayjs()))
            setCurrentIndex(activeIndex !== -1 ? activeIndex : 0)
        }
    }, [residencePermits])

    const hasPermits = residencePermits.length > 0
    const currentPermit = hasPermits ? residencePermits[currentIndex] : null
    const hasMultiple = residencePermits.length > 1

    const isOwner = userInfo.id === currentUser?.id
    const isAdmin = hasPermission(currentUser, [UserGroup.ADMIN_VOLUNTEER])
    const canEdit = isOwner || isAdmin

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? residencePermits.length - 1 : prev - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === residencePermits.length - 1 ? 0 : prev + 1))
    }

    return (
        <Flex className={classes.root}>
            {!currentPermit ? (
                <>
                    <Text className={classes.title}>
                        <FormattedMessage id="pages.profile.residencePermit.no-permit" />
                    </Text>
                    {canEdit && (
                        <Button variant="light" onClick={() => setDrawerOpened(true)}>
                            <FormattedMessage id="pages.profile.residencePermit.button" />
                        </Button>
                    )}
                </>
            ) : (
                <>
                    <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                        {hasMultiple && (
                            <ActionIcon variant="transparent" color="gray" onClick={handlePrev}>
                                <IconChevronLeft size={20} />
                            </ActionIcon>
                        )}
                        <Text className={classes.title} style={{ textAlign: "center", flex: 1 }}>
                            <FormattedMessage id="pages.profile.residencePermit.title" />
                            {hasMultiple && (
                                <span
                                    style={{
                                        fontSize: "0.8em",
                                        fontWeight: "normal",
                                        marginLeft: "8px",
                                        opacity: 0.7,
                                    }}
                                >
                                    {currentIndex + 1} / {residencePermits.length}
                                </span>
                            )}
                        </Text>
                        {hasMultiple && (
                            <ActionIcon variant="transparent" color="gray" onClick={handleNext}>
                                <IconChevronRight size={20} />
                            </ActionIcon>
                        )}
                    </Flex>

                    <Center>
                        <TextPropertyBox
                            name="pages.profile.residencePermit.registrationNumber.description"
                            icon={<IconId size={14} />}
                            value={currentPermit.registrationNumber}
                            justify="center"
                        />
                    </Center>

                    <SimpleGrid cols={2} w="100%" spacing="xl">
                        <TextPropertyBox
                            name="pages.profile.residencePermit.issuingDate"
                            icon={<IconCalendar size={14} />}
                            value={dayjs(currentPermit.issuingDate).format("DD MMM YYYY")}
                        />
                        <TextPropertyBox
                            name="pages.profile.residencePermit.valid-until"
                            icon={<IconCalendar size={14} />}
                            value={dayjs(currentPermit.validUntil).format("DD MMM YYYY")}
                            justify="flex-end"
                        />
                    </SimpleGrid>

                    <Flex gap="xl" justify="center" mt="xs">
                        <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconEye size={16} />}
                            onClick={() => setPreviewImage(currentPermit.frontSidePhoto?.link || null)}
                        >
                            <FormattedMessage id="pages.profile.residencePermit.frontSidePhoto" />
                        </Button>
                        <Button
                            variant="subtle"
                            size="xs"
                            leftSection={<IconEye size={16} />}
                            onClick={() => setPreviewImage(currentPermit.backSidePhoto?.link || null)}
                        >
                            <FormattedMessage id="pages.profile.residencePermit.backSidePhoto" />
                        </Button>
                    </Flex>

                    <Text className={classes.daysLeft}>
                        <FormattedMessage
                            id="pages.profile.residencePermit.days-left"
                            values={{ count: dayjs(currentPermit.validUntil).diff(new Date(), "day") }}
                        />
                    </Text>
                    {canEdit && (
                        <Button
                            variant="outline"
                            leftSection={<IconPencil size={14} />}
                            onClick={() => setDrawerOpened(true)}
                        >
                            <FormattedMessage id="pages.profile.residencePermit.button" />
                        </Button>
                    )}
                </>
            )}
            <ResidencePermitDrawer
                userId={userInfo.id}
                residencePermits={residencePermits}
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                onSuccess={onUpdate}
            />
            <Modal opened={!!previewImage} onClose={() => setPreviewImage(null)} size="auto" centered>
                {previewImage && <Image src={previewImage} style={{ maxHeight: "80vh" }} />}
            </Modal>
        </Flex>
    )
}
