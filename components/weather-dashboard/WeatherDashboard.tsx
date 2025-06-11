'use client';

import { useWeather } from '@/context/WeatherContext';
import TodaysWeatherCard from './dashboard-cards/TodaysWeatherCard';
import NextFourDays from './dashboard-cards/NextFourDays';
import dynamic from 'next/dynamic';
import Header from '../header/Header';
import BackgroundVideo from './dashboard-background/BackgroundVideo';

// Load map dynamically to avoid SSR issues)
const Map = dynamic(() => import('./dashboard-cards/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] md:h-[400px] rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
      <div className="text-white/60">Loading map...</div>
    </div>
  ),
});

export default function WeatherDashboard() {
  const { forecast } = useWeather();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background video layer behind everything */}
      <div className="absolute inset-0 z-0">
        <BackgroundVideo />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 min-h-screen py-10 px-4">
        <Header />
        <div className="max-w-7xl mx-auto">
          {/* Page title and intro */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-white mb-2 mt-16">WeatherFlow 🌦</h1>
            <p className="text-white/80">Click on the map or search for a city</p>
          </div>

          {/* Cards */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-2/5 lg:w-1/3">
              <TodaysWeatherCard />
            </div>
            {forecast && forecast.length > 0 && (
              <div className="w-full md:w-3/5 lg:w-2/3">
                <NextFourDays days={forecast} />
              </div>
            )}
          </div>

          {/* Map */}
          <Map />
        </div>
      </div>
    </div>
  );
}
