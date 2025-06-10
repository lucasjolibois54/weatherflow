'use client';

import { useWeather } from '@/context/WeatherContext';
import { useEffect, useRef, useState } from 'react';

type StatProps = { label: string; value: string; alignRight?: boolean };

function Stat({ label, value, alignRight = false }: StatProps) {
  return (
    <div className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
      <span className="mr-1">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatTime(unixTimestamp?: number): string {
  if (!unixTimestamp) return '–';
  return new Date(unixTimestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TodaysWeatherCard() {
  const { weatherData, searchedCity, loading, error, unit } = useWeather();
  const [visibleData, setVisibleData] = useState(weatherData);
  const prevData = useRef(weatherData);

  useEffect(() => {
    if (!loading && weatherData && weatherData !== prevData.current) {
      setVisibleData(weatherData);
      prevData.current = weatherData;
    }
  }, [weatherData, loading]);

  const getDisplayLocation = () => {
    if (searchedCity) return searchedCity;
    if (visibleData) {
      let location = visibleData.name;
      if (visibleData.sys?.country) location += `, ${visibleData.sys.country}`;
      return location;
    }
    return null;
  };

  const displayLocation = getDisplayLocation();

  if (error) {
    return (
      <div className="w-7xl mx-auto">
        <div className="mt-6 bg-red-500/20 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
          <p className="text-red-200 text-center">❌ {error}</p>
        </div>
      </div>
    );
  }

  if (!visibleData) return null;

  const leftStats = [
    { label: 'Real Feel', value: `${Math.round(visibleData.main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}` },
    { label: 'Pressure', value: `${visibleData.main.pressure} hPa` },
    { label: 'Sunrise', value: formatTime(visibleData.sys?.sunrise) },
  ];

  const rightStats = [
    { label: 'Wind', value: `${visibleData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}` },
    { label: 'Humidity', value: `${visibleData.main.humidity}%` },
    { label: 'Sunset', value: formatTime(visibleData.sys?.sunset) },
  ];

  return (
    <div className="bg-blue-100/90 text-black p-5 rounded-2xl shadow-lg flex flex-col justify-between">
      <div className="flex justify-between items-center mb-1 text-sm font-semibold text-gray-700">
        <span>{displayLocation} • Today</span>
      </div>

      <div className="flex items-center justify-between my-3">
        <div className="text-6xl font-bold">
          {Math.round(visibleData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
        <div className="text-5xl">
          <img
            src={`https://openweathermap.org/img/wn/${visibleData.weather[0].icon}@2x.png`}
            alt={visibleData.weather[0].description}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-700 mt-2">
        <div className="flex flex-col space-y-1">
          {leftStats.map(({ label, value }) => (
            <Stat key={label} label={label} value={value} />
          ))}
        </div>
        <div className="flex flex-col space-y-1 text-right">
          {rightStats.map(({ label, value }) => (
            <Stat key={label} label={label} value={value} alignRight />
          ))}
        </div>
      </div>
    </div>
  );
}
