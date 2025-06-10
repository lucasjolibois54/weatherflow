'use client';

import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useWeather } from '@/context/WeatherContext';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css';

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
  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="w-full h-[300px] md:h-[400px] mt-4 rounded-xl overflow-hidden">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ width: '100%', height: '100%' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapReady && <LocationClickHandler />}
      </MapContainer>
    </div>
  );
}
