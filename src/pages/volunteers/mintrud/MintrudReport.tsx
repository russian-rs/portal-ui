import React, { useContext, useMemo, useState, useEffect } from "react";
import { Flex, Text, Table, NumberInput, Card, Group, Badge } from "@mantine/core";
import { useIntl, FormattedMessage } from "react-intl";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router";
import { setDocumentTitleByLocale } from "src/shared/hooks/useDocumentTitle";
import { UserContext } from "src/app/providers/UserContext";
import { hasPermission } from "src/shared/user/roles";
import { locales } from "../lib/locales";
import { allowedRoles } from "../lib/roles";
import classes from "src/pages/applications/Applications.module.scss";
import CustomLoader from "src/shared/ui/loading/CustomLoader";
import { StatisticsApiService } from "src/shared/api/StatisticsApiService";
import type { ProgramStatItem, Statistics } from "@russian-rs/portal-api-axios";

export default function MintrudReport() {
    setDocumentTitleByLocale(locales.titleMintrud);

    const intl = useIntl();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized");
    }

    // год берём из query-параметра ?year=YYYY, по умолчанию — текущий
    const [searchParams, setSearchParams] = useSearchParams();
    const currentYear = new Date().getFullYear();
    const urlYear = parseInt(searchParams.get("year") || String(currentYear), 10);
    const [year, setYear] = useState<number>(isNaN(urlYear) ? currentYear : urlYear);

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set("year", String(year));
        setSearchParams(params, { replace: true });
    }, [year]);


    const { data: stats, isFetching } = useQuery<Statistics>({
        queryKey: ["mintrudStatistics", year],
        queryFn: () => StatisticsApiService.getStatistics(year).then((r) => r.data),
    });


    const totalVolunteers = useMemo(() => {
        const v = stats?.volunteerStatistics;
        return (v?.femaleCount ?? 0) + (v?.maleCount ?? 0);
    }, [stats]);

    const totalHours = useMemo(
        () => stats?.programStatistics?.total?.totalTimeSpent ?? 0,
        [stats]
    );

    const programItems: ProgramStatItem[] = useMemo(() => {
        const items = stats?.programStatistics?.items ?? [];
        // сортируем по количеству волонтеров (desc)
        return [...items].sort(
            (a, b) => (b.data.count ?? 0) - (a.data.count ?? 0)
        );
    }, [stats]);

    const empty = !isFetching && !stats;

    return (
        <Flex direction="column">
            <CustomLoader visible={isFetching} className={classes.loader} />

            <Flex className={classes.root} direction="column" gap={16}>
                <Text className={classes.title} variant="gradient">
                    <FormattedMessage id={locales.titleMintrud} />
                </Text>

                {/* Выбор года */}
                <Group align="center">
                    <Text size="sm" c="dimmed">
                        <FormattedMessage id={locales.yearLabel} />
                    </Text>
                    <NumberInput
                        value={year}
                        onChange={(v) => setYear(Number(v) || currentYear)}
                        min={2023}
                        max={currentYear}
                        step={1}
                        allowDecimal={false}
                        allowNegative={false}
                        w={120}
                    />
                </Group>

                {/* Итоги */}
                <Group mt="xs">
                    <Card withBorder radius="md" p="md">
                        <Text size="xs" c="dimmed">
                            <FormattedMessage id={locales.totalVolunteers} />
                        </Text>
                        <Text fz={28} fw={700}>{totalVolunteers}</Text>
                    </Card>

                    <Card withBorder radius="md" p="md">
                        <Text size="xs" c="dimmed">
                            <FormattedMessage id={locales.totalHours} />
                        </Text>
                        <Text fz={28} fw={700}>{totalHours}</Text>
                    </Card>
                </Group>

                {/* Таблица по программам */}
                <Text mt="md" fw={600}>
                    <FormattedMessage id={locales.programStats} />
                </Text>
                <Table withColumnBorders striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th><FormattedMessage id={locales.program} /></Table.Th>
                            <Table.Th ta="right"><FormattedMessage id={locales.volunteers} /></Table.Th>
                            <Table.Th ta="right"><FormattedMessage id={locales.hours} /></Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {programItems.map((item) => (
                            <Table.Tr key={String(item.code)}>
                                <Table.Td>
                                    {item.code ?? <FormattedMessage id={locales.other} />}
                                </Table.Td>
                                <Table.Td ta="right">{item.data.count ?? 0}</Table.Td>
                                <Table.Td ta="right">{item.data.totalTimeSpent ?? 0}</Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>

                {/* Статистика по волонтёрам */}
                <Text mt="lg" fw={600}>
                    <FormattedMessage id={locales.volunteerStats} />
                </Text>
                <Group>
                    <StatBadge
                        labelId={locales.genderFemale}
                        value={stats?.volunteerStatistics?.femaleCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.genderMale}
                        value={stats?.volunteerStatistics?.maleCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.age15to18}
                        value={stats?.volunteerStatistics?.age15to18Count ?? 0}
                    />
                    <StatBadge
                        labelId={locales.age18to30}
                        value={stats?.volunteerStatistics?.age18to30Count ?? 0}
                    />
                    <StatBadge
                        labelId={locales.age30to40}
                        value={stats?.volunteerStatistics?.age30to40Count ?? 0}
                    />
                    <StatBadge
                        labelId={locales.age40to65}
                        value={stats?.volunteerStatistics?.age40to65Count ?? 0}
                    />
                    <StatBadge
                        labelId={locales.age65AndAbove}
                        value={stats?.volunteerStatistics?.age65AndAboveCount ?? 0}
                    />
                </Group>

                {/* Конечные пользователи (Минтруд) */}
                <Text mt="lg" fw={600}>
                    <FormattedMessage id={locales.finalUsersStats} />
                </Text>
                <Group>
                    <StatBadge
                        labelId={locales.culturalAssets}
                        value={stats?.finalUsersStatistics?.culturalAssetsCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.naturalAssets}
                        value={stats?.finalUsersStatistics?.naturalAssetsCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.publicAreas}
                        value={stats?.finalUsersStatistics?.publicAreasCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.finalOther}
                        value={stats?.finalUsersStatistics?.otherCount ?? 0}
                    />
                    <StatBadge
                        labelId={locales.total}
                        value={stats?.finalUsersStatistics?.totalCount ?? 0}
                    />
                </Group>

                {/* Пустое состояние */}
                {empty && (
                    <Flex mt="xl" align="center" justify="center" direction="column" gap={8}>
                        <Text c="dimmed"><FormattedMessage id={locales.empty} /></Text>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
}

function StatBadge({ labelId, value }: { labelId: string; value: number }) {
    return (
        <Badge radius="md" variant="light" size="lg">
            <FormattedMessage id={labelId} />:&nbsp;<b>{value}</b>
        </Badge>
    );
}
