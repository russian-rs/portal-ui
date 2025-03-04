import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";


interface Location {
    city: string;
    address: string;
    full_name: string;
    email: string;
    telegram: string;
    groups: string[];
    latitude: number;
    longitude: number;
}

interface Playground {
    data_id: string;
    url_adress: string;
    date: string;
    photo: string;
    pokritie: string;
    drenaj: string;
    ograjdenie: string;
    security: string;
    light: string;
    lat: number;
    lng: number;
}

const groupNames: Record<string, string> = {
    "MAIN_VOLUNTEER": "Основное волонтерство",
    "INSIDE_VOLUNTEER": "Внутреннее волонтерство",
    "ADMIN_VOLUNTEER": "Администрирование волонтеров",
    "SUPPORT_VOLUNTEER": "Поддержка волонтеров",
    "LAWYERS": "Юристы",
    "DEVELOPER": "Разработчики",
    "MEDIA": "Медиа",
    "ADMIN": "Администраторы",
    "GUIDES": "Редакторы гайдов",
    "TEACHER": "Учителя",
    "MEMBER": "Члены организации",
    "SEO_MANAGER": "SEO менеджеры",
};


const defaultIcon = new L.Icon({
    iconUrl: "/resources/human.svg",
    iconSize: [25, 25],
    iconAnchor: [12, 41],
});
const playgroundIcon = new L.Icon({
    iconUrl: "/resources/playground.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
});

const MapComponent: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const [playgroundLocations, setPlaygrounds] = useState<Playground[]>([]);
    const [showPlaygrounds, setShowPlaygrounds] = useState<boolean>(false);

    useEffect(() => {
        axios.get<Location[]>("/maps/volunteers")
            .then(response => {
                console.log("Данные волонтёров:", response.data);
                setLocations(response.data);
                const uniqueGroups = Array.from(new Set(response.data.flatMap(loc => loc.groups)));
                setGroups(uniqueGroups);
            })
            .catch(error => console.error("Ошибка загрузки данных:", error));

        axios.get<Playground[]>('http://localhost:8081/maps/playgrounds')
            .then(response => {
                setPlaygrounds(response.data);
            })
            .catch(error => console.error("Ошибка загрузки площадок:", error));
    }, []);

    const applyFilters = () => {
        setFilteredLocations(locations.filter(loc =>
            loc.groups.some(group => selectedGroups.includes(group))
        ));
    };

    return (
        <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            display: "flex",
            flexDirection: "column",
        }}>
            <MapContainer center={[44.816667, 20.466667]} zoom={10} style={{ flexGrow: 1 }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {/* Волонтеры */}
                {filteredLocations.map((loc, index) => (
                    <Marker
                        key={`${loc.email}-${index}`}
                        position={[loc.latitude, loc.longitude]}
                        icon={defaultIcon}
                    >
                        <Popup>
                            <b>{loc.full_name || "Нет данных"}</b><br />
                            <b>Программа:</b> {loc.groups.map(g => groupNames[g] || g).join(", ") || "Нет данных"}<br />
                            <b>Email:</b> {loc.email}<br />
                            <b>Telegram:</b> {loc.telegram || "Нет данных"}<br />
                            <b>Адрес:</b> {loc.city}, {loc.address}
                        </Popup>
                    </Marker>
                ))}

                {/* Площадки */}
                {showPlaygrounds && playgroundLocations.map((pg, index) => (
                    <Marker key={`pg-${pg.data_id}-${index}`} position={[pg.lat, pg.lng]} icon={playgroundIcon}>
                        <Popup>
                            <div className="popup-content">
                                <b>📍Площадка📍</b><br />
                                <b>Покрытие:</b> {pg.pokritie || "Нет данных"}<br />
                                <b>Дренаж:</b> {pg.drenaj || "Нет данных"}<br />
                                <b>Ограждение:</b> {pg.ograjdenie || "Нет данных"}<br />
                                <b>Безопасность:</b> {pg.security || "Нет данных"}<br />
                                <b>Освещение:</b> {pg.light || "Нет данных"}<br />
                                <b><a href={pg.url_adress} target="_blank">Google Maps</a></b>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Фильтр площадок (вверху) */}
            <div style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                zIndex: 1000
            }}>
                <strong style={{ fontSize: "14px", display: "block", marginBottom: "8px" }}>Фильтр площадок</strong>
                <label style={{ display: "block", fontSize: "14px" }}>
                    <input
                        type="checkbox"
                        checked={showPlaygrounds}
                        onChange={() => setShowPlaygrounds(prev => !prev)}
                    /> Показывать площадки
                </label>
            </div>

            {/* Фильтр волонтеров (внизу) */}
            <div style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "15px",
                borderRadius: "12px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1000,
                width: "250px"
            }}>
                <strong style={{ fontSize: "16px", display: "block", marginBottom: "10px" }}>Фильтры волонтеров</strong>

                {groups.map(group => (
                    <label key={group} style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
                        <input
                            type="checkbox"
                            value={group}
                            checked={selectedGroups.includes(group)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setSelectedGroups(prev =>
                                    prev.includes(value) ? prev.filter(g => g !== value) : [...prev, value]
                                );
                            }}
                        /> {groupNames[group] || group}
                    </label>
                ))}

                {/* Кнопки управления фильтрами */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button
                        onClick={() => {
                            setSelectedGroups(groups);
                            setShowPlaygrounds(true);
                        }}
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            padding: "8px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px"
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
                            fontSize: "14px"
                        }}
                    >
                        Применить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapComponent;