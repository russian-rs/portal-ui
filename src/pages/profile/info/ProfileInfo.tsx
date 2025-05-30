import { Button, Container, Drawer, Flex, Text, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates"
import { UserInfoDto, UserInfoUpdateRequest } from "@russian-rs/portal-api-axios"
import { IconBrandTelegram, IconPhone, IconHome, IconBuildings, IconGift, IconMail, IconDeviceFloppy, IconPencil } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import { ProfileAvatar } from "src/pages/profile/avatar/ProfileAvatar"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { useForm, zodResolver } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { z } from "zod"
import classes from "./ProfileInfo.module.scss"
import { locales } from "src/pages/users/lib/locales"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { hasPermission, UserGroup } from "src/shared/user/roles"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { Locale } from "src/shared/constants/Locales"
import { ProgramSelectInline } from "../select/ProgramSelect"

interface ProfileInfoProps {
    userInfo: UserInfoDto | undefined
    onUserInfoUpdate?: (userInfo: UserInfoDto) => void
}

export const ProfileInfo = ({ userInfo, onUserInfoUpdate }: ProfileInfoProps) => {
    const { user: currentUser, setUser } = useContext(UserContext)
    const [opened, { open, close }] = useDisclosure(false)
    const intl = useIntl()
    const locale = intl.locale as Locale

    const validationSchema = z.object({
        city: z
            .string()
            .max(100, intl.formatMessage({ id: locales.maxLetters }, { count: 100 }))
            .optional()
            .or(z.literal("")),
        address: z
            .string()
            .max(200, intl.formatMessage({ id: locales.maxLetters }, { count: 200 }))
            .optional()
            .or(z.literal("")),
        birthDate: z
            .string()
            .refine((val) => {
                const date = dayjs(val, "YYYY-MM-DD", true)
                return date.isValid() &&
                       date.isBefore(dayjs()) &&
                       date.isAfter(dayjs().subtract(120, "years"))
            }, intl.formatMessage({ id: "pages.profile.validation.invalidBirthDate" }))
            .refine((val) => {
                const date = dayjs(val, "YYYY-MM-DD", true)
                return date.isBefore(dayjs().subtract(18, "years"))
            }, intl.formatMessage({ id: "pages.profile.validation.tooYoung" }))
            .optional()
            .or(z.literal("")),
        telegram: z
            .string()
            .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, intl.formatMessage({ id: "pages.profile.validation.invalidTelegram" }))
            .max(32, intl.formatMessage({ id: locales.maxLetters }, { count: 32 }))
            .optional()
            .or(z.literal("")),
        phone: z
            .string()
            .regex(/^\+?\d{10,15}$/, intl.formatMessage({ id: "pages.profile.validation.invalidPhone" }))
            .optional()
            .or(z.literal("")),
    })

    const form = useForm({
        initialValues: {
            city: userInfo?.city || "",
            address: userInfo?.address || "",
            birthDate: userInfo?.birthDate || "",
            telegram: userInfo?.telegram || "",
            phone: userInfo?.phone || "",
        },
        validate: zodResolver(validationSchema),
    })

    if (!userInfo) return null

    const onClickSave = async () => {
        const formValues = form.values;

        if (form.validate().hasErrors) {
            return;
        }

        const updateData: UserInfoUpdateRequest = {};
        if (formValues.city?.trim()) updateData.city = formValues.city.trim();
        if (formValues.address?.trim()) updateData.address = formValues.address.trim();
        if (formValues.birthDate?.trim()) updateData.birthDate = formValues.birthDate.trim();
        if (formValues.telegram?.trim()) updateData.telegram = formValues.telegram.trim();
        if (formValues.phone?.trim()) updateData.phone = formValues.phone.trim();

        updateProfile(updateData);
    }

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async (data: UserInfoUpdateRequest) => {
            const targetUsername = userInfo.username;

            const response = await UserApiService.updateInfo(targetUsername, data);
            return response.data;
        },
        onSuccess: async (data) => {
            if (userInfo?.username === currentUser?.username) {
                setUser(data);
            }

            if (onUserInfoUpdate) {
                onUserInfoUpdate(data);
            }

            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.profileUpdated" />
                    </Text>,
                    null
                )
            );
            close();
        },
        onError: () => {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.updateError" />
                    </Text>
                )
            );
        }
    });

    const { mutate: updateProgram } = useMutation({
        mutationFn: async (program: string) => {
            const response = await UserApiService.setProgram(userInfo.id, program);
            return response.data;
        },
        onSuccess: async (data) => {
            if (userInfo?.username === currentUser?.username) {
                setUser(data);
            }

            if (onUserInfoUpdate) {
                onUserInfoUpdate(data);
            }

            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.profileUpdated" />
                    </Text>,
                    null
                )
            );
        },
        onError: () => {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.updateError" />
                    </Text>
                )
            );
        }
    });

    const iconTelegram = <IconBrandTelegram size={16} />
    const iconPhone = <IconPhone size={16} />
    const iconHome = <IconHome size={16} />
    const iconCity = <IconBuildings size={16} />
    const iconBirthday = <IconGift size={16} />

    const programValue = userInfo?.program?.code || null
    
    // Админы могут редактировать программы всем (включая себя)
    // Обычные пользователи могут установить программу только если у них ее еще нет
    const isAdmin = hasPermission(currentUser, [UserGroup.ADMIN_SSO, UserGroup.ADMIN_VOLUNTEER])
    const isOwnProfile = userInfo?.id === currentUser?.id
    const hasProgram = !!programValue
    
    const canEditProgram = isAdmin || (isOwnProfile && !hasProgram)

    const handleProgramChange = (value: string | null) => {
        if (value) {
            updateProgram(value)
        }
    }

    return (
        <Flex direction="column" className={classes.infoContainer}>
            <ProfileAvatar link={userInfo?.avatar?.link} editable={currentUser?.username === userInfo?.username} />
            <Text className={classes.userName}>{userInfo?.fullName}</Text>
            <ProgramSelectInline
                value={programValue}
                canEdit={canEditProgram}
                locale={locale}
                onChange={handleProgramChange}
            />
            <Container className={commonClasses.divider} />
            <TextPropertyBox
                name={"pages.profile.props.city"}
                value={userInfo?.city}
                icon={<IconBuildings size={18} />}
                className={classes.propertyBox} />
            <TextPropertyBox
                name={"pages.profile.props.address"}
                value={userInfo?.address}
                icon={<IconHome size={18} />}
                className={classes.propertyBox}
            />
            <TextPropertyBox
                name={"pages.profile.props.birthDate"}
                value={dayjs(userInfo?.birthDate).format("DD MMMM YYYY")}
                icon={<IconGift size={18} />}
                className={classes.propertyBox}
            />
            <Container className={commonClasses.divider} />
            <TextPropertyBox
                name={"pages.profile.props.email"}
                value={userInfo?.email}
                icon={<IconMail size={18}/>}
                href={`mailto:${userInfo?.email}`}
                className={classes.propertyBox}
            />
            <TextPropertyBox
                name={"pages.profile.props.telegram"}
                value={userInfo?.telegram}
                icon={<IconBrandTelegram size={18} />}
                href={`https://t.me/${userInfo?.telegram}`}
                className={classes.propertyBox}
            />
            <TextPropertyBox
                name={"pages.profile.props.phone"}
                value={userInfo?.phone}
                icon={<IconPhone size={18} />}
                className={classes.propertyBox}
            />
            {(userInfo?.id === currentUser?.id || hasPermission(currentUser, [UserGroup.ADMIN_SSO, UserGroup.ADMIN_VOLUNTEER])) && (
                <Button
                    onClick={open}
                    className={classes.button}
                    variant="outline"
                    rightSection={<IconPencil size={14} />}
                >
                    <FormattedMessage id={"pages.profile.buttons.edit"} />
                </Button>
            )}

            <Drawer opened={opened} onClose={close} title={<FormattedMessage id="pages.profile.documentTitle" />}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onClickSave();
                }}>
                    <Flex direction="column" gap="md">
                        <TextInput
                            leftSection={iconCity}
                            label={<FormattedMessage id="pages.profile.props.city" />}
                            {...form.getInputProps('city')}
                        />
                        <TextInput
                            leftSection={iconHome}
                            label={<FormattedMessage id="pages.profile.props.address" />}
                            {...form.getInputProps('address')}
                        />
                        <DateInput
                            leftSection={iconBirthday}
                            valueFormat="DD MMMM YYYY"
                            label={<FormattedMessage id="pages.profile.props.birthDate" />}
                            value={form.values.birthDate ? dayjs(form.values.birthDate).toDate() : null}
                            onChange={(date) => {
                                form.setFieldValue('birthDate', date ? dayjs(date).format("YYYY-MM-DD") : "");
                            }}
                            error={form.errors.birthDate}
                            clearable
                        />
                        <TextInput
                            leftSection={iconTelegram}
                            label={<FormattedMessage id="pages.profile.props.telegram" />}
                            {...form.getInputProps('telegram')}
                        />
                        <TextInput
                            leftSection={iconPhone}
                            label={<FormattedMessage id="pages.profile.props.phone" />}
                            {...form.getInputProps('phone')}
                        />
                        <Button
                            type="submit"
                            loading={isPending}
                            rightSection={<IconDeviceFloppy size={14} />}
                        >
                            <FormattedMessage id="pages.profile.buttons.save" />
                        </Button>
                    </Flex>
                </form>
            </Drawer>
        </Flex>
    )
}
