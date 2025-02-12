import { Avatar, CloseButton, Flex, Input, Pagination, Table, Text } from "@mantine/core"
import { ContractDto, PageRequest } from "@russian-rs/portal-api-axios"
import { IconLock, IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { defaultFilter, defaultPage, defaultPageResponse } from "src/pages/users/lib/defaults"
import { allowedRoles } from "src/pages/users/lib/roles"
import { UserMenu } from "src/pages/users/userMenu/UserMenu"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { openTab } from "src/shared/ui/tabs/WindowFunctions"
import { hasPermission } from "src/shared/user/roles"
import { locales } from "./lib/locales"
import classes from "./UserList.module.scss"

export const UserList = () => {
    setDocumentTitleByLocale(locales.title)

    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(search)

    const [filter] = useState(defaultFilter)
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
        navigate("/unauthorized")
    }

    const {
        data: { content, page },
        isFetching,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["searchUsers", debouncedSearch, pageRequest, filter],
        queryFn: () =>
            UserApiService.searchUsers(debouncedSearch, pageRequest, filter).then((response) => response.data),
    })

    const rows = content.map((user) => (
        <Table.Tr key={user.id}>
            <Table.Td>
                <Flex columnGap={16} align="center" className={classes.columnName}>
                    <Avatar
                        size={36}
                        src={user.avatar?.link}
                        name={user.fullName}
                        className={classes.avatar}
                        onClick={() => openTab(`/profile/${user.username}`)}
                    />
                    <Text truncate="end">{user.fullName}</Text>
                </Flex>
            </Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>
                <Flex align="start" direction="column">
                    {user.groups.map((group) => (
                        <Text key={group} className={classes.role} truncate="end">
                            <FormattedMessage id={`common.roles.${group}`} />
                        </Text>
                    ))}
                </Flex>
            </Table.Td>
            <Table.Td>{getLastContractDate(user.contracts)}</Table.Td>
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
                            <Table.Th className={classes.columnRoles}>
                                <FormattedMessage id={locales.roles} />
                            </Table.Th>
                            <Table.Th className={classes.columnContractDue}>
                                <FormattedMessage id={locales.contractDue} />
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

const getLastContractDate = (contracts: ContractDto[] | undefined): string => {
    if (!contracts || contracts.length < 1) {
        return ""
    }
    const lastContract = contracts.reduce((max, current) => {
        return new Date(current.endDate) > new Date(max.endDate) ? current : max
    }, contracts[0])
    return dayjs(lastContract.endDate).format("DD MMM YYYY")
}

export default UserList
