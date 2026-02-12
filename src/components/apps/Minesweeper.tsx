'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Flag, Bomb, Smile, Frown, PartyPopper } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementsContext';
import type { MinesweeperCell, MinesweeperDifficulty, MinesweeperState } from '../../types';

const DIFFICULTIES: Record<MinesweeperDifficulty, { rows: number; cols: number; mines: number }> = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

const NUMBER_COLORS = [
  '',
  'text-blue-400',
  'text-green-500',
  'text-red-500',
  'text-purple-500',
  'text-yellow-600',
  'text-cyan-500',
  'text-pink-500',
  'text-warm-300',
];

function createEmptyGrid(rows: number, cols: number): MinesweeperCell[][] {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols)
        .fill(null)
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );
}

function placeMines(
  grid: MinesweeperCell[][],
  mines: number,
  excludeRow: number,
  excludeCol: number
): void {
  const rows = grid.length;
  const cols = grid[0].length;
  let placed = 0;

  while (placed < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (
      !grid[row][col].isMine &&
      !(Math.abs(row - excludeRow) <= 1 && Math.abs(col - excludeCol) <= 1)
    ) {
      grid[row][col].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c].isMine) {
        let count = 0;
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isMine) {
              count++;
            }
          }
        }
        grid[r][c].adjacentMines = count;
      }
    }
  }
}

