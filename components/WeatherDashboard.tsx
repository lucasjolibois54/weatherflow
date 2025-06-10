'use client';

import { useWeather } from '@/context/WeatherContext';
import SearchBar from './SearchBar';
import TemperatureToggle from './TemperatureToggle';
import TodaysWeatherCard from './TodaysWeatherCard';
import NextFourDays from './NextFourDays';
import dynamic from 'next/dynamic';
import Header from './header/Header';

const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

export default function WeatherDashboard() {
  const { lat, lon, weatherData, forecast, searchedCity } = useWeather();

  const getDisplayLocation = () => {
    if (searchedCity) return searchedCity;
    if (weatherData) {
      let location = weatherData.name;
      if (weatherData.sys?.country) location += `, ${weatherData.sys.country}`;
      return location;
    }
    return null;
  };

  const displayLocation = getDisplayLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 p-4">
      <Header />
      <div className="max-w-5xl mx-auto">
        {/* Title & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">WeatherPulse 🌦</h1>
          <p className="text-white/80">Click on the map or search for a city</p>
        </div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
  <div className="flex-1">
    <TodaysWeatherCard />
  </div>
  {forecast && forecast.length > 0 && (
    <div className="flex gap-4 flex-1">
      <NextFourDays days={forecast} />
    </div>
  )}
</div>

        {/* Map */}
        <Map />

        {/* Location Info */}
        <div className="mt-4 text-center">
          {lat && lon ? (
            <p className="text-white/90">
              📍 {displayLocation || `${lat.toFixed(2)}, ${lon.toFixed(2)}`}
            </p>
          ) : (
            <p className="text-white/60">Select a location to see weather information</p>
          )}
        </div>
      </div>
    </div>
  );
}
