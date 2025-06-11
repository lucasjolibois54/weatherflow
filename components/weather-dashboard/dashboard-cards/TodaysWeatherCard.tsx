'use client';

import { useWeather } from '@/context/WeatherContext';

type StatProps = { label: string; value: string; alignRight?: boolean };

// Displays a single stat row, optionally aligned right
function Stat({ label, value, alignRight = false }: StatProps) {
  return (
    <div className={`flex ${alignRight ? 'justify-end' : 'justify-start'}`}>
      <span className="mr-1">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

// Converts a UNIX timestamp to a readable time string
function formatTime(unixTimestamp?: number): string {
  if (!unixTimestamp) return '–';
  return new Date(unixTimestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function TodaysWeatherCard() {
  const { weatherData, searchedCity, unit } = useWeather();

  if (!weatherData) return null;

  // Prioritize searched city name, fallback to weatherData name
  const getDisplayLocation = () => {
    if (searchedCity) return searchedCity;
    let location = weatherData.name;
    if (weatherData.sys?.country) location += `, ${weatherData.sys.country}`;
    return location;
  };

  const displayLocation = getDisplayLocation();

// Split stats into two columns: left and right
const leftStats = [
    { label: 'Real Feel', value: `${Math.round(weatherData.main.feels_like)}°${unit === 'metric' ? 'C' : 'F'}` },
    { label: 'Pressure', value: `${weatherData.main.pressure} hPa` },
    { label: 'Sunrise', value: formatTime(weatherData.sys?.sunrise) },
  ];

  const rightStats = [
    { label: 'Wind', value: `${weatherData.wind.speed} ${unit === 'metric' ? 'm/s' : 'mph'}` },
    { label: 'Humidity', value: `${weatherData.main.humidity}%` },
    { label: 'Sunset', value: formatTime(weatherData.sys?.sunset) },
  ];

  return (
    <div className="bg-blue-100/90 text-black p-5 rounded-2xl shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-1 text-sm font-semibold text-gray-700">
        <span>{displayLocation} • Today</span>
      </div>

      {/* Temperature & Icon */}
      <div className="flex items-center justify-between my-3">
        <div className="text-6xl font-bold">
          {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
        </div>
        <div className="text-5xl">
          <img
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
          />
        </div>
      </div>

      {/* Weather stats */}
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
