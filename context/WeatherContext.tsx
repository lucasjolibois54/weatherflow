'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type WeatherData = any; // refine this later

type WeatherContextType = {
  lat: number | null;
  lon: number | null;
  unit: 'metric' | 'imperial';
  weatherData: WeatherData | null;
  setCoordinates: (lat: number, lon: number) => void;
  setUnit: (unit: 'metric' | 'imperial') => void;
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider = ({ children }: { children: React.ReactNode }) => {
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (lat !== null && lon !== null) {
      const fetchWeather = async () => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
        );
        const data = await res.json();
        setWeatherData(data);
      };
      fetchWeather();
    }
  }, [lat, lon, unit]);

  const setCoordinates = (newLat: number, newLon: number) => {
    setLat(newLat);
    setLon(newLon);
  };

  return (
    <WeatherContext.Provider value={{ lat, lon, unit, weatherData, setCoordinates, setUnit }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within WeatherProvider');
  return context;
};
