'use client';

import { FiMapPin } from 'react-icons/fi';
import SearchInput from './SearchInput';
import TemperatureToggle from '../TemperatureToggle';
import { useWeather } from '@/context/WeatherContext';

export default function Header() {
  const { lat, lon, weatherData, searchedCity } = useWeather();

  const getDisplayLocation = () => {
    if (searchedCity) return searchedCity;
    if (weatherData) {
      let location = weatherData.name;
      if (weatherData.sys?.country) location += `, ${weatherData.sys.country}`;
      return location;
    }
    if (lat !== null && lon !== null) {
      return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
    }
    return 'Unknown location';
  };

  const locationName = getDisplayLocation();

  return (
    <header className="flex justify-between items-center mb-8 gap-4 flex-wrap">
      {/* Left: Location + icon */}
      <div className="flex items-center gap-4 min-w-[200px]">
        <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
          <FiMapPin size={18} className="text-gray-300" />
        </div>
        <h1 className="text-xl font-semibold">{locationName}</h1>
      </div>

      {/* Center: Search + unit toggle */}
      <div className="flex items-center gap-3 mx-auto">
        <SearchInput />
        <TemperatureToggle />
      </div>

      {/* Right: Credit */}
      <div className="text-sm text-white/70 font-light select-none min-w-[200px] text-right">
        Developed by <span className="underline ml-1">Lucas Jolibois</span>
      </div>
    </header>
  );
}
