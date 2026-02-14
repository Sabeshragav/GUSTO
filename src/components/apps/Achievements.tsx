'use client';

import { Trophy, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { useAchievements, ACHIEVEMENTS } from '../../contexts/AchievementsContext';

export function Achievements() {
  const { isUnlocked } = useAchievements();

  const unlocked = ACHIEVEMENTS.filter(a => isUnlocked(a.id));
  const locked = ACHIEVEMENTS.filter(a => !isUnlocked(a.id));
  const progress = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  // Simple emoji map for achievement theming
  const getEmoji = (id: string) => {
    const map: Record<string, string> = {
      'first-boot': '🚀',
      'reference-check': '📧',
      'actually-read-it': '📄',
      'desktop-explorer': '🗂️',
      'context-matters': '📖',
      'command-line-curious': '💻',
      'help-actually': '❓',
      'trash-explorer': '🗑️',
      'first-mine': '💥',
      'clean-board': '🏅',
      'just-one-more': '🎮',
      'gamer': '🕹️',
      'registered-for-gusto-26': '🎫',
      'contact-explorer': '📱',
    };
    return map[id] || '⭐';
  };

  return (
    <div className="h-full flex flex-col bg-[#0d0d0d] overflow-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Trophy size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white text-lg font-bold">Achievements</h2>
            <p className="text-white/40 text-xs">
              {unlocked.length} of {ACHIEVEMENTS.length} unlocked
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-2.5 bg-white/5 rounded-full overflow-hidden mb-1">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
          {progress > 0 && (
            <div
              className="absolute inset-y-0 rounded-full bg-white/20 animate-pulse"
              style={{ left: `${Math.max(0, progress - 3)}%`, width: '3%' }}
            />
          )}
        </div>
        <p className="text-right text-[10px] text-white/30 font-medium tracking-wider">
          {progress}% COMPLETE
        </p>
      </div>

      {/* Unlocked section */}
      {unlocked.length > 0 && (
        <div className="px-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-amber-400" />
            <h3 className="text-[10px] text-amber-400/80 font-bold tracking-[0.15em] uppercase">
              Unlocked
            </h3>
          </div>
          <div className="space-y-2">
            {unlocked.map(a => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.04] border border-amber-500/10 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-lg flex-shrink-0">
                  {getEmoji(a.id)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-sm font-semibold truncate">{a.name}</span>
                    <CheckCircle2 size={13} className="text-amber-400 flex-shrink-0" />
                  </div>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked section */}
      {locked.length > 0 && (
        <div className="px-5 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <Lock size={11} className="text-white/20" />
            <h3 className="text-[10px] text-white/20 font-bold tracking-[0.15em] uppercase">
              Locked
            </h3>
          </div>
          <div className="space-y-2">
            {locked.map(a => (
              <div
                key={a.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center flex-shrink-0">
                  <Lock size={16} className="text-white/10" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-white/25 text-sm font-semibold">{a.name}</span>
                  <p className="text-white/15 text-xs mt-0.5">???</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
