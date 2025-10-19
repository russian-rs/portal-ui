import { Avatar, Badge, Button, CloseButton, Flex, Input, Pagination, Paper, Table, Text } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { ContractDto, PageRequest } from "@russian-rs/portal-api-axios"
import { IconLock, IconPencil, IconPlus, IconUfo } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { defaultFilter, defaultPage, defaultPageResponse } from "src/pages/users/lib/defaults"
import { allowedRoles } from "src/pages/users/lib/roles"
import { UserMenu } from "src/pages/users/userMenu/UserMenu"
import { UserApiService } from "src/shared/api/user/UserApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"

import { notifications } from "@mantine/notifications"
import { useIntl } from "react-intl"
import { ContractDrawer } from "src/pages/profile/contract/ContractDrawer"
import { ProgramSelectInline } from "src/pages/profile/select/ProgramSelect"
import { ProjectSelectInline } from "src/pages/profile/select/ProjectSelect"
import { ErrorNotification } from "src/shared/notifications/ErrorNotification"
import { SuccessNotification } from "src/shared/notifications/SuccessNotification"
import { ProgramFilter, ProjectFilter } from "src/shared/ui/filter"
import { hasPermission, UserGroup } from "src/shared/user/roles"
import { locales } from "./lib/locales"
import classes from "./UserList.module.scss"

