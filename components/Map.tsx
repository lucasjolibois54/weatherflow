'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import { useWeather } from '@/context/WeatherContext';
import { useState, useMemo } from 'react';
import L from 'leaflet';

const pinIcon = new L.DivIcon({
  html: '📍',
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

export default function Map() {
  const { lat, lon } = useWeather();
  const [mapReady, setMapReady] = useState(false);

  const position = useMemo(() => {
    return lat !== null && lon !== null ? [lat, lon] as [number, number] : null;
  }, [lat, lon]);

  return (
    <div className="w-full h-[300px] md:h-[400px] mt-4 rounded-xl overflow-hidden">
      <MapContainer
        center={position || [20, 0]}
        zoom={position ? 6 : 2}
        style={{ width: '100%', height: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapReady && <LocationClickHandler />}

        {position && (
          <Marker position={position} icon={pinIcon} />
        )}
      </MapContainer>
    </div>
  );
}
