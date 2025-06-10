'use client';

import { useWeather } from '@/context/WeatherContext';
import Map from './Map';

export default function WeatherDashboard() {
  const { lat, lon, weatherData, unit } = useWeather();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">WeatherPulse 🌦</h1>

      <Map />

      {lat && lon ? (
        <p className="mt-2">Selected Location: {lat.toFixed(2)}, {lon.toFixed(2)}</p>
      ) : (
        <p className="mt-2 text-gray-500">Click anywhere on the map to select a location.</p>
      )}

      {weatherData && (
        <div className="mt-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow">
          <p className="text-lg font-medium">
            {weatherData.name} - {weatherData.weather[0].description}
          </p>
          <p className="text-4xl font-bold">
            {Math.round(weatherData.main.temp)}° {unit === 'metric' ? 'C' : 'F'}
          </p>
        </div>
      )}
    </div>
  );
}