export function Minesweeper() {
  const { unlockAchievement, markGamePlayed } = useAchievements();
  const [difficulty, setDifficulty] = useState<MinesweeperDifficulty>('easy');
  const [gameState, setGameState] = useState<MinesweeperState>(() => {
    const config = DIFFICULTIES.easy;
    return {
      grid: createEmptyGrid(config.rows, config.cols),
      rows: config.rows,
      cols: config.cols,
      mines: config.mines,
      gameState: 'idle',
      flagsPlaced: 0,
      startTime: null,
      elapsedTime: 0,
    };
  });
  const prevGameState = useRef(gameState.gameState);

  useEffect(() => {
    const prev = prevGameState.current;
    const current = gameState.gameState;
    prevGameState.current = current;

    if (prev === 'idle' && current === 'playing') {
      markGamePlayed('minesweeper');
    }
    if (current === 'lost' && prev !== 'lost') {
      unlockAchievement('first-mine');
    }
    if (current === 'won' && prev !== 'won') {
      unlockAchievement('clean-board');
    }
  }, [gameState.gameState, unlockAchievement, markGamePlayed]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState.gameState === 'playing' && gameState.startTime) {
      interval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          elapsedTime: Math.floor((Date.now() - (prev.startTime || Date.now())) / 1000),
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.gameState, gameState.startTime]);

  const startNewGame = useCallback((diff: MinesweeperDifficulty) => {
    const config = DIFFICULTIES[diff];
    setDifficulty(diff);
    setGameState({
      grid: createEmptyGrid(config.rows, config.cols),
      rows: config.rows,
      cols: config.cols,
      mines: config.mines,
      gameState: 'idle',
      flagsPlaced: 0,
      startTime: null,
      elapsedTime: 0,
    });
  }, []);

  const revealCell = (row: number, col: number) => {
    if (
      gameState.gameState === 'won' ||
      gameState.gameState === 'lost' ||
      gameState.grid[row][col].isRevealed ||
      gameState.grid[row][col].isFlagged
    ) {
      return;
    }

    let newGrid = gameState.grid.map((r) => r.map((c) => ({ ...c })));
    let newGameState: 'idle' | 'playing' | 'won' | 'lost' = gameState.gameState;
    let startTime = gameState.startTime;

    if (gameState.gameState === 'idle') {
      placeMines(newGrid, gameState.mines, row, col);
      newGameState = 'playing';
      startTime = Date.now();
    }

    if (newGrid[row][col].isMine) {
      newGrid[row][col].isRevealed = true;
      newGrid = newGrid.map((r) =>
        r.map((c) => (c.isMine ? { ...c, isRevealed: true } : c))
      );
      newGameState = 'lost';
    } else {
      const reveal = (r: number, c: number) => {
        if (
          r < 0 ||
          r >= gameState.rows ||
          c < 0 ||
          c >= gameState.cols ||
          newGrid[r][c].isRevealed ||
          newGrid[r][c].isFlagged
        ) {
          return;
        }

        newGrid[r][c].isRevealed = true;

        if (newGrid[r][c].adjacentMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              reveal(r + dr, c + dc);
            }
          }
        }
      };

      reveal(row, col);

      const unrevealedSafe = newGrid
        .flat()
        .filter((c) => !c.isRevealed && !c.isMine).length;
      if (unrevealedSafe === 0) {
        newGameState = 'won';
      }
    }

    setGameState((prev) => ({
      ...prev,
      grid: newGrid,
      gameState: newGameState,
      startTime,
    }));
  };

  const toggleFlag = (row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (
      gameState.gameState === 'won' ||
      gameState.gameState === 'lost' ||
      gameState.grid[row][col].isRevealed
    ) {
      return;
    }

    const newGrid = gameState.grid.map((r) => r.map((c) => ({ ...c })));
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;

    const flagsPlaced = newGrid.flat().filter((c) => c.isFlagged).length;

    setGameState((prev) => ({
      ...prev,
      grid: newGrid,
      flagsPlaced,
    }));
  };

  const formatTime = (seconds: number) => {
    return String(Math.min(seconds, 999)).padStart(3, '0');
  };

  const getFaceIcon = () => {
    switch (gameState.gameState) {
      case 'won':
        return <PartyPopper size={20} className="text-yellow-400" />;
      case 'lost':
        return <Frown size={20} className="text-red-400" />;
      default:
        return <Smile size={20} className="text-yellow-400" />;
    }
  };

  const getCellSize = () => {
    if (difficulty === 'hard') return 'w-5 h-5 text-xs';
    if (difficulty === 'medium') return 'w-6 h-6 text-sm';
    return 'w-7 h-7 text-sm';
  };

  return (
    <div className="h-full flex flex-col items-center bg-desktop-surface p-4">
      <div className="flex items-center gap-2 mb-4">
        {(['easy', 'medium', 'hard'] as MinesweeperDifficulty[]).map((diff) => (
          <button
            key={diff}
            className={`px-3 py-1 text-xs rounded capitalize transition-colors ${
              difficulty === diff
                ? 'bg-warm-600 text-warm-100'
                : 'bg-warm-800 text-warm-400 hover:bg-warm-700'
            }`}
            onClick={() => startNewGame(diff)}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="bg-warm-900 p-2 rounded-lg mb-4">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="bg-black text-red-500 font-mono text-lg px-2 py-1 rounded min-w-[3rem] text-center">
            {String(Math.max(0, gameState.mines - gameState.flagsPlaced)).padStart(3, '0')}
          </div>
          <button
            className="w-10 h-10 bg-warm-700 rounded flex items-center justify-center hover:bg-warm-600 transition-colors"
            onClick={() => startNewGame(difficulty)}
          >
            {getFaceIcon()}
          </button>
          <div className="bg-black text-red-500 font-mono text-lg px-2 py-1 rounded min-w-[3rem] text-center">
            {formatTime(gameState.elapsedTime)}
          </div>
        </div>
      </div>

      <div
        className="bg-warm-800 p-1 rounded inline-block overflow-auto max-h-[calc(100%-120px)]"
        style={{ maxWidth: '100%' }}
      >
        <div
          className="grid gap-px"
          style={{
            gridTemplateColumns: `repeat(${gameState.cols}, minmax(0, 1fr))`,
          }}
        >
          {gameState.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const cellSize = getCellSize();
              return (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={`${cellSize} flex items-center justify-center font-bold transition-all ${
                    cell.isRevealed
                      ? cell.isMine
                        ? 'bg-red-600'
                        : 'bg-warm-700'
                      : 'bg-warm-500 hover:bg-warm-400 active:bg-warm-600'
                  } ${!cell.isRevealed ? 'shadow-[inset_1px_1px_0_rgba(255,255,255,0.3),inset_-1px_-1px_0_rgba(0,0,0,0.3)]' : ''}`}
                  onClick={() => revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => toggleFlag(rowIndex, colIndex, e)}
                  disabled={cell.isRevealed}
                >
                  {cell.isRevealed ? (
                    cell.isMine ? (
                      <Bomb size={14} />
                    ) : cell.adjacentMines > 0 ? (
                      <span className={NUMBER_COLORS[cell.adjacentMines]}>
                        {cell.adjacentMines}
                      </span>
                    ) : null
                  ) : cell.isFlagged ? (
                    <Flag size={12} className="text-red-500" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {(gameState.gameState === 'won' || gameState.gameState === 'lost') && (
        <div className="mt-4 text-center">
          <p className={`text-lg font-bold ${gameState.gameState === 'won' ? 'text-green-400' : 'text-red-400'}`}>
            {gameState.gameState === 'won' ? 'You Win!' : 'Game Over'}
          </p>
          <p className="text-warm-400 text-sm mt-1">
            Time: {gameState.elapsedTime}s
          </p>
        </div>
      )}
    </div>
  );
}
