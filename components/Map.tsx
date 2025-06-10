'use client';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
} from 'react-leaflet';
import { useWeather } from '@/context/WeatherContext';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import Toast from '@/components/Toast';

// Custom pin icon
const pinIcon = new L.DivIcon({
  html: '<div style="font-size: 24px;">📍</div>',
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 24],
});

// Updates weather context when user clicks on map
function LocationClickHandler({ setClickError }: { setClickError: (msg: string) => void }) {
  const { setCoordinates } = useWeather();

  useMapEvents({
    click: async (e) => {
      setClickError('');

      try {
        // Fetch location data using OpenWeather reverse geocoding API
        const res = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );

        if (!res.ok) throw new Error('Failed to reverse geocode');
        const data = await res.json();

        // If no result, inform user that the location is invalid
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

// Moves map view when lat/lon changes
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

// Main interactive map
export default function Map() {
  const { lat, lon } = useWeather();
  const [clickError, setClickError] = useState('');

  const position = lat !== null && lon !== null ? ([lat, lon] as [number, number]) : null;

  return (
    <>
      <div className="relative w-full h-[300px] md:h-[400px] rounded-xl overflow-hidden shadow-lg border border-white/20">
        <MapContainer
          center={position || [20, 0]}
          zoom={position ? 6 : 2}
          minZoom={2}
          maxBounds={[
            [-85, -180],
            [85, 180],
          ]}
          maxBoundsViscosity={1.0}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />

          <LocationClickHandler setClickError={setClickError} />
          <MapController /> {/* Update map view when lat/lon changes */}
          {position && <Marker position={position} icon={pinIcon} />}
        </MapContainer>
      </div>

      {clickError && <Toast message={clickError} />}
    </>
  );
}
