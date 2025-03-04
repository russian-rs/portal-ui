import { VolunteerMapDto } from "@russian-rs/portal-api-axios"
import { useQuery } from "@tanstack/react-query"
import L from "leaflet"
import React, { useState } from "react"
import { FormattedMessage, useIntl } from "react-intl"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { MapsApiService } from "src/shared/api/MapsApiService"

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

    const [filteredLocations, setFilteredLocations] = useState<VolunteerMapDto[]>([])
    const [groups, setGroups] = useState<string[]>([])
    const [selectedGroups, setSelectedGroups] = useState<string[]>([])
    const [showPlaygrounds, setShowPlaygrounds] = useState<boolean>(false)

    const { data: playgroundLocations = [] } = useQuery({
        queryKey: ["getVolunteersMap"],
        queryFn: () => MapsApiService.getPlaygroundsMap().then((response) => response.data),
    })

    const { data: locations = [] } = useQuery({
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

    const applyFilters = () => {
        setFilteredLocations(locations.filter((loc) => loc.groups?.some((group) => selectedGroups.includes(group))))
    }

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <MapContainer center={[44.816667, 20.466667]} zoom={10} style={{ flexGrow: 1 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Волонтеры */}
                {filteredLocations.map((loc, index) => (
                    <Marker
                        key={`${loc.email}-${index}`}
                        position={[loc.latitude!!, loc.longitude!!]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <b>{loc.full_name || "Нет данных"}</b>
                            <br />
                            <b>Программа:</b>{" "}
                            {loc.groups?.map((g) => intl.formatMessage({ id: `common.roles.${g}` })).join(", ") ||
                                "Нет данных"}
                            <br />
                            <b>Email:</b> {loc.email}
                            <br />
                            <b>Telegram:</b> {loc.telegram || "Нет данных"}
                            <br />
                            <b>Адрес:</b> {loc.city}, {loc.address}
                        </Popup>
                    </Marker>
                ))}

                {/* Площадки */}
                {showPlaygrounds &&
                    playgroundLocations.map((pg, index) => (
                        <Marker key={`pg-${pg.id}-${index}`} position={[pg.lat!!, pg.lng!!]} icon={playgroundIcon}>
                            <Popup>
                                <div className="popup-content">
                                    <b>📍Площадка📍</b>
                                    <br />
                                    <b>Покрытие:</b> {pg.covering || "Нет данных"}
                                    <br />
                                    <b>Дренаж:</b> {pg.drainage || "Нет данных"}
                                    <br />
                                    <b>Ограждение:</b> {pg.fencing || "Нет данных"}
                                    <br />
                                    <b>Безопасность:</b> {pg.security || "Нет данных"}
                                    <br />
                                    <b>Освещение:</b> {pg.light || "Нет данных"}
                                    <br />
                                    <b>
                                        <a href={pg.url} target="_blank">
                                            Google Maps
                                        </a>
                                    </b>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
            </MapContainer>

            {/* Фильтр площадок (вверху) */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "12px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                }}
            >
                <strong style={{ fontSize: "14px", display: "block", marginBottom: "8px" }}>Фильтр площадок</strong>
                <label style={{ display: "block", fontSize: "14px" }}>
                    <input
                        type="checkbox"
                        checked={showPlaygrounds}
                        onChange={() => setShowPlaygrounds((prev) => !prev)}
                    />{" "}
                    Показывать площадки
                </label>
            </div>

            {/* Фильтр волонтеров (внизу) */}
            <div
                style={{
                    position: "absolute",
                    bottom: "20px",
                    right: "20px",
                    background: "rgba(255, 255, 255, 0.9)",
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    zIndex: 1000,
                    width: "250px",
                }}
            >
                <strong style={{ fontSize: "16px", display: "block", marginBottom: "10px" }}>Фильтры волонтеров</strong>

                {groups.map((group) => (
                    <label key={group} style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                        <input
                            type="checkbox"
                            value={group}
                            checked={selectedGroups.includes(group)}
                            onChange={(e) => {
                                const value = e.target.value
                                setSelectedGroups((prev) =>
                                    prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
                                )
                            }}
                        />{" "}
                        <FormattedMessage id={`common.roles.${group}`} />
                    </label>
                ))}

                {/* Кнопки управления фильтрами */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button
                        onClick={() => {
                            setSelectedGroups(groups)
                            setShowPlaygrounds(true)
                        }}
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: "8px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Выбрать все
                    </button>
                    <button
                        onClick={applyFilters}
                        style={{
                            backgroundColor: "#28a745",
                            color: "#fff",
                            border: "none",
                            padding: "8px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Применить
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MapComponent
