'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { useWeather } from '@/context/WeatherContext';
import { useState, useMemo, useEffect } from 'react';
import L from 'leaflet';

// Custom 📍 emoji icon
const pinIcon = new L.DivIcon({
    html: '<div style="font-size: 24px;">📍</div>',
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
});

function LocationClickHandler() {
    const { setCoordinates } = useWeather();

    useMapEvents({
        click(e) {
            // When clicking on map, don't pass a city name (will use weather station name)
            setCoordinates(e.latlng.lat, e.latlng.lng);
        },
    });

    return null;
}

function MapController() {
    const { lat, lon } = useWeather();
    const map = useMapEvents({});

    useEffect(() => {
        if (lat !== null && lon !== null) {
            // Smoothly pan to the new location when coordinates change
            map.setView([lat, lon], Math.max(map.getZoom(), 6), {
                animate: true,
                duration: 1,
            });
        }
    }, [lat, lon, map]);

    return null;
}

export default function Map() {
    const { lat, lon } = useWeather();
    const [mapReady, setMapReady] = useState(false);

    const position = useMemo(() => {
        return lat !== null && lon !== null ? [lat, lon] as [number, number] : null;
    }, [lat, lon]);

    return (
        <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/20">
            <MapContainer
                center={position || [20, 0]}
                zoom={position ? 6 : 2}
                style={{ width: '100%', height: '100%' }}
                whenReady={() => setMapReady(true)}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapReady && (
                    <>
                        <LocationClickHandler />
                        <MapController />
                    </>
                )}

                {mapReady && position && (
                    <Marker position={position} icon={pinIcon} />
                )}

            </MapContainer>
        </div>
    );
}