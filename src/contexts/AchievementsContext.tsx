'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-boot', name: 'First Boot', description: 'Visited the  Gusto-2026 for the first time' },
  { id: 'reference-check', name: 'Reference Check', description: 'Opened the Mail app' },
  { id: 'actually-read-it', name: 'Actually Read It', description: 'Viewed the CV' },
  { id: 'desktop-explorer', name: 'Desktop Explorer', description: 'Visited all four main folders' },
  { id: 'context-matters', name: 'Context Matters', description: 'Read both bio.txt and values.md' },
  { id: 'command-line-curious', name: 'Command Line Curious', description: 'Ran a command in the terminal' },
  { id: 'help-actually', name: 'Help, Actually', description: 'Used the help command' },
  { id: 'trash-explorer', name: 'Trash Explorer', description: 'Tried to open all protected trash files' },
  { id: 'first-mine', name: 'First Mine', description: 'Lost a game of Minesweeper' },
  { id: 'clean-board', name: 'Clean Board', description: 'Won a game of Minesweeper' },
  { id: 'just-one-more', name: 'Just One More', description: 'Played the same game twice' },
  { id: 'gamer', name: 'Gamer', description: 'Played both Snake and Minesweeper' },
];

const STORAGE_KEY = ' Gusto-2026-achievements';
const MAIN_FOLDERS = ['about-me', 'experience', 'projects', 'playground'];
const CONTEXT_FILES = ['bio', 'values'];
const TRASH_FILES = ['trash-passwords', 'trash-journal', 'trash-bank', 'trash-roi'];

interface AchievementsState {
  unlockedAchievements: Set<string>;
  visitedFolders: Set<string>;
  openedFiles: Set<string>;
  clickedTrashFiles: Set<string>;
  gamesPlayed: Map<string, number>;
  soundEnabled: boolean;
}

interface StoredState {
  unlockedAchievements: string[];
  visitedFolders: string[];
  openedFiles: string[];
  clickedTrashFiles: string[];
  gamesPlayed: [string, number][];
  soundEnabled: boolean;
}

interface AchievementsContextValue {
  state: AchievementsState;
  pendingNotification: Achievement | null;
  unlockAchievement: (id: string) => void;
  markFolderVisited: (folderId: string) => void;
  markFileOpened: (fileId: string) => void;
  markTrashFileClicked: (fileId: string) => void;
  markGamePlayed: (gameId: string) => void;
  clearNotification: () => void;
  toggleSound: () => void;
  isUnlocked: (id: string) => boolean;
  openAchievementsWindow: () => void;
  resetAchievements: () => void;
}

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

function loadFromStorage(): AchievementsState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: StoredState = JSON.parse(stored);
      return {
        unlockedAchievements: new Set(parsed.unlockedAchievements || []),
        visitedFolders: new Set(parsed.visitedFolders || []),
        openedFiles: new Set(parsed.openedFiles || []),
        clickedTrashFiles: new Set(parsed.clickedTrashFiles || []),
        gamesPlayed: new Map(parsed.gamesPlayed || []),
        soundEnabled: parsed.soundEnabled ?? true,
      };
    }
  } catch {
    // Ignore storage errors
  }
  return {
    unlockedAchievements: new Set(),
    visitedFolders: new Set(),
    openedFiles: new Set(),
    clickedTrashFiles: new Set(),
    gamesPlayed: new Map(),
    soundEnabled: true,
  };
}

