'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type WeatherData = {
  name: string;
  sys: {
    country: string;
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

type WeatherContextType = {
  lat: number | null;
  lon: number | null;
  unit: 'metric' | 'imperial';
  weatherData: WeatherData | null;
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
  const [searchedCity, setSearchedCity] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const fetchWeather = async () => {
        setLoading(true);
        setError('');
        
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
          );
          
          if (!res.ok) {
            throw new Error('Weather data not found');
          }
          
          const data = await res.json();
          setWeatherData(data);
        } catch (err) {
          setError('Failed to fetch weather data');
          console.error(err);
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
    if (cityName) {
      setSearchedCity(cityName);
    } else {
      setSearchedCity(''); // Clear when clicking on map
    }
  };

  return (
    <WeatherContext.Provider value={{ 
      lat, 
      lon, 
      unit, 
      weatherData, 
      searchedCity,
      loading,
      error,
      setCoordinates, 
      setUnit 
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};