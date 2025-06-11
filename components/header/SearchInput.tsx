'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useWeather } from '@/context/WeatherContext';
import Toast from '@/components/Toast';

export default function SearchInput() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const { setCoordinates } = useWeather();

  // Handles search form submission and fetches location coordinates
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');

    if (!query.trim()) return;
    setSearching(true);

    try {
      // Fetch coordinates using OpenWeather's geocoding API
      const res = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          query
        )}&limit=1&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`
      );

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();
      if (data.length === 0) {
        setSearchError('Invalid location. Try a city or populated area.');
        return;
      }

      // Format display name (e.g., "Paris, Île-de-France, FR")
      const { lat, lon, name, state, country } = data[0];
      let displayName = name;
      if (state && state !== name) displayName += `, ${state}`;
      if (country) displayName += `, ${country}`;

      // Update global context with new coordinates and name
      setCoordinates(lat, lon, displayName);
      setQuery('');
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Error searching location. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  // Automatically clear error message after 3 seconds
  useEffect(() => {
    if (!searchError) return;
    const timeout = setTimeout(() => setSearchError(''), 3000);
    return () => clearTimeout(timeout);
  }, [searchError]);

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-64 mx-auto">
        <input
          type="text"
          value={query}
          placeholder="Search city..."
          onChange={(e) => setQuery(e.target.value)}
          className="bg-white/5 border border-white/20 w-full pl-4 pr-10 py-2 rounded-full text-sm placeholder-gray-400 focus:outline-none"
          disabled={searching}
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="absolute right-2 top-2.5 text-gray-400 hover:text-white transition cursor-pointer"
        >
          {searching ? '⏳' : <FiSearch />}
        </button>
      </form>

      {/* Show toast if an error occurred during search */}
      {searchError && <Toast message={searchError} />}
    </>
  );
}
