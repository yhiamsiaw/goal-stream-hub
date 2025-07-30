import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownProps {
  targetDate: string;
  targetTime: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = ({ targetDate, targetTime, className }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDateTime = new Date(`${targetDate}T${targetTime}`);
      const now = new Date();
      const difference = targetDateTime.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, targetTime]);

  if (isExpired) {
    return (
      <div className={`flex items-center space-x-2 text-live font-semibold ${className}`}>
        <Clock className="w-4 h-4" />
        <span>Match Started</span>
      </div>
    );
  }

  const formatUnit = (value: number, unit: string) => {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{value.toString().padStart(2, '0')}</div>
        <div className="text-xs text-muted-foreground uppercase">{unit}</div>
      </div>
    );
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
        <Clock className="w-4 h-4" />
        <span>Kick-off in:</span>
      </div>
      
      <div className="flex items-center justify-center space-x-4">
        {timeLeft.days > 0 && (
          <>
            {formatUnit(timeLeft.days, 'days')}
            <div className="text-2xl font-bold text-muted-foreground">:</div>
          </>
        )}
        {formatUnit(timeLeft.hours, 'hrs')}
        <div className="text-2xl font-bold text-muted-foreground">:</div>
        {formatUnit(timeLeft.minutes, 'min')}
        <div className="text-2xl font-bold text-muted-foreground">:</div>
        {formatUnit(timeLeft.seconds, 'sec')}
      </div>
    </div>
  );
};

export default Countdown;