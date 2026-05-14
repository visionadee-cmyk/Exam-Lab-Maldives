import { useEffect, useState } from 'react';
import { formatTime } from '../utils/formatters';
import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export function Timer({ seconds, isUrgent = false, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  const isLowTime = timeLeft < 300; // Less than 5 minutes
  const percentage = (timeLeft / seconds) * 100;

  return (
    <div className={cn(
      'flex items-center space-x-2 px-4 py-2 rounded-lg font-mono font-semibold',
      isLowTime ? 'bg-red-100 text-red-700 timer-urgent' : 'bg-gray-100 text-gray-700'
    )}>
      {isLowTime && <AlertCircle className="w-4 h-4 animate-pulse" />}
      <Clock className="w-4 h-4" />
      <span className={cn(
        'text-lg',
        isLowTime && 'font-bold'
      )}>
        {formatTime(timeLeft)}
      </span>
      
      {/* Progress bar */}
      <div className="hidden sm:block w-24 h-2 bg-gray-200 rounded-full overflow-hidden ml-2">
        <div
          className={cn(
            'h-full transition-all duration-1000',
            percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
