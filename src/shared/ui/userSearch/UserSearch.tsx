import { Avatar, Combobox, Flex, InputBase, Loader, Text, useCombobox } from "@mantine/core"
import { UseFormReturnType } from "@mantine/form"
import { UserInfoDto } from "@russian-rs/portal-api-axios"
import { IconUser } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { UserApiService } from "src/shared/api/UserApiService"
import classes from "./UserSearch.module.scss"

interface UserSearchProps {
    label?: string
    description?: string
    form?: UseFormReturnType<any>
    path?: string
    onUserChange?: (user: UserInfoDto | null) => void
}

export const UserSearch = ({ label, description, form, path, onUserChange }: UserSearchProps) => {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    })

    const [selectedUser, setSelectedUser] = useState<UserInfoDto | null>(null)
    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    // Debounce search input by 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    useEffect(() => {
        console.log(selectedUser)
        if (onUserChange) {
            onUserChange(selectedUser)
        }
        if (form && path) {
            form.setFieldValue(path, selectedUser?.username)
        }
    }, [selectedUser])

    const { data: users = [], isFetching } = useQuery({
        queryKey: ["searchUsers", debouncedSearch],
        queryFn: () => UserApiService.searchUsers(debouncedSearch, {}).then((response) => response.data.content),
    })

    const userMap = new Map(users.map((user) => [user.userId, user]))

    const options = users.map((userDto) => {
        return (
            <Combobox.Option value={userDto.userId} key={userDto.userId}>
                <Flex align="center" columnGap={12}>
                    <Avatar src={userDto.avatar?.link} size="sm" color="initials" name={userDto.fullName} />
                    <Text>{userDto.fullName}</Text>
                </Flex>
            </Combobox.Option>
        )
    })

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(userId) => {
                const user = userMap.get(userId)
                if (user) {
                    setSelectedUser(user)
                    setSearch(user.fullName)
                }
                combobox.closeDropdown()
            }}
        >
            <Combobox.Target>
                <InputBase
                    label={label}
                    description={description}
                    value={search}
                    onChange={(event) => {
                        combobox.openDropdown()
                        combobox.updateSelectedOptionIndex()
                        setSearch(event.currentTarget.value)
                        setSelectedUser(null)
                    }}
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => {
                        if (!selectedUser) {
                            setSearch("")
                        }
                    }}
                    placeholder="Имя Фамилия"
                    rightSectionPointerEvents="none"
                    leftSection={
                        selectedUser ? (
                            <Avatar
                                src={selectedUser.avatar?.link}
                                size={20}
                                color="initials"
                                name={selectedUser.fullName}
                            />
                        ) : (
                            <IconUser size={20} />
                        )
                    }
                    rightSection={isFetching ? <Loader size={20} /> : <Combobox.Chevron />}
                />
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options className={classes.dropdown}>
                    {options.length > 0 ? options : <Combobox.Empty>Ничего не найдено</Combobox.Empty>}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}
