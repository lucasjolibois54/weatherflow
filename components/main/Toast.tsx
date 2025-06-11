'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message }: { message: string }) {
  const [position, setPosition] = useState<'hidden' | 'up' | 'down'>('hidden');
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Slide up
    timers.push(setTimeout(() => setPosition('up'), 10));

    // Slide down after 3s
    timers.push(setTimeout(() => setPosition('down'), 3000));

    // Unmount after another 2s
    timers.push(setTimeout(() => setShouldRender(false), 5000));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!shouldRender) return null;

  const base =
    'fixed right-4 z-[1000] px-4 py-2 rounded-lg shadow-lg text-white bg-red-500 transform transition-all duration-300';

  const positionClass =
    position === 'up'
      ? 'bottom-4 opacity-100'
      : position === 'down'
      ? 'bottom-[-100px] opacity-0'
      : 'bottom-[-100px] opacity-0';

  return <div className={`${base} ${positionClass}`}>{message}</div>;
}
