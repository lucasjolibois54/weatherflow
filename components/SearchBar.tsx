'use client';

import { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const { setCoordinates } = useWeather();
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!query.trim()) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );
      const data = await res.json();

      if (data.length === 0) {
        setError('City not found');
        return;
      }

      const { lat, lon } = data[0];
      setCoordinates(lat, lon);
      setQuery('');
    } catch (err) {
      console.error(err);
      setError('Error searching location');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto mb-4 flex gap-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search city..."
        className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white backdrop-blur-md outline-none"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
      >
        Search
      </button>
      {error && <p className="text-red-500 mt-2 text-sm absolute left-0">{error}</p>}
    </form>
  );
}
