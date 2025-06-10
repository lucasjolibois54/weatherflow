'use client';

import { useEffect, useState } from 'react';
import { useWeather } from '@/context/WeatherContext';

export default function BackgroundVideo() {
  const { searchedCity, weatherData } = useWeather();

  const location = searchedCity || weatherData?.name || '';

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [poster, setPoster] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const fetchVideo = async () => {
      setIsLoaded(false);
      try {
        const res = await fetch(
          `https://api.pexels.com/videos/search?query=${location}&per_page=1`,
          {
            headers: {
              Authorization: process.env.NEXT_PUBLIC_PEXELS_API_KEY!,
            },
          }
        );
        const data = await res.json();
        const video = data.videos?.[0];
        const bestFile =
          video?.video_files?.find((f: any) => f.quality === 'sd') || video?.video_files?.[0];
        const previewImage = video?.image || null;

        setVideoUrl(bestFile?.link || null);
        setPoster(previewImage);
      } catch (err) {
        console.error('Error fetching video:', err);
      }
    };

    fetchVideo();
  }, [location]);

  return (
    <>
      {/* Video */}
      {videoUrl && (
        <video
          key={videoUrl}
          className={`absolute inset-0 w-full h-full z-0 object-cover object-center transition-all duration-700 ease-in-out ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster || undefined}
          onCanPlayThrough={() => setIsLoaded(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* Poster Fallback */}
      {poster && (
        <img
          src={poster}
          alt="Loading preview"
          className={`absolute inset-0 w-full h-full object-cover object-center blur-lg transition-all duration-700 ease-in-out z-0 ${
            isLoaded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />
    </>
  );
}
