'use client';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
} from 'react-leaflet';
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

function LocationClickHandler({ setClickError }: { setClickError: (msg: string) => void }) {
  const { setCoordinates } = useWeather();

  useMapEvents({
    click: async (e) => {
      setClickError('');

      try {
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );

        if (!res.ok) throw new Error('Failed to reverse geocode');
        const data = await res.json();

        if (!data.length) {
          setClickError('Invalid location. Try a city or populated area.');
          return;
        }

        const { lat, lon, name, state, country } = data[0];
        let displayName = name;
        if (state && state !== name) displayName += `, ${state}`;
        if (country) displayName += `, ${country}`;

        setCoordinates(lat, lon, displayName);
      } catch (err) {
        console.error(err);
        setClickError('Error getting location data.');
      }
    },
  });

  return null;
}

function MapController() {
  const { lat, lon } = useWeather();
  const map = useMapEvents({});

  useEffect(() => {
    if (lat !== null && lon !== null) {
      map.panTo([lat, lon], {
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
  const [clickError, setClickError] = useState('');

  const position = useMemo(
    () =>
      lat !== null && lon !== null ? ([lat, lon] as [number, number]) : null,
    [lat, lon]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/20">
      <MapContainer
        center={position || [20, 0]}
        zoom={position ? 6 : 2}
        style={{ width: '100%', height: '100%' }}
        maxBounds={[
          [-85, -180],
          [85, 180],
        ]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
        />

        <LocationClickHandler setClickError={setClickError} />
        <MapController />

        {position && <Marker position={position} icon={pinIcon} />}
      </MapContainer>

      {clickError && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-red-400 text-center px-2">
          {clickError}
        </div>
      )}
    </div>
  );
}
