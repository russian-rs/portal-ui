import { Avatar, CloseButton, Flex, Input, Pagination, Table, Text, Button } from "@mantine/core"
import { ContractDto, PageRequest } from "@russian-rs/portal-api-axios"
import { IconLock, IconUfo, IconPencil, IconPlus } from "@tabler/icons-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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
import { ContractDrawer } from "src/pages/profile/contract/ContractDrawer"

export const UserList = () => {
    setDocumentTitleByLocale(locales.title)

    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [search, setSearch] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [drawerOpened, setDrawerOpened] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

    const [filter] = useState(defaultFilter)
    const [pageRequest, setPageRequest] = useState<PageRequest>(defaultPage)

    const queryClient = useQueryClient()
    const { mutate: updateContracts } = useMutation({
        mutationFn: async ({ userId, contracts }: { userId: number, contracts: ContractDto[] }) => {
            return UserApiService.updateContracts(userId, contracts)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["searchUsers"] })
        },
    })

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

    const rows = content.map((user) => {
        const lastContract = Array.isArray(user.contracts) && user.contracts.length > 0
            ? user.contracts.reduce((max, c) => new Date(c.endDate) > new Date(max.endDate) ? c : max, user.contracts[0])
            : undefined
        return (
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
                <Table.Td>
                    <Button
                        variant="transparent"
                        color={lastContract ? "blue" : "gray"}
                        rightSection={lastContract ? <IconPencil size={14} /> : <IconPlus size={14} />}
                        onClick={() => {
                            setSelectedUserId(user.id)
                            setDrawerOpened(true)
                        }}
                        size="compact-sm"
                    >
                        {lastContract
                            ? dayjs(lastContract.endDate).format("DD MMM YYYY")
                            : <FormattedMessage id="pages.profile.contract.button" />
                        }
                    </Button>
                </Table.Td>
                <Table.Td>
                    <Flex align="center" justify="end">
                        {!user.active && <IconLock size={16} color="red" />}
                        <UserMenu user={user} />
                    </Flex>
                </Table.Td>
            </Table.Tr>
        )
    })

    const selectedUser = selectedUserId ? content.find(u => u.id === selectedUserId) : null

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
            {selectedUser && (
                <ContractDrawer
                    opened={drawerOpened}
                    onClose={() => {
                        setDrawerOpened(false)
                        setSelectedUserId(null)
                    }}
                    onSuccess={() => {
                        setDrawerOpened(false)
                        setSelectedUserId(null)
                        queryClient.invalidateQueries({ queryKey: ["searchUsers"] })
                    }}
                    userId={selectedUser.id}
                    contracts={selectedUser.contracts || []}
                />
            )}
        </Flex>
    )
}

export default UserList
