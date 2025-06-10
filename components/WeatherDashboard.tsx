'use client';

import { useWeather } from '@/context/WeatherContext';
import SearchBar from './SearchBar';
import TemperatureToggle from './TemperatureToggle';
import dynamic from 'next/dynamic';

// Dynamically import Map component with no SSR
const Map = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

export default function WeatherDashboard() {
  const { lat, lon, weatherData, searchedCity, loading, error, unit } = useWeather();

  const getDisplayLocation = () => {
    if (searchedCity) {
      return searchedCity; // Use the searched city name with country
    }
    
    if (weatherData) {
      // Fallback to weather station name with country
      let location = weatherData.name;
      if (weatherData.sys?.country) {
        location += `, ${weatherData.sys.country}`;
      }
      return location;
    }
    
    return null;
  };

  const displayLocation = getDisplayLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">WeatherPulse 🌦</h1>
          <p className="text-white/80">Click on the map or search for a city</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <SearchBar />
          <TemperatureToggle />
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

        {/* Weather Info */}
        {loading && (
          <div className="mt-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white/80 mt-2">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="mt-6 bg-red-500/20 backdrop-blur-md p-4 rounded-xl border border-red-400/30">
            <p className="text-red-200 text-center">❌ {error}</p>
          </div>
        )}

        {weatherData && !loading && (
          <div className="mt-6 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Main Weather */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {displayLocation}
                </h2>
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16"
                  />
                  <div>
                    <p className="text-5xl font-bold text-white">
                      {Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
                    </p>
                    <p className="text-white/80 capitalize">
                      {weatherData.weather[0].description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-4 text-white/90">
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Feels like</p>
                  <p className="text-xl font-semibold">
                    {Math.round(weatherData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Humidity</p>
                  <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Wind Speed</p>
                  <p className="text-xl font-semibold">
                    {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}
                  </p>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-white/60 text-sm">Pressure</p>
                  <p className="text-xl font-semibold">{weatherData.main.pressure} hPa</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}