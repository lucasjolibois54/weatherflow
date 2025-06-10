'use client';

import { useWeather } from '@/context/WeatherContext';

export default function TemperatureToggle() {
  const { unit, setUnit } = useWeather();

  return (
    // Toggle between Celsius and Fahrenheit
    <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20">
      <button
        onClick={() => setUnit('metric')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          unit === 'metric'
            ? 'bg-white text-blue-900 shadow-md' // Active state
            : 'text-white hover:bg-white/10'     // Inactive hover
        }`}
      >
        °C
      </button>
      <button
        onClick={() => setUnit('imperial')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          unit === 'imperial'
            ? 'bg-white text-blue-900 shadow-md'
            : 'text-white hover:bg-white/10'
        }`}
      >
        °F
      </button>
    </div>
  );
}