function saveToStorage(state: AchievementsState): void {
  try {
    const toStore: StoredState = {
      unlockedAchievements: Array.from(state.unlockedAchievements),
      visitedFolders: Array.from(state.visitedFolders),
      openedFiles: Array.from(state.openedFiles),
      clickedTrashFiles: Array.from(state.clickedTrashFiles),
      gamesPlayed: Array.from(state.gamesPlayed.entries()),
      soundEnabled: state.soundEnabled,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Ignore storage errors
  }
}

const notificationSound = typeof window !== 'undefined' ? new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdHuJjYuEhXx0dHR4gImMi4aAenRwcnZ9hYuNjYiCfHZycnR5gYiMjY2Ig3x2cnJzeoCHi42OioN9d3Jyc3l/hoqNjYqEfndycnN4foWJjI2Lh4F8dnNzdXuChomLi4mFgHp2dHV3fIKGiYuKiYV/e3Z1dXh8gYWIioqIhX97d3V2eH2BhYiJiYeFgHt4dnZ4fIGEh4iIh4WBfXl3d3h7f4ODhoaGhIN/fHp4eHp9gIKEhYWEg4B9e3l5ent+gIKDhISEgoB9e3p6e31/gYKDg4OCgH57enp7fX+AgYKCgoGAfnx7e3t9foCBgYGBgH9+fHt7fH1+f4CAgIB/fn18fHx9fn9/f39/fn59fHx8fX5+fn5+fn5+fX19fX19fX19fX19fX19fX19fX5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/') : null;

interface AchievementsProviderProps {
  children: ReactNode;
  openAchievementsWindow: () => void;
}

export function AchievementsProvider({ children, openAchievementsWindow }: AchievementsProviderProps) {
  const [state, setState] = useState<AchievementsState>(loadFromStorage);
  const [pendingNotification, setPendingNotification] = useState<Achievement | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<Achievement[]>([]);
  const hasTriggeredFirstBoot = useRef(false);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);



  useEffect(() => {
    if (!pendingNotification && notificationQueue.length > 0) {
      setPendingNotification(notificationQueue[0]);
      setNotificationQueue(prev => prev.slice(1));
    }
  }, [pendingNotification, notificationQueue]);

  const playSound = useCallback(() => {
    if (state.soundEnabled && notificationSound) {
      notificationSound.volume = 0.3;
      notificationSound.currentTime = 0;
      notificationSound.play().catch(() => {});
    }
  }, [state.soundEnabled]);

  const unlockAchievement = useCallback((id: string) => {
    setState(prev => {
      if (prev.unlockedAchievements.has(id)) return prev;

      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        if (pendingNotification) {
          setNotificationQueue(q => [...q, achievement]);
        } else {
          setPendingNotification(achievement);
        }
        if (prev.soundEnabled && notificationSound) {
          notificationSound.volume = 0.3;
          notificationSound.currentTime = 0;
          notificationSound.play().catch(() => {});
        }
      }

      const newUnlocked = new Set(prev.unlockedAchievements);
      newUnlocked.add(id);
      return { ...prev, unlockedAchievements: newUnlocked };
    });
  }, [pendingNotification]);

  useEffect(() => {
    if (!hasTriggeredFirstBoot.current && !state.unlockedAchievements.has('first-boot')) {
      hasTriggeredFirstBoot.current = true;
      const timer = setTimeout(() => {
        unlockAchievement('first-boot');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.unlockedAchievements, unlockAchievement]);

  const markFolderVisited = useCallback((folderId: string) => {
    setState(prev => {
      if (!MAIN_FOLDERS.includes(folderId) || prev.visitedFolders.has(folderId)) return prev;

      const newVisited = new Set(prev.visitedFolders);
      newVisited.add(folderId);

      if (MAIN_FOLDERS.every(f => newVisited.has(f)) && !prev.unlockedAchievements.has('desktop-explorer')) {
        setTimeout(() => unlockAchievement('desktop-explorer'), 100);
      }

      return { ...prev, visitedFolders: newVisited };
    });
  }, [unlockAchievement]);

  const markFileOpened = useCallback((fileId: string) => {
    setState(prev => {
      if (!CONTEXT_FILES.includes(fileId) || prev.openedFiles.has(fileId)) return prev;

      const newOpened = new Set(prev.openedFiles);
      newOpened.add(fileId);

      if (CONTEXT_FILES.every(f => newOpened.has(f)) && !prev.unlockedAchievements.has('context-matters')) {
        setTimeout(() => unlockAchievement('context-matters'), 100);
      }

      return { ...prev, openedFiles: newOpened };
    });
  }, [unlockAchievement]);

  const markTrashFileClicked = useCallback((fileId: string) => {
    setState(prev => {
      if (!TRASH_FILES.includes(fileId) || prev.clickedTrashFiles.has(fileId)) return prev;

      const newClicked = new Set(prev.clickedTrashFiles);
      newClicked.add(fileId);

      if (TRASH_FILES.every(f => newClicked.has(f)) && !prev.unlockedAchievements.has('trash-explorer')) {
        setTimeout(() => unlockAchievement('trash-explorer'), 100);
      }

      return { ...prev, clickedTrashFiles: newClicked };
    });
  }, [unlockAchievement]);

  const markGamePlayed = useCallback((gameId: string) => {
    setState(prev => {
      const currentCount = prev.gamesPlayed.get(gameId) || 0;
      const newGamesPlayed = new Map(prev.gamesPlayed);
      newGamesPlayed.set(gameId, currentCount + 1);

      const newCount = currentCount + 1;

      if (newCount === 2 && !prev.unlockedAchievements.has('just-one-more')) {
        setTimeout(() => unlockAchievement('just-one-more'), 100);
      }

      const gamesWithPlays = Array.from(newGamesPlayed.entries()).filter(([, count]) => count > 0);
      if (gamesWithPlays.length >= 2 && !prev.unlockedAchievements.has('gamer')) {
        setTimeout(() => unlockAchievement('gamer'), 100);
      }

      return { ...prev, gamesPlayed: newGamesPlayed };
    });
  }, [unlockAchievement]);

  const clearNotification = useCallback(() => {
    setPendingNotification(null);
  }, []);

  const toggleSound = useCallback(() => {
    setState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const resetAchievements = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    hasTriggeredFirstBoot.current = false;
    setPendingNotification(null);
    setNotificationQueue([]);
    setState({
      unlockedAchievements: new Set(),
      visitedFolders: new Set(),
      openedFiles: new Set(),
      clickedTrashFiles: new Set(),
      gamesPlayed: new Map(),
      soundEnabled: true,
    });
    setTimeout(() => {
      unlockAchievement('first-boot');
    }, 1500);
  }, [unlockAchievement]);

  const isUnlocked = useCallback((id: string) => {
    return state.unlockedAchievements.has(id);
  }, [state.unlockedAchievements]);

  return (
    <AchievementsContext.Provider
      value={{
        state,
        pendingNotification,
        unlockAchievement,
        markFolderVisited,
        markFileOpened,
        markTrashFileClicked,
        markGamePlayed,
        clearNotification,
        toggleSound,
        isUnlocked,
        openAchievementsWindow,
        resetAchievements,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
}
