'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementsContext';

export function AchievementNotification() {
  const { pendingNotification, clearNotification, openAchievementsWindow } = useAchievements();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (pendingNotification) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setIsVisible(false);
          clearNotification();
        }, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [pendingNotification, clearNotification]);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      clearNotification();
      openAchievementsWindow();
    }, 150);
  };

  if (!isVisible || !pendingNotification) return null;

  return (
    <div
      onClick={handleClick}
      className={`fixed top-10 right-4 z-[9999] cursor-pointer transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
      }`}
      style={{
        animation: isExiting ? undefined : 'slideInRight 0.3s ease-out',
      }}
    >
      <div className="bg-desktop-surface/95 backdrop-blur-md border border-warm-700/50 rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 min-w-[200px]">
        <Trophy size={16} className="text-warm-500 flex-shrink-0" />
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-warm-500">
            Achievement unlocked
          </span>
          <span className="text-sm text-warm-200">
            {pendingNotification.name}
          </span>
        </div>
      </div>
    </div>
  );
}
