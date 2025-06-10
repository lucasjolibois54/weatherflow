'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { useWeather } from '@/context/WeatherContext';
import { useState, useMemo, useEffect } from 'react';
import L from 'leaflet';

// 📍 Emoji pin icon
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
  const [isClient, setIsClient] = useState(false);

  const position = useMemo(
    () => (lat !== null && lon !== null ? [lat, lon] as [number, number] : null),
    [lat, lon]
  );

  // Ensure this component only renders on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/20">
      <MapContainer
        center={position || [20, 0]}
        zoom={position ? 6 : 2}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationClickHandler />
        <MapController />

        {position && <Marker position={position} icon={pinIcon} />}
      </MapContainer>
    </div>
  );
}
