'use client';

import { useEffect, useState, useCallback } from 'react';
import { useDesktop } from '../../contexts/DesktopContext';

export function Screensaver() {
  const { state } = useDesktop();
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const deactivate = useCallback(() => {
    setIsActive(false);
  }, []);

  useEffect(() => {
    if (!state.screensaver.enabled) {
      setIsActive(false);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const timeoutMs = state.screensaver.timeout * 60 * 1000;

    const resetTimer = () => {
      clearTimeout(timeout);
      if (isActive) {
        deactivate();
      }
      timeout = setTimeout(() => {
        setIsActive(true);
      }, timeoutMs);
    };

    resetTimer();

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [state.screensaver.enabled, state.screensaver.timeout, isActive, deactivate]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black z-[99999] flex items-center justify-center cursor-none animate-fade-in"
      onClick={deactivate}
    >
      <div className="text-center animate-float">
        <div className="text-8xl font-extralight text-white/90 tracking-tight mb-4">
          {formatTime(currentTime)}
        </div>
        <div className="text-2xl font-light text-white/60">
          {formatDate(currentTime)}
        </div>
      </div>
    </div>
  );
}
