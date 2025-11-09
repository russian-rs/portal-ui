import { Box, Card, Checkbox, CloseButton, Flex, Input, Pagination, Skeleton, Table, Text } from "@mantine/core"
import { ApplicationsFilter, PageRequest } from "@russian-rs/portal-api-axios"
import { IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate, useSearchParams } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { allowedRoles } from "src/pages/applications/lib/roles"
import { ApplicationRow } from "src/pages/applications/row/ApplicationRow"
import { CreateUser } from "src/pages/users/createUser/CreateUser"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import { useDesktop, useScreenSize } from "src/shared/hooks/useDesktop"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { hasPermission } from "src/shared/user/roles"
import classes from "./Applications.module.scss"
import { defaultFilter, defaultPage, defaultPageResponse } from "./lib/defaults"
import { locales } from "./lib/locales"

const SkeletonCard = () => (
    <Card shadow="sm" padding="lg" radius="md" withBorder className={classes.mobileCard}>
        <Flex direction="column" gap="md">
            <Flex justify="space-between" align="center">
                <Flex columnGap="sm" align="center">
                    <Skeleton height={40} circle />
                    <Box>
                        <Skeleton height={14} width={120} mb={4} />
                        <Skeleton height={10} width={80} />
                    </Box>
                </Flex>
                <Skeleton height={24} width={24} />
            </Flex>

            <Box style={{ paddingTop: "0.75rem", borderTop: "1px solid var(--mantine-color-gray-2)" }}>
                {[1, 2, 3, 4].map((i) => (
                    <Flex key={i} justify="space-between" align="center" mb="sm">
                        <Skeleton height={10} width={60} />
                        <Skeleton height={10} width={100} />
                    </Flex>
                ))}
            </Box>
        </Flex>
    </Card>
)

