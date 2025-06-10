'use client';

import { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const { setCoordinates } = useWeather();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    if (!query.trim()) return;

    setSearching(true);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );

      if (!res.ok) {
        throw new Error('Search failed');
      }

      const data = await res.json();

      if (data.length === 0) {
        setSearchError('City not found. Try a different name.');
        return;
      }

      const location = data[0];
      const { lat, lon, name, country, state } = location;
      
      // Create a display name with city, state (if available), and country
      let displayName = name;
      if (state && state !== name) {
        displayName += `, ${state}`;
      }
      if (country) {
        displayName += `, ${country}`;
      }

      setCoordinates(lat, lon, displayName);
      setQuery('');
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Error searching location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/70 backdrop-blur-md outline-none border border-white/20 focus:border-white/40 transition-colors"
          disabled={searching}
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white px-6 py-2 rounded-xl transition-colors font-medium"
        >
          {searching ? '🔍' : 'Search'}
        </button>
      </form>
      
      {searchError && (
        <p className="text-red-400 mt-2 text-sm text-center">{searchError}</p>
      )}
    </div>
  );
}