export const UserList = () => {
    setDocumentTitleByLocale(locales.title)

    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [searchParams, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(search)
    const [drawerOpened, setDrawerOpened] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
    const [selectedProgram, setSelectedProgram] = useState<string | null>(searchParams.get("program") || null)
    const [selectedProject, setSelectedProject] = useState<string | null>(searchParams.get("project") || null)

    const isMobile = useMediaQuery("(max-width: 1360px)")

    const [filter] = useState(defaultFilter)
    const [pageRequest, setPageRequest] = useState<PageRequest>({
        ...defaultPage,
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: isMobile ? 10 : 25,
    })

    // Ref для скролла к началу списка
    const listStartRef = React.useRef<HTMLDivElement>(null)

    const intl = useIntl()

    useEffect(() => {
        const savedState = localStorage.getItem("userListState")
        const currentSearch = window.location.search

        const isFromProfile = currentSearch === "" || currentSearch === "?"

        if (savedState && isFromProfile && savedState !== currentSearch) {
            localStorage.removeItem("userListState")
            window.history.replaceState(null, "", "/users" + savedState)
            window.location.reload()
        } else if (!isFromProfile) {
            localStorage.removeItem("userListState")
        }
    }, [])

    // Функция для синхронизации состояния с URL параметрами
    const syncStateFromUrl = () => {
        const urlSearch = searchParams.get("search") || ""
        const urlProgram = searchParams.get("program") || null
        const urlProject = searchParams.get("project") || null
        const urlPageFromUser = parseInt(searchParams.get("page") || "1")
        const urlPage = urlPageFromUser > 0 ? urlPageFromUser - 1 : 0

        setSearch(urlSearch)
        setDebouncedSearch(urlSearch)
        setSelectedProgram(urlProgram)
        setSelectedProject(urlProject)
        setPageRequest((prev) => ({ ...prev, pageNumber: urlPage }))
    }

    // Эффект для обработки навигации назад/вперед браузера
    useEffect(() => {
        const handlePopState = () => {
            syncStateFromUrl()
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [searchParams])

    // Функция для обновления URL параметров
    const updateUrlParams = (
        newSearch: string,
        newProgram: string | null,
        newProject: string | null,
        newPage: number = 0
    ) => {
        const params = new URLSearchParams()

        if (newSearch.trim()) {
            params.set("search", newSearch.trim())
        }

        if (newProgram !== null) {
            params.set("program", newProgram)
        }

        if (newProject) {
            params.set("project", newProject)
        }

        if (newPage > 0) {
            const userPageNumber = newPage + 1
            params.set("page", userPageNumber.toString())
        }

        setSearchParams(params)
    }

    const canEditProgram = () => hasPermission(user, [UserGroup.ADMIN_SSO, UserGroup.ADMIN_VOLUNTEER])

    const canEditProject = (targetUserId: number) => {
        // Админы могут редактировать проекты всех пользователей
        // Обычные пользователи могут редактировать только свой проект
        if (hasPermission(user, [UserGroup.ADMIN_SSO, UserGroup.ADMIN_VOLUNTEER])) {
            return true
        }
        return targetUserId === user?.id
    }

    const { mutate: updateUserProgram } = useMutation({
        mutationFn: async ({ userId, program }: { userId: string; program: string }) => {
            const response = await UserApiService.setProgram(parseInt(userId), program)
            return response.data
        },
        onSuccess: () => {
            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.profileUpdated" />
                    </Text>,
                    null
                )
            )
            queryClient.invalidateQueries({ queryKey: ["searchUsers"] })
        },
        onError: () => {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.updateError" />
                    </Text>
                )
            )
        },
    })

    const { mutate: updateUserProject } = useMutation({
        mutationFn: async ({ userId, project }: { userId: string; project: string }) => {
            const response = await UserApiService.setProject(parseInt(userId), project)
            return response.data
        },
        onSuccess: () => {
            notifications.show(
                SuccessNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.profileUpdated" />
                    </Text>,
                    null
                )
            )
            queryClient.invalidateQueries({ queryKey: ["searchUsers"] })
        },
        onError: () => {
            notifications.show(
                ErrorNotification(
                    <Text size="sm">
                        <FormattedMessage id="pages.profile.updateError" />
                    </Text>
                )
            )
        },
    })

    const { mutate: updateContracts } = useMutation({
        mutationFn: async ({ userId, contracts }: { userId: number; contracts: ContractDto[] }) => {
            return UserApiService.updateContracts(userId, contracts)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["searchUsers"] })
        },
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            const trimmedSearch = search.trim()
            const searchChanged = trimmedSearch !== debouncedSearch

            setDebouncedSearch(trimmedSearch)
            if (searchChanged) {
                setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
            }
        }, 500)
        return () => clearTimeout(handler)
    }, [search])

    // Эффект для обновления URL при изменении debouncedSearch
    useEffect(() => {
        updateUrlParams(debouncedSearch, selectedProgram, selectedProject, pageRequest.pageNumber || 0)
    }, [debouncedSearch])

    // Эффект для обновления URL при изменении программы
    useEffect(() => {
        updateUrlParams(debouncedSearch, selectedProgram, selectedProject, pageRequest.pageNumber || 0)
    }, [selectedProgram])

    // Эффект для обновления URL при изменении проектов
    useEffect(() => {
        updateUrlParams(debouncedSearch, selectedProgram, selectedProject, pageRequest.pageNumber || 0)
    }, [selectedProject])

    // Сбрасываем страницу только если программа действительно изменилась пользователем
    const prevProgramRef = React.useRef<string | null>(selectedProgram)
    useEffect(() => {
        if (selectedProgram !== prevProgramRef.current) {
            setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
        }

        prevProgramRef.current = selectedProgram
    }, [selectedProgram])

    // Сбрасываем страницу только если проекты действительно изменились пользователем
    const prevProjectRef = React.useRef<string | null>(selectedProject)
    useEffect(() => {
        if (selectedProject !== prevProjectRef.current) {
            setPageRequest((prev) => ({ ...prev, pageNumber: 0 }))
        }

        prevProjectRef.current = selectedProject
    }, [selectedProject])

    // Эффект для обновления URL при изменении страницы
    useEffect(() => {
        const pageNumber = pageRequest.pageNumber || 0
        updateUrlParams(debouncedSearch, selectedProgram, selectedProject, pageNumber)
    }, [pageRequest.pageNumber])

    // Эффект для обновления размера страницы при изменении типа устройства
    useEffect(() => {
        const newPageSize = isMobile ? 10 : 25
        if (pageRequest.pageSize !== newPageSize) {
            setPageRequest((prev) => ({ ...prev, pageSize: newPageSize }))
        }
    }, [isMobile])

    // Эффект для скролла при смене страницы в мобильной версии
    useEffect(() => {
        if (isMobile && pageRequest.pageNumber !== undefined) {
            if (listStartRef.current) {
                listStartRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        }
    }, [pageRequest.pageNumber, isMobile])

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    const {
        data: { content, page },
        isFetching,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["searchUsers", debouncedSearch, pageRequest, filter, selectedProgram, selectedProject],
        queryFn: () => {
            let project: string | undefined = undefined
            if (selectedProject) {
                if (selectedProject === "NO_PROJECT") {
                    project = "" // Пустая строка для фильтра "без проекта"
                } else {
                    project = selectedProject // Код проекта
                }
            }
            const filterWithProgram = {
                ...filter,
                program: selectedProgram === "NO_PROGRAM" ? "" : selectedProgram,
                project,
            }
            return UserApiService.searchUsers(debouncedSearch, pageRequest, filterWithProgram).then((response) => {
                return response.data
            })
        },
    })

    const rows = content.map((user) => {
        const lastContract =
            Array.isArray(user.contracts) && user.contracts.length > 0
                ? user.contracts.reduce(
                      (max, c) => (new Date(c.endDate) > new Date(max.endDate) ? c : max),
                      user.contracts[0]
                  )
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
                            onClick={() => {
                                localStorage.setItem("userListState", window.location.search)
                                navigate(`/profile/${user.username}`)
                            }}
                        />
                        <Flex direction="column">
                            <Text truncate="end">{user.fullName}</Text>
                            <Text size="sm" c="dimmed" truncate="end">
                                {user.email}
                            </Text>
                        </Flex>
                    </Flex>
                </Table.Td>
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
                    <ProgramSelectInline
                        type="button"
                        value={user.program?.code}
                        canEdit={canEditProgram()}
                        locale={intl.locale}
                        onChange={(program) => {
                            updateUserProgram({ userId: String(user.id), program })
                        }}
                    />
                </Table.Td>
                <Table.Td>
                    <ProjectSelectInline
                        type="button"
                        value={user.project?.code}
                        canEdit={canEditProject(user.id)}
                        locale={intl.locale}
                        onChange={(project) => {
                            updateUserProject({ userId: String(user.id), project })
                        }}
                    />
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
                        fw={lastContract ? undefined : 500}
                    >
                        {lastContract ? (
                            dayjs(lastContract.endDate).format("DD MMM YYYY")
                        ) : (
                            <FormattedMessage id="pages.profile.contract.button" />
                        )}
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

    // Карточки для мобильной версии
    const cards = content.map((user) => {
        const lastContract =
            Array.isArray(user.contracts) && user.contracts.length > 0
                ? user.contracts.reduce(
                      (max, c) => (new Date(c.endDate) > new Date(max.endDate) ? c : max),
                      user.contracts[0]
                  )
                : undefined
        return (
            <Paper key={user.id} shadow="xs" p="sm" className={classes.mobileCard}>
                <Flex align="center" columnGap={12}>
                    <Avatar
                        size={44}
                        src={user.avatar?.link}
                        name={user.fullName}
                        onClick={() => {
                            localStorage.setItem("userListState", window.location.search)
                            navigate(`/profile/${user.username}`)
                        }}
                        className={classes.avatar}
                    />
                    <Flex direction="column" style={{ flex: 1 }}>
                        <Text fw={500} truncate="end">
                            {user.fullName}
                        </Text>
                        <Text size="sm" c="dimmed" truncate="end">
                            {user.email}
                        </Text>
                    </Flex>
                    {!user.active && <IconLock size={16} color="red" />}
                    <UserMenu user={user} />
                </Flex>
                <Flex mt="xs" gap={4} wrap="wrap">
                    {user.groups.map((group) => (
                        <Badge key={group} size="xs" color="blue" variant="light">
                            <FormattedMessage id={`common.roles.${group}`} />
                        </Badge>
                    ))}
                </Flex>
                <Flex mt="xs" direction="column" rowGap={6}>
                    <ProgramSelectInline
                        value={user.program?.code}
                        canEdit={canEditProgram()}
                        locale={intl.locale}
                        onChange={(program) => {
                            updateUserProgram({ userId: String(user.id), program })
                        }}
                    />
                    <ProjectSelectInline
                        value={user.project?.code}
                        canEdit={canEditProject(user.id)}
                        locale={intl.locale}
                        onChange={(project) => {
                            updateUserProject({ userId: String(user.id), project })
                        }}
                    />
                    <Button
                        variant="light"
                        fullWidth
                        color={lastContract ? "blue" : "gray"}
                        rightSection={lastContract ? <IconPencil size={14} /> : <IconPlus size={14} />}
                        onClick={() => {
                            setSelectedUserId(user.id)
                            setDrawerOpened(true)
                        }}
                        size="compact-sm"
                        fw={lastContract ? undefined : 500}
                    >
                        {lastContract ? (
                            dayjs(lastContract.endDate).format("DD MMM YYYY")
                        ) : (
                            <FormattedMessage id="pages.profile.contract.button" />
                        )}
                    </Button>
                </Flex>
            </Paper>
        )
    })

    const selectedUser = selectedUserId ? content.find((u) => u.id === selectedUserId) : null

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />
            <Flex className={classes.root}>
                <Flex className={classes.filters}>
                    <Input
                        placeholder={intl.formatMessage({ id: locales.search })}
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
                    <ProgramFilter value={selectedProgram} onChange={setSelectedProgram} />
                    <ProjectFilter value={selectedProject} onChange={setSelectedProject} />
                </Flex>
                {isMobile ? (
                    <Flex direction="column" rowGap={8} className={classes.mobileList}>
                        {cards}
                    </Flex>
                ) : (
                    <Table stickyHeader highlightOnHover className={classes.table}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className={classes.columnName}>
                                    <FormattedMessage id={locales.fullNameEmail} />
                                </Table.Th>
                                <Table.Th className={classes.columnRoles}>
                                    <FormattedMessage id={locales.roles} />
                                </Table.Th>
                                <Table.Th className={classes.columnProgram}>
                                    <FormattedMessage id={locales.program} />
                                </Table.Th>
                                <Table.Th className={classes.columnProject}>
                                    <FormattedMessage id={locales.project} />
                                </Table.Th>
                                <Table.Th className={classes.columnContractDue}>
                                    <FormattedMessage id={locales.contractDue} />
                                </Table.Th>
                                <Table.Th />
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                )}
                {page.totalElements == 0 && (
                    <Flex className={classes.emptyState}>
                        <IconUfo size={48} />
                        <Text>
                            <FormattedMessage id={locales.empty} />
                        </Text>
                    </Flex>
                )}
            </Flex>
            {page.totalPages > 1 && (
                <Flex className={classes.pagination}>
                    <Pagination
                        total={page.totalPages}
                        value={pageRequest.pageNumber ? pageRequest.pageNumber + 1 : 1}
                        disabled={isFetching}
                        onChange={(newPage) => {
                            const pageNumber = newPage - 1
                            setPageRequest({ ...pageRequest, pageNumber })
                        }}
                        siblings={isMobile ? 0 : 1}
                    />
                    <Text c="dimmed">
                        <FormattedMessage id={locales.total} values={{ total: page.totalElements }} />
                    </Text>
                </Flex>
            )}

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
