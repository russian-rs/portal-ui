import React from "react"
import { FormattedMessage, useIntl } from "react-intl"
import type { Statistics } from "@russian-rs/portal-api-axios"
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    CartesianGrid,
} from "recharts"
import { locales } from "../lib/locales"
import { Text } from "@mantine/core"
import classes from "./MintrudReport.module.scss"

const COLORS = ["#228be6", "#40c057", "#fab005", "#fa5252",
    "#845ef7", "#12b886", "#e8590c", "#868e96", "#82c91e"]

export function VolunteersCharts({ stats }: { stats?: Statistics }) {
    const intl = useIntl()
    if (!stats) return null

    const ageData = [
        {
            name: intl.formatMessage({ id: locales.age15to18, defaultMessage: "15–18" }),
            value: stats.volunteerStatistics?.age15to18Count ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.age18to30, defaultMessage: "18–30" }),
            value: stats.volunteerStatistics?.age18to30Count ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.age30to40, defaultMessage: "30–40" }),
            value: stats.volunteerStatistics?.age30to40Count ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.age40to65, defaultMessage: "40–65" }),
            value: stats.volunteerStatistics?.age40to65Count ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.age65AndAbove, defaultMessage: "65+" }),
            value: stats.volunteerStatistics?.age65AndAboveCount ?? 0,
        },
    ]

    const genderData = [
        {
            name: intl.formatMessage({ id: locales.genderFemale, defaultMessage: "Женщины" }),
            value: stats.volunteerStatistics?.femaleCount ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.genderMale, defaultMessage: "Мужчины" }),
            value: stats.volunteerStatistics?.maleCount ?? 0,
        },
    ]

    const statusData = [
        {
            name: intl.formatMessage({ id: locales.citizens, defaultMessage: "Граждане" }),
            value: stats.volunteerStatistics?.citizensCount ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.foreigners, defaultMessage: "Иностранцы" }),
            value: stats.volunteerStatistics?.foreignersCount ?? 0,
        },
    ]

    const allZero =
        ageData.every((d) => d.value === 0) &&
        genderData.every((d) => d.value === 0) &&
        statusData.every((d) => d.value === 0)
    if (allZero) return null

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ height: 280 }}>
                <Text className={classes.chartTitle} mt="lg" fw={600}>
                    <FormattedMessage id={locales.ageStatsTitle} />
                </Text>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ageData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" interval={0} tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="value">
                            {ageData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ height: 280 }}>
                    <Text className={classes.chartTitle} mt="lg" fw={600}>
                        <FormattedMessage id={locales.genderStatsTitle} />
                    </Text>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={genderData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                            >
                                {genderData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ height: 280 }}>
                    <Text className={classes.chartTitle} mt="lg" fw={600}>
                        <FormattedMessage id={locales.citizenshipStatsTitle} />
                    </Text>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                            >
                                {statusData.map((_, i) => (
                                    <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export function FinalUsersChart({ stats }: { stats?: Statistics }) {
    const intl = useIntl()
    if (!stats) return null

    const data = [
        {
            name: intl.formatMessage({ id: locales.culturalAssets, defaultMessage: "Культурные ценности" }),
            value: stats.finalUsersStatistics?.culturalAssetsCount ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.naturalAssets, defaultMessage: "Природные объекты" }),
            value: stats.finalUsersStatistics?.naturalAssetsCount ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.publicAreas, defaultMessage: "Общественные пространства" }),
            value: stats.finalUsersStatistics?.publicAreasCount ?? 0,
        },
        {
            name: intl.formatMessage({ id: locales.finalOther, defaultMessage: "Другое" }),
            value: stats.finalUsersStatistics?.otherCount ?? 0,
        },
    ]

    if (data.every((d) => d.value === 0)) return null

    return (
        <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={70}
                        outerRadius={110}
                        label
                        paddingAngle={2}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
const CITY_BAR_HEIGHT = 28

export function CityStatsChart({ data }: { data: { name: string; value: number }[] }) {
    if (!data.length) return null

    return (
        <div>
            <Text className={classes.chartTitle} mt="lg" fw={600}>
                <FormattedMessage id={locales.cityStatsTitle} />
            </Text>
            <div style={{ height: data.length * CITY_BAR_HEIGHT + 40 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" allowDecimals={false} />
                        <YAxis type="category" dataKey="name" width={140} interval={0} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" fill={COLORS[0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
