'use client';

import { Check, Circle } from 'lucide-react';
import { useAchievements, ACHIEVEMENTS } from '../../contexts/AchievementsContext';

export function Achievements() {
  const { isUnlocked } = useAchievements();
  const unlockedCount = ACHIEVEMENTS.filter(a => isUnlocked(a.id)).length;

  return (
    <div className="h-full flex flex-col bg-desktop-surface p-6">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xs font-medium tracking-widest text-warm-500 uppercase">
          Achievements
        </h2>
        <span className="text-xs text-warm-600">
          {unlockedCount}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2">
        {ACHIEVEMENTS.map((achievement) => {
          const unlocked = isUnlocked(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`flex items-start gap-3 py-2.5 px-3 rounded transition-colors ${
                unlocked ? 'bg-warm-800/30' : ''
              }`}
            >
              {unlocked ? (
                <Check size={14} className="text-warm-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle size={6} className="text-warm-600 flex-shrink-0 ml-1 mr-1 mt-1.5" />
              )}
              <div className="flex flex-col min-w-0">
                <span className={unlocked ? 'text-warm-200' : 'text-warm-600'}>
                  {achievement.name}
                </span>
                <span className="text-xs text-warm-500 mt-0.5">
                  {unlocked ? achievement.description : '???'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
