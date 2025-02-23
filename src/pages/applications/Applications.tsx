import { CloseButton, Flex, Input, Pagination, Table, Text } from "@mantine/core"
import { PageRequest } from "@russian-rs/portal-api-axios"
import { IconUfo } from "@tabler/icons-react"
import { useQuery } from "@tanstack/react-query"
import React, { useContext, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { allowedRoles } from "src/pages/applications/lib/roles"
import { ApplicationRow } from "src/pages/applications/row/ApplicationRow"
import { CreateUser } from "src/pages/users/createUser/CreateUser"
import { PrivateApplicationApiService } from "src/shared/api/applications/PrivateApplicationApiService"
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle"
import CustomLoader from "src/shared/ui/loading/CustomLoader"
import { hasPermission } from "src/shared/user/roles"
import classes from "./Applications.module.scss"
import { defaultPage, defaultPageResponse } from "./lib/defaults"
import { locales } from "./lib/locales"

export const Applications = () => {
    setDocumentTitleByLocale(locales.title)

    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)

    const [pageRequest, setPageRequest] = useState<PageRequest>(defaultPage)

    // Debounce search input by 500ms
    useEffect(() => {
        const handler = setTimeout(() => {
            setPageRequest({ ...pageRequest, pageNumber: 0 })
            setDebouncedSearch(searchQuery.trim())
        }, 500)
        return () => clearTimeout(handler)
    }, [searchQuery])

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    const {
        data: { content, page },
        isFetching,
    } = useQuery({
        initialData: { content: [], page: defaultPageResponse },
        queryKey: ["getApplications", debouncedSearch, pageRequest],
        queryFn: () =>
            PrivateApplicationApiService.getApplications(pageRequest, debouncedSearch).then(
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
                <Flex align="center" columnGap="8">
                    <Input
                        placeholder={"Поиск"}
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.currentTarget.value)}
                        rightSectionPointerEvents="all"
                        rightSection={
                            <CloseButton
                                aria-label="Clear input"
                                onClick={() => setSearchQuery("")}
                                style={{ display: searchQuery ? undefined : "none" }}
                            />
                        }
                    />
                    <CreateUser />
                </Flex>
                <Table stickyHeader highlightOnHover className={classes.table}>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>
                                <FormattedMessage id={locales.created} />
                            </Table.Th>
                            <Table.Th>
                                <FormattedMessage id={locales.type} />
                            </Table.Th>
                            <Table.Th>
                                <FormattedMessage id={locales.name} />
                            </Table.Th>
                            <Table.Th>
                                <FormattedMessage id={locales.email} />
                            </Table.Th>
                            <Table.Th>
                                <FormattedMessage id={locales.contractStart} />
                            </Table.Th>
                            <Table.Th>
                                <FormattedMessage id={locales.status} />
                            </Table.Th>
                            <Table.Th></Table.Th>
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
                    <Flex className={classes.paginationArea}>
                        <Pagination
                            className={classes.pagination}
                            total={page.totalPages}
                            value={pageRequest.pageNumber ? pageRequest.pageNumber + 1 : 1}
                            disabled={isFetching}
                            onChange={(page) => setPageRequest({ ...pageRequest, pageNumber: page - 1 })}
                        />
                        <Text c="dimmed">
                            <FormattedMessage id={locales.total} values={{ count: page.totalElements }} />
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    )
}

export default Applications
