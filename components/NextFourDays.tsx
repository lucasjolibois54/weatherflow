'use client';

import { useWeather } from '@/context/WeatherContext';

type DayForecast = {
  date: string;
  temp_min: number;
  temp_max: number;
  weather: string;
  icon: string;
};

type Props = {
  days: DayForecast[];
};

export default function NextFourDays({ days }: Props) {
  const { unit } = useWeather();
  const unitSymbol = unit === 'metric' ? '°C' : '°F';

  return (
    <div className="h-full overflow-x-auto md:overflow-visible pb-4 sm:pb-0">
      <div className="flex md:grid md:grid-cols-4 gap-4 h-full">
        {days.slice(0, 4).map((day) => {
          // Calculate a rough average temp for display at the top
          const avgTemp = Math.round((day.temp_min + day.temp_max) / 2);

          return (
            <div
              key={day.date}
              className="min-w-[70%] md:min-w-0 bg-gradient-to-b from-white/5 to-white/10 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col justify-between h-full"
            >
              {/* Weekday name and average temp */}
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-semibold text-white/90">
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short', // gives Mon, Tue, etc.
                  })}
                </span>
                <span className="text-white/60">
                  {avgTemp}{unitSymbol}
                </span>
              </div>

              {/* Weather icon */}
              <div className="text-3xl mb-2">
                <img
                  src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                  alt={day.weather}
                />
              </div>

              {/* Min and Max temps */}
              <div className="space-y-1 mt-1 text-xs text-white/60">
                <div>
                  Min: <span className="text-white/80">{Math.round(day.temp_min)}{unitSymbol}</span>
                </div>
                <div>
                  Max: <span className="text-white/80">{Math.round(day.temp_max)}{unitSymbol}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
