'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CountdownTimerProps {
  onTimeExpired: () => void;
  durationSeconds?: number;
}

export default function CountdownTimer({
  onTimeExpired,
  durationSeconds = 86400,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeExpired]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      className={`flex items-center justify-center gap-x-2 p-2 rounded-lg ${isExpired ? 'bg-red-100 dark:bg-red-900' : 'bg-slate-100 dark:bg-slate-800'}`}
    >
      <p
        className={`text-sm ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}
      >
        Hết hạn sau
      </p>
      <p
        className={`text-lg font-bold font-mono ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}
      >
        {formatTime(timeLeft)}
      </p>
    </div>
  );
}
