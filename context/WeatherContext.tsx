'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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

type ForecastDay = {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: string;
  icon: string;
};

type WeatherContextType = {
  lat: number | null;
  lon: number | null;
  unit: 'metric' | 'imperial';
  weatherData: WeatherData | null;
  forecast: ForecastDay[] | null;
  searchedCity: string;
  loading: boolean;
  error: string;
  setCoordinates: (lat: number, lon: number, cityName?: string) => void;
  setUnit: (unit: 'metric' | 'imperial') => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[] | null>(null);
  const [searchedCity, setSearchedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const fetchWeather = async () => {
        setLoading(true);
        setError('');

        try {
          // Fetch current weather
          const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
          );

          if (!weatherRes.ok) throw new Error('Weather data not found');
          const weather = await weatherRes.json();
          setWeatherData(weather);

          // Fetch forecast
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
          );

          if (!forecastRes.ok) throw new Error('Forecast data not found');
          const rawForecast = await forecastRes.json();

          const grouped: Record<string, any[]> = {};
          rawForecast.list.forEach((entry: any) => {
            const date = entry.dt_txt.split(' ')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(entry);
          });

          const today = new Date().toISOString().split('T')[0];

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
    }
  }, [lat, lon, unit]);

  const setCoordinates = (newLat: number, newLon: number, cityName?: string) => {
    setLat(newLat);
    setLon(newLon);
    setSearchedCity(cityName || '');
  };

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

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
