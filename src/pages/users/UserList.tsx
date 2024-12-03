import { Avatar, CloseButton, Flex, Input, Pagination, Table, Text } from "@mantine/core"
import { PageRequest } from "@russian-rs/portal-api-axios"
import { IconLock, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useHistory } from "react-router-dom"
import { UserContext } from "src/app/providers/UserContext"
import { CreateUser } from "src/pages/users/createUser/CreateUser"
import { defaultPage, defaultPageResponse } from "src/pages/users/lib/defaults"
import { allowedRoles } from "src/pages/users/lib/roles"
import { UserMenu } from "src/pages/users/userMenu/UserMenu"
import { UserApiService } from "src/shared/api/UserApiService"
import { useSetDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { hasPermission } from "src/shared/user/roles"
import { locales } from "./lib/locales"
import classes from "./UserList.module.scss"

export const UserList = () => {
    useSetDocumentTitleByLocale(locales.title)

    const { user } = useContext(UserContext)
    const history = useHistory()

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    const [pageRequest, setPageRequest] = useState<PageRequest>(defaultPage)

    // Debounce search input by 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setPageRequest({ ...pageRequest, pageNumber: 0 })
            setDebouncedSearch(search.trim())
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    if (!hasPermission(user, allowedRoles)) {
        history.push("/unauthorized")
    }

    const {
        data: { content, page },
        isFetching,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["searchUsers", debouncedSearch, pageRequest],
        queryFn: () => UserApiService.searchUsers(debouncedSearch, pageRequest).then((response) => response.data),
    })

    const rows = content.map((user) => (
        <Table.Tr key={user.userId}>
            <Table.Td className={classes.columnName}>
                <Flex columnGap={16} align="center">
                    <Avatar src={user.avatar?.link} size={36} name={user.fullName} />
                    <Text truncate="end">{user.fullName}</Text>
                </Flex>
            </Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>
                <Flex align="center" justify="end">
                    {!user.active && <IconLock size={16} color="red" />}
                    <UserMenu user={user} />
                </Flex>
            </Table.Td>
        </Table.Tr>
    ))

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />
            <Flex className={classes.root}>
                <Flex align="center" columnGap="8">
                    <Input
                        placeholder={"Поиск"}
                        value={search}
                        onChange={(event) => setSearch(event.currentTarget.value)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setSearch("")}
                                style={{ display: search ? undefined : "none" }}
                            />
                        }
                    />
                    <CreateUser />
                </Flex>
                <Table stickyHeader highlightOnHover className={classes.table}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className={classes.columnName}>
                                <FormattedMessage id={locales.fullName} />
                            </Table.Th>
                            <Table.Th className={classes.columnEmail}>
                                <FormattedMessage id={locales.email} />
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
                {page.totalElements == 0 && (
                    <Flex className={classes.emptyState}>
                        <IconUfo size={48} />
                        <Text>
                            <FormattedMessage id={locales.empty} />
                        </Text>
                    </Flex>
                )}
                {page.totalPages > 1 && (
                    <Flex className={classes.pagination}>
                        <Pagination
                            total={page.totalPages}
                            value={pageRequest.pageNumber ? pageRequest.pageNumber + 1 : 1}
                            disabled={isFetching}
                            onChange={(page) => setPageRequest({ ...pageRequest, pageNumber: page - 1 })}
                        />
                        <Text c="dimmed">
                            <FormattedMessage id={locales.total} values={{ total: page.totalElements }} />
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}

export default UserList
