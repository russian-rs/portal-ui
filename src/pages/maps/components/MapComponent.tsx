import { Button, Checkbox, Flex, Text } from "@mantine/core"
import { VolunteerMapDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import L from "leaflet"
import React, { useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { MapsApiService } from "src/shared/api/MapsApiService"
import classes from "../Maps.module.scss"

const defaultIcon = new L.Icon({
    iconUrl: "/resources/human.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
})

const playgroundIcon = new L.Icon({
    iconUrl: "/resources/playground.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
})

const MapComponent: React.FC = () => {
    const intl = useIntl()

    const [filteredVolunteers, setFilteredVolunteers] = useState<VolunteerMapDto[]>([])
    const [groups, setGroups] = useState<string[]>([])
    const [selectedGroups, setSelectedGroups] = useState<string[]>([])
    const [showPlaygrounds, setShowPlaygrounds] = useState<boolean>(false)

    const { data: playgrounds = [] } = useQuery({
        queryKey: ["getVolunteersMap"],
        queryFn: () => MapsApiService.getPlaygroundsMap().then((response) => response.data),
    })

    const { data: volunteers = [] } = useQuery({
        queryKey: ["getPlaygroundsMap"],
        queryFn: () =>
            MapsApiService.getVolunteersMap().then((response) => {
                const uniqueGroups = Array.from(new Set(response.data.flatMap((v) => v.groups))).filter(
                    (g) => g != undefined
                )
                setGroups(uniqueGroups)
                return response.data
            }),
    })

    useEffect(() => {
        setFilteredVolunteers(volunteers.filter((v) => v.groups?.some((group) => selectedGroups.includes(group))))
    }, [selectedGroups])

    return (
        <Flex className={classes.mapRoot}>
            <MapContainer center={[44.816667, 20.466667]} zoom={10} className={classes.mapContainer}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Волонтеры */}
                {filteredVolunteers.map((volunteer, index) => (
                    <Marker
                        key={`${volunteer.email}-${index}`}
                        position={[volunteer.latitude!!, volunteer.longitude!!]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <Flex direction="column">
                                <b>{volunteer.full_name || "Нет данных"}</b>
                                <b>Программа:</b>
                                {volunteer.groups
                                    ?.map((g) => intl.formatMessage({ id: `common.roles.${g}` }))
                                    .join(", ") || "Нет данных"}
                                <b>Email:</b> {volunteer.email}
                                <b>Telegram:</b> {volunteer.telegram || "Нет данных"}
                                <b>Адрес:</b> {volunteer.city}, {volunteer.address}
                            </Flex>
                        </Popup>
                    </Marker>
                ))}

                {/* Площадки */}
                {showPlaygrounds &&
                    playgrounds.map((pg, index) => (
                        <Marker key={`pg-${pg.id}-${index}`} position={[pg.lat!!, pg.lng!!]} icon={playgroundIcon}>
                            <Popup>
                                <Flex className="popup-content" direction="column">
                                    <b>📍Площадка📍</b>
                                    <b>Покрытие:</b> {pg.covering || "Нет данных"}
                                    <b>Дренаж:</b> {pg.drainage || "Нет данных"}
                                    <b>Ограждение:</b> {pg.fencing || "Нет данных"}
                                    <b>Безопасность:</b> {pg.security || "Нет данных"}
                                    <b>Освещение:</b> {pg.light || "Нет данных"}
                                    <b>
                                        <a href={pg.url} target="_blank">
                                            Google Maps
                                        </a>
                                    </b>
                                </Flex>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>

            {/* Фильтр площадок (вверху) */}
            <Flex direction="column" className={classes.filterPlaygrounds} gap="sm">
                <Text fw="bold">Фильтр площадок</Text>
                <Checkbox
                    checked={showPlaygrounds}
                    label={"Показывать площадки"}
                    onChange={() => setShowPlaygrounds((prev) => !prev)}
                />
            </Flex>

            {/* Фильтр волонтеров (внизу) */}
            <Flex direction="column" className={classes.filterRoles} gap="sm">
                <Text fw="bold">Фильтры волонтеров</Text>

                <Flex direction="column" gap="xs">
                    {groups.map((group) => (
                        <Checkbox
                            label={<FormattedMessage id={`common.roles.${group}`} />}
                            value={group}
                            checked={selectedGroups.includes(group)}
                            onChange={(e) => {
                                const value = e.target.value
                                setSelectedGroups((prev) =>
                                    prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
                                )
                            }}
                        />
                    ))}
                </Flex>

                {/* Кнопки управления фильтрами */}
                <Button
                    onClick={() => {
                        setSelectedGroups(groups)
                        setShowPlaygrounds(true)
                    }}
                >
                    Выбрать все
                </Button>
            </Flex>
        </Flex>
    )
}

export default MapComponent
