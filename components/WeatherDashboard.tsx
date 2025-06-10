'use client';

import { useWeather } from '@/context/WeatherContext';

export default function WeatherDashboard() {
  const { lat, lon, weatherData, unit } = useWeather();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">WeatherPulse 🌦</h1>
      {lat && lon ? (
        <p className="mb-2">Location: {lat.toFixed(2)}, {lon.toFixed(2)}</p>
      ) : (
        <p className="mb-2 text-gray-500">Select a location to begin</p>
      )}
      {weatherData ? (
        <div className="mt-4 bg-white/10 backdrop-blur-md p-4 rounded-xl shadow">
          <p className="text-lg font-medium">
            {weatherData.name} - {weatherData.weather[0].description}
          </p>
          <p className="text-4xl font-bold">
            {Math.round(weatherData.main.temp)}° {unit === 'metric' ? 'C' : 'F'}
          </p>
        </div>
      ) : null}
    </div>
  );
}