export const Applications = () => {
    setDocumentTitleByLocale(locales.title)

    const { user } = useContext(UserContext)
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    // Инициализация состояния из URL параметров
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

    const isDesktop = useDesktop()
    const { shouldShowTable, isLargeDesktop, isMobile } = useScreenSize()

    const [pageRequest, setPageRequest] = useState<PageRequest>({
        ...defaultPage,
        pageNumber: Math.max(0, parseInt(searchParams.get("page") || "1") - 1),
        pageSize: isMobile ? 10 : 25,
    })
    const [filter, setFilter] = useState<ApplicationsFilter>({
        ...defaultFilter,
        showCompleted: searchParams.get("showCompleted") === "true",
    })

    // Ref для скролла к началу списка
    const listStartRef = React.useRef<HTMLDivElement>(null)

    // Функция для синхронизации состояния с URL параметрами
    const syncStateFromUrl = () => {
        const urlSearch = searchParams.get("search") || ""
        const urlShowCompleted = searchParams.get("showCompleted") === "true"
        const urlPageFromUser = parseInt(searchParams.get("page") || "1")
        const urlPage = urlPageFromUser > 0 ? urlPageFromUser - 1 : 0

        setSearchQuery(urlSearch)
        setDebouncedSearch(urlSearch)
        setFilter({ ...filter, showCompleted: urlShowCompleted })
        setPageRequest({ ...pageRequest, pageNumber: urlPage })
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
    const updateUrlParams = (newSearch: string, newShowCompleted: boolean, newPage: number = 0) => {
        const params = new URLSearchParams()

        if (newSearch.trim()) {
            params.set("search", newSearch.trim())
        }

        if (newShowCompleted) {
            params.set("showCompleted", "true")
        }

        if (newPage > 0) {
            const userPageNumber = newPage + 1
            params.set("page", userPageNumber.toString())
        }

        setSearchParams(params)
    }

    // Debounce search input by 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setPageRequest({ ...pageRequest, pageNumber: 0 })
            setDebouncedSearch(searchQuery.trim())
        }, 500)
        return () => clearTimeout(handler)
    }, [searchQuery])

    // Эффект для обновления URL при изменении debouncedSearch
    useEffect(() => {
        updateUrlParams(debouncedSearch, filter.showCompleted, pageRequest.pageNumber || 0)
    }, [debouncedSearch])

    // Эффект для обновления URL при изменении фильтра
    useEffect(() => {
        updateUrlParams(debouncedSearch, filter.showCompleted, 0)
        setPageRequest({ ...pageRequest, pageNumber: 0 })
    }, [filter.showCompleted])

    // Эффект для обновления URL при изменении страницы
    useEffect(() => {
        const pageNumber = pageRequest.pageNumber || 0
        updateUrlParams(debouncedSearch, filter.showCompleted, pageNumber)
    }, [pageRequest.pageNumber])

    // Эффект для обновления размера страницы при изменении типа устройства
    useEffect(() => {
        const newPageSize = isMobile ? 10 : 25
        if (pageRequest.pageSize !== newPageSize) {
            setPageRequest({ ...pageRequest, pageSize: newPageSize, pageNumber: 0 })
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
        queryKey: ["getApplications", debouncedSearch, pageRequest, filter],
        queryFn: () =>
            PrivateApplicationApiService.getApplications(pageRequest, debouncedSearch, filter).then(
                (response) => response.data
            ),
    })

    const rows = content.map((application) => <ApplicationRow key={application.id} applicationDto={application} />)

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />
            <Flex className={classes.root}>
                <Text className={classes.title} variant="gradient">
                    <FormattedMessage id={locales.title} />
                </Text>
                <div ref={listStartRef} />
                <Flex columnGap="8" className={classes.controls}>
                    <Flex align="center" columnGap="8" className={classes.searchGroup}>
                        <Input
                            placeholder={"Поиск по имени или email"}
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.currentTarget.value)}
                            rightSectionPointerEvents="all"
                            size={!isDesktop ? "md" : "sm"}
                            rightSection={
                                <CloseButton
                                    aria-label="Clear input"
                                    onClick={() => setSearchQuery("")}
                                    style={{ display: searchQuery ? undefined : "none" }}
                                />
                            }
                            className={classes.searchInput}
                        />
                        <CreateUser />
                    </Flex>
                    <Checkbox
                        variant="outline"
                        labelPosition={isMobile ? "right" : "left"}
                        label={<FormattedMessage id={locales.showCompleted} />}
                        checked={filter.showCompleted}
                        onChange={() => setFilter({ ...filter, showCompleted: !filter.showCompleted })}
                        size={isMobile ? "md" : "sm"}
                    />
                </Flex>
                {shouldShowTable ? (
                    <Table stickyHeader highlightOnHover className={classes.table}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>
                                    <FormattedMessage
                                        id={isLargeDesktop ? locales.createdAndType : locales.createdShortAndTypeShort}
                                    />
                                </Table.Th>
                                <Table.Th>
                                    <FormattedMessage
                                        id={isLargeDesktop ? locales.nameAndEmail : locales.nameAndEmailShort}
                                    />
                                </Table.Th>
                                <Table.Th>
                                    <FormattedMessage
                                        id={isLargeDesktop ? locales.contractStart : locales.contractStartShort}
                                    />
                                </Table.Th>
                                <Table.Th>
                                    <FormattedMessage id={isLargeDesktop ? locales.status : locales.statusShort} />
                                </Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                ) : (
                    <Flex direction="column" className={classes.mobileList}>
                        {isFetching && content.length === 0 ? (
                            <>
                                {[1, 2, 3].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </>
                        ) : (
                            content.map((application) => (
                                <ApplicationRow key={application.id} applicationDto={application} isMobile={true} />
                            ))
                        )}
                    </Flex>
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
                        <FormattedMessage id={locales.total} values={{ count: page.totalElements }} />
                    </Text>
                </Flex>
            )}
        </Flex>
    )
}

export default Applications
