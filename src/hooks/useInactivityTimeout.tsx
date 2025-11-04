
import { useState, useEffect, useCallback } from 'react';

interface UseInactivityTimeoutProps {
  timeout: number; // in milliseconds
  onTimeout: () => void;
  onWarning?: () => void;
  warningTime?: number; // time before timeout to show warning
}

export const useInactivityTimeout = ({
  timeout,
  onTimeout,
  onWarning,
  warningTime = 60000, // 1 minute before timeout
}: UseInactivityTimeoutProps) => {
  const [isActive, setIsActive] = useState(true);
  const [warningShown, setWarningShown] = useState(false);

  const resetTimer = useCallback(() => {
    setIsActive(true);
    setWarningShown(false);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;

    const startTimer = () => {
      // Clear existing timers
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);

      // Set warning timer
      if (onWarning && warningTime > 0) {
        warningTimeoutId = setTimeout(() => {
          if (!warningShown) {
            setWarningShown(true);
            onWarning();
          }
        }, timeout - warningTime);
      }

      // Set timeout timer
      timeoutId = setTimeout(() => {
        setIsActive(false);
        onTimeout();
      }, timeout);
    };

    const handleActivity = () => {
      if (!isActive || warningShown) {
        resetTimer();
      }
      startTimer();
    };

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the timer initially
    startTimer();

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [timeout, onTimeout, onWarning, warningTime, isActive, warningShown, resetTimer]);

  return { resetTimer };
};
