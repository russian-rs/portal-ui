import React from "react"
import { Table, Text } from "@mantine/core"
import { FormattedMessage, useIntl } from "react-intl"
import { useQuery } from "@tanstack/react-query"
import type { CityStatistics, CityStatItem } from "@russian-rs/portal-api-axios"
import { StatisticsApiService } from "src/shared/api/StatisticsApiService"
import { Locale } from "src/shared/constants/Locales"
import { locales } from "../lib/locales"
import { CityStatsChart } from "./MintrudCharts"

const TOP_CITIES = 10

export default function CityStats({ year }: { year: number }) {
    const intl = useIntl()

    const { data } = useQuery<CityStatistics>({
        queryKey: ["cityStatistics", year],
        queryFn: () => StatisticsApiService.getCityStatistics(year).then((r) => r.data),
    })

    if (!data) return null

    const fmtInt = (n: number | null | undefined) =>
        new Intl.NumberFormat(intl.locale, { maximumFractionDigits: 0 }).format(Number(n ?? 0))

    const cityName = (item: CityStatItem) => {
        if (!item.code) return intl.formatMessage({ id: locales.cityOther })
        return (intl.locale === Locale.RU ? item.nameCyrillic : item.name) ?? item.name ?? item.code
    }

    // порядок с сервера: count DESC, сводная запись «прочее» последней — не пересортировываем
    const items = data.items ?? []
    const inCitiesCount = items.reduce((sum, item) => sum + (item.count ?? 0), 0)

    const chartData = items
        .filter((item) => item.code)
        .slice(0, TOP_CITIES)
        .map((item) => ({ name: cityName(item), value: item.count ?? 0 }))

    return (
        <>
            <Text mt="lg" fw={600}>
                <FormattedMessage id={locales.cityStats} />
            </Text>

            {items.length === 0 && data.totalCount === 0 ? (
                <Text c="dimmed">
                    <FormattedMessage id={locales.empty} />
                </Text>
            ) : (
                <>
                    <Table withColumnBorders striped highlightOnHover>
                        {items.length > 0 && (
                            <>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>
                                            <FormattedMessage id={locales.city} />
                                        </Table.Th>
                                        <Table.Th ta="right">
                                            <FormattedMessage id={locales.volunteers} />
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {items.map((item) => (
                                        <Table.Tr key={String(item.code ?? "OTHER")}>
                                            <Table.Td>{cityName(item)}</Table.Td>
                                            <Table.Td ta="right">{fmtInt(item.count)}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </>
                        )}
                        <Table.Tfoot>
                            <Table.Tr>
                                <Table.Th>
                                    <FormattedMessage id={locales.byCities} />
                                </Table.Th>
                                <Table.Th ta="right">{fmtInt(inCitiesCount)}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>
                                    <FormattedMessage id={locales.withoutCity} />
                                </Table.Th>
                                <Table.Th ta="right">{fmtInt(data.withoutCityCount)}</Table.Th>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>
                                    <FormattedMessage id={locales.total} />
                                </Table.Th>
                                <Table.Th ta="right">{fmtInt(data.totalCount)}</Table.Th>
                            </Table.Tr>
                        </Table.Tfoot>
                    </Table>

                    <CityStatsChart data={chartData} />
                </>
            )}
        </>
    )
}
