// app/m/[eventSlug]/components/CountdownTimer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CountdownTimerProps {
  startTime: string;
  endTime: string;
  timezone: string;
  theme: { primary: string; secondary: string };
  eventSlug: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer({ startTime, endTime, timezone, theme, eventSlug }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [eventStatus, setEventStatus] = useState<'upcoming' | 'ongoing' | 'ended'>('ongoing');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const start = new Date(startTime);
      
      if (now < start) {
        setEventStatus('upcoming');
        const difference = start.getTime() - now.getTime();
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else if (now > end) {
        setEventStatus('ended');
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      } else {
        setEventStatus('ongoing');
        const difference = end.getTime() - now.getTime();
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const getStatusText = () => {
    switch (eventStatus) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'ended':
        return 'Đã kết thúc';
    }
  };

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div 
        className="text-2xl md:text-3xl font-bold rounded-lg p-3 min-w-[60px]"
        style={{ backgroundColor: theme.primary, color: 'white' }}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-sm mt-1 text-gray-600">{label}</div>
    </div>
  );

  return (
    <Card className="mt-6 border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div 
              className="px-3 py-1 rounded-full text-white text-sm font-medium"
              style={{ backgroundColor: theme.primary }}
            >
              {getStatusText()}
            </div>
            <h3 className="text-lg font-semibold">
              {eventStatus === 'upcoming' ? 'Bắt đầu sau:' : 
               eventStatus === 'ongoing' ? 'Kết thúc sau:' : 'Sự kiện đã kết thúc'}
            </h3>
          </div>
          
          {eventStatus !== 'ended' && (
            <div className="flex gap-4">
              <TimeUnit value={timeLeft.days} label="Ngày" />
              <TimeUnit value={timeLeft.hours} label="Giờ" />
              <TimeUnit value={timeLeft.minutes} label="Phút" />
              <TimeUnit value={timeLeft.seconds} label="Giây" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}