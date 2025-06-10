'use client';

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
  return (
    <div className="flex gap-4 w-full justify-between">
      {days.slice(0, 4).map((day) => {
        const avgTemp = Math.round((day.temp_min + day.temp_max) / 2);

        return (
          <div
            key={day.date}
            className="w-[120px] bg-gradient-to-b from-white/5 to-white/10 border border-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg flex flex-col justify-between"
          >
            {/* Top: Day + Avg Temp */}
            <div className="flex justify-between mb-2 text-sm">
              <span className="font-semibold text-white/90">
                {new Date(day.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                })}
              </span>
              <span className="text-white/60">{avgTemp}°</span>
            </div>

            {/* Weather Icon */}
            <div className="text-3xl mb-2">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.weather}
              />
            </div>

            {/* Bottom: Min + Max */}
            <div className="space-y-1 mt-1 text-xs text-white/60">
              <div>
                Min: <span className="text-white/80">{Math.round(day.temp_min)}°</span>
              </div>
              <div>
                Max: <span className="text-white/80">{Math.round(day.temp_max)}°</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
