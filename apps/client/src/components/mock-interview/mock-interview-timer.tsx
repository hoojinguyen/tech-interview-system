'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  AlertTriangle, 
  Timer,
  Play,
  Pause
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MockInterviewTimerProps {
  timeRemaining: number; // in minutes
  onTimeUp: () => void;
  isRunning: boolean;
  totalTime?: number; // in minutes, for progress calculation
  showProgress?: boolean;
  compact?: boolean;
}

export function MockInterviewTimer({ 
  timeRemaining: initialTimeRemaining, 
  onTimeUp, 
  isRunning: initialIsRunning,
  totalTime = 60,
  showProgress = true,
  compact = false
}: MockInterviewTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const [isRunning, setIsRunning] = useState(initialIsRunning);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeRemaining(initialTimeRemaining);
    setIsRunning(initialIsRunning);
  }, [initialTimeRemaining, initialIsRunning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, isPaused, timeRemaining, onTimeUp]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeStatus = () => {
    const percentage = (timeRemaining / totalTime) * 100;
    
    if (timeRemaining <= 0) {
      return { status: 'expired', color: 'destructive', icon: AlertTriangle };
    } else if (percentage <= 10) {
      return { status: 'critical', color: 'destructive', icon: AlertTriangle };
    } else if (percentage <= 25) {
      return { status: 'warning', color: 'warning', icon: Timer };
    } else {
      return { status: 'normal', color: 'default', icon: Clock };
    }
  };

  const { status, color, icon: StatusIcon } = getTimeStatus();
  const progressPercentage = Math.max(0, (timeRemaining / totalTime) * 100);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <Badge 
          variant={color === 'destructive' ? 'destructive' : color === 'warning' ? 'secondary' : 'outline'}
          className="flex items-center gap-1"
        >
          <StatusIcon className="h-3 w-3" />
          {formatTime(timeRemaining)}
        </Badge>
        {isRunning && (
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePause}
            className="h-6 w-6 p-0"
          >
            {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="w-64">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Timer Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon className={`h-4 w-4 ${
                status === 'critical' || status === 'expired' 
                  ? 'text-red-500' 
                  : status === 'warning' 
                    ? 'text-yellow-500' 
                    : 'text-blue-500'
              }`} />
              <span className="text-sm font-medium">Time Remaining</span>
            </div>
            {isRunning && (
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePause}
                className="h-6 w-6 p-0"
              >
                {isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              </Button>
            )}
          </div>

          {/* Time Display */}
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              status === 'critical' || status === 'expired'
                ? 'text-red-600'
                : status === 'warning'
                  ? 'text-yellow-600'
                  : 'text-foreground'
            }`}>
              {formatTime(timeRemaining)}
            </div>
            {isPaused && (
              <Badge variant="secondary" className="text-xs mt-1">
                Paused
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-1">
              <Progress 
                value={progressPercentage} 
                className={`h-2 ${
                  status === 'critical' || status === 'expired'
                    ? '[&>div]:bg-red-500'
                    : status === 'warning'
                      ? '[&>div]:bg-yellow-500'
                      : '[&>div]:bg-blue-500'
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0m</span>
                <span>{formatTime(totalTime)}</span>
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status === 'expired' && (
            <div className="text-center">
              <Badge variant="destructive" className="text-xs">
                Time&apos;s Up!
              </Badge>
            </div>
          )}
          
          {status === 'critical' && timeRemaining > 0 && (
            <div className="text-center">
              <Badge variant="destructive" className="text-xs">
                Final Minutes!
              </Badge>
            </div>
          )}
          
          {status === 'warning' && (
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Time Running Low
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}