'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Current weather structure from OpenWeather API
type WeatherData = {
  name: string;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  weather: Array<{
    description: string;
    main: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: {
    speed: number;
  };
};

// Simplified format for daily forecast
type ForecastDay = {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: string;
  icon: string;
};

// Everything that’s available in the weather context
type WeatherContextType = {
  lat: number;
  lon: number;
  unit: 'metric' | 'imperial';
  weatherData: WeatherData | null;
  forecast: ForecastDay[] | null;
  searchedCity: string;
  loading: boolean;
  error: string;
  setCoordinates: (lat: number, lon: number, cityName?: string) => void;
  setUnit: (unit: 'metric' | 'imperial') => void;
};

// Create the context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Handles all weather logic and makes data available to the rest of the app (wrap)
export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
  // Default location: Copenhagen
  const [lat, setLat] = useState<number>(55.6761);
  const [lon, setLon] = useState<number>(12.5683);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>('Copenhagen, DK');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch weather and forecast data when location or unit changes
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError('');

      try {
        // Get current weather
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        if (!weatherRes.ok) throw new Error('Weather data not found');
        const weather = await weatherRes.json();
        setWeatherData(weather);

        // Get 5-day forecast
        const forecastRes = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        if (!forecastRes.ok) throw new Error('Forecast data not found');
        const rawForecast = await forecastRes.json();

        // Group entries by date
        const grouped: Record<string, any[]> = {};
        rawForecast.list.forEach((entry: any) => {
          const date = entry.dt_txt.split(' ')[0];
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(entry);
        });

        const today = new Date().toISOString().split('T')[0];

        // Pick 4 days (excluding today) and format them
        const forecastDays: ForecastDay[] = Object.entries(grouped)
          .filter(([date]) => date !== today)
          .slice(0, 4)
          .map(([date, entries]) => {
            const temps = entries.map((e) => e.main.temp);
            const icons = entries.map((e) => e.weather[0].icon);
            const descriptions = entries.map((e) => e.weather[0].description);

            return {
              date,
              temp_min: Math.min(...temps),
              temp_max: Math.max(...temps),
              icon: icons[4] || icons[0],
              weather: descriptions[4] || descriptions[0],
            };
          });

        setForecast(forecastDays);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather data');
        setWeatherData(null);
        setForecast(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, unit]);

  // Used when user searches or updates location manually
  const setCoordinates = (newLat: number, newLon: number, cityName?: string) => {
    setLat(newLat);
    setLon(newLon);
    setSearchedCity(cityName || '');
  };

  // Expose all state and functions via context
  return (
    <WeatherContext.Provider
      value={{
        lat,
        lon,
        unit,
        weatherData,
        forecast,
        searchedCity,
        loading,
        error,
        setCoordinates,
        setUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

// Hook for accessing the weather context from any component
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
