import { Button, Drawer, Flex, Loader, Text, TextInput } from "@mantine/core"
import { useForm, zodResolver } from "@mantine/form"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { UserCreateRequest } from "@russian-rs/portal-api-axios"
import { IconAt, IconUser, IconUserPlus } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { defaultCreateRequest, defaultCreateUserFormValues } from "src/pages/users/lib/defaults"
import { locales } from "src/pages/users/lib/locales"
import { UserApiService } from "src/shared/api/UserApiService"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { z } from "zod"
import classes from "./CreateUser.module.scss"

export const CreateUser = () => {
    const intl = useIntl()
    const [opened, { open, close }] = useDisclosure(false)
    const [request, setRequest] = useState<UserCreateRequest>(defaultCreateRequest)

    const requiredMessage = { message: intl.formatMessage({ id: locales.required }) }
    const minMessage = (count: number) => intl.formatMessage({ id: locales.minLetters }, { count: count })
    const maxMessage = (count: number) => intl.formatMessage({ id: locales.maxLetters }, { count: count })
    const validationSchema = z.object({
        firstName: z
            .string(requiredMessage)
            .min(2, minMessage(2))
            .max(50, maxMessage(50))
            .regex(/^[a-zA-Z\s'-]+$/, intl.formatMessage({ id: locales.invalidName })),
        secondName: z
            .string(requiredMessage)
            .min(2, minMessage(2))
            .max(50, maxMessage(50))
            .regex(/^[a-zA-Z\s'-]+$/, intl.formatMessage({ id: locales.invalidName })),
        email: z.string(requiredMessage).email(intl.formatMessage({ id: locales.invalidEmail })),
        username: z
            .string(requiredMessage)
            .min(6, minMessage(6))
            .max(16, maxMessage(16))
            .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, intl.formatMessage({ id: locales.invalidUsername })),
    })

    const form = useForm({
        mode: "uncontrolled",
        validate: zodResolver(validationSchema),
        onValuesChange: (values, previous) => {
            if (values["firstName"] && values["secondName"]) {
                setRequest({ ...request, fullName: `${values["firstName"].trim()} ${values["secondName"].trim()}` })
            }
            if (values["email"]) {
                const email = (values["email"] as string).toLowerCase().trim()
                setRequest({ ...request, email: email })
                if (values["email"] !== previous["email"]) {
                    if (email.includes("@")) {
                        form.setFieldValue("username", email.split("@")[0])
                    } else {
                        form.setFieldValue("username", email)
                    }
                }
            }
            if (values["username"]) {
                setRequest({ ...request, username: (values["username"] as string).toLowerCase().trim() })
            }
        },
    })

    const { isFetching, refetch } = useQuery({
        enabled: false,
        queryKey: ["createUser", request],
        queryFn: () =>
            UserApiService.createUser(request).then((response) => {
                notifications.show(
                    SuccessNotification(
                        <Text size="sm">
                            <FormattedMessage id={locales.userCreatedMessage} />
                        </Text>,
                        null
                    )
                )
                close()
                setRequest(defaultCreateRequest)
                form.setValues(defaultCreateUserFormValues)
            }),
    })

    const onClickCreate = () => {
        if (!form.validate().hasErrors) {
            refetch()
        }
    }

    return (
        <>
            <Drawer opened={opened} onClose={close} title={<FormattedMessage id={locales.newUser} />}>
                <Flex direction="column" rowGap={8}>
                    <Flex columnGap={8}>
                        <TextInput
                            withAsterisk
                            className={classes.name}
                            key={form.key("firstName")}
                            label={<FormattedMessage id={locales.firstName} />}
                            {...form.getInputProps("firstName")}
                        ></TextInput>
                        <TextInput
                            withAsterisk
                            className={classes.lastName}
                            key={form.key("secondName")}
                            label={<FormattedMessage id={locales.lastName} />}
                            {...form.getInputProps("secondName")}
                        ></TextInput>
                    </Flex>
                    <TextInput
                        withAsterisk
                        key={form.key("email")}
                        label={<FormattedMessage id={locales.email} />}
                        leftSection={<IconAt size={16} />}
                        {...form.getInputProps("email")}
                    ></TextInput>
                    <TextInput
                        withAsterisk
                        key={form.key("username")}
                        label={<FormattedMessage id={locales.username} />}
                        leftSection={<IconUser size={16} />}
                        {...form.getInputProps("username")}
                    ></TextInput>
                    <Button
                        disabled={isFetching}
                        rightSection={isFetching ? <Loader size={16} /> : <IconUserPlus size={16} />}
                        onClick={onClickCreate}
                    >
                        <FormattedMessage id={locales.createButton} />
                    </Button>
                </Flex>
            </Drawer>
            <Button variant="transparent" leftSection={<IconUserPlus size={16} />} onClick={open}>
                <FormattedMessage id={locales.newUser} />
            </Button>
        </>
    )
}
