import { Button, Container, Drawer, Flex, Loader, Text, TextInput } from "@mantine/core"
import { UserInfoDto, UserInfoUpdateRequest } from "@russian-rs/portal-api-axios"
import { IconBrandTelegram, IconPhone } from "@tabler/icons-react"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { UserContext } from "src/app/providers/UserContext"
import commonClasses from "src/app/styles/private.module.scss"
import { ProfileAvatar } from "src/pages/profile/avatar/ProfileAvatar"
import { TextPropertyBox } from "src/shared/ui/propertyBox/TextPropertyBox"
import { useForm, zodResolver } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { useMutation } from "@tanstack/react-query"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { z } from "zod"
import classes from "./ProfileInfo.module.scss"
import { locales } from "src/pages/users/lib/locales";
import {ErrorNotification} from "src/shared/notifications/ErrorNotification";

interface ProfileInfoProps {
    userInfo: UserInfoDto | undefined
    onUserInfoUpdate?: (userInfo: UserInfoDto) => void
}

export const ProfileInfo = ({ userInfo, onUserInfoUpdate }: ProfileInfoProps) => {
    const { user: currentUser, setUser } = useContext(UserContext)
    const [opened, { open, close }] = useDisclosure(false)
    const intl = useIntl()

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
                return date.isValid() && date.isBefore(dayjs()) && date.isAfter(dayjs().subtract(120, "years"))
            }, {
                message: intl.formatMessage({ id: "pages.profile.validation.invalidBirthDate" })
            })
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

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: (data: UserInfoUpdateRequest) => {
            return UserApiService.updateInfo(userInfo.username, data);
        },
        onSuccess: (response) => {
            const updatedUser = {
                ...userInfo,
                city: response.data.city,
                address: response.data.address,
                birthDate: response.data.birthDate,
                telegram: response.data.telegram,
                phone: response.data.phone
            }

            setUser(updatedUser)

            if (onUserInfoUpdate) {
                onUserInfoUpdate(updatedUser)
            }

            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.profileUpdated" />
                    </Text>,
                    null
                )
            )
            close()
        },
        onError: (error) => {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.updateError" />
                    </Text>
                )
            )
        }
    })

    const onClickSave = () => {
        const formValues = form.values;

        if (form.validate().hasErrors) {
            return;
        }

        const updateData: UserInfoUpdateRequest = {
            city: formValues.city,
            address: formValues.address,
            birthDate: formValues.birthDate,
            telegram: formValues.telegram,
            phone: formValues.phone
        };

        updateProfile(updateData);
    }

    return (
        <Flex direction="column" className={classes.infoContainer}>
            <ProfileAvatar link={userInfo?.avatar?.link} editable={currentUser?.username === userInfo?.username} />
            <Text className={classes.userName}>{userInfo?.fullName}</Text>
            <Text c="dimmed">{userInfo?.program}</Text>
            <Container className={commonClasses.divider} />
            <TextPropertyBox name={"pages.profile.props.city"} value={userInfo?.city} className={classes.propertyBox} />
            <TextPropertyBox
                name={"pages.profile.props.address"}
                value={userInfo?.address}
                className={classes.propertyBox}
            />
            <TextPropertyBox
                name={"pages.profile.props.birthDate"}
                value={dayjs(userInfo?.birthDate).format("DD MMMM YYYY")}
                className={classes.propertyBox}
            />
            <Container className={commonClasses.divider} />
            <TextPropertyBox
                name={"pages.profile.props.email"}
                value={userInfo?.email}
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
            {userInfo?.id === currentUser?.id && (
                <Button onClick={open} className={classes.button} variant="outline">
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
                            label={<FormattedMessage id="pages.profile.props.city" />}
                            {...form.getInputProps('city')}
                        />
                        <TextInput
                            label={<FormattedMessage id="pages.profile.props.address" />}
                            {...form.getInputProps('address')}
                        />
                        <TextInput
                            label={<FormattedMessage id="pages.profile.props.birthDate" />}
                            {...form.getInputProps('birthDate')}
                        />
                        <TextInput
                            label={<FormattedMessage id="pages.profile.props.telegram" />}
                            {...form.getInputProps('telegram')}
                        />
                        <TextInput
                            label={<FormattedMessage id="pages.profile.props.phone" />}
                            {...form.getInputProps('phone')}
                        />
                        <Button type="submit" loading={isPending}>
                            <FormattedMessage id="pages.profile.buttons.save" />
                        </Button>
                    </Flex>
                </form>
            </Drawer>
        </Flex>
    )
}
