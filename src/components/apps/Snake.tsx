'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { useAchievements } from '../../contexts/AchievementsContext';
import type { SnakeDifficulty } from '../../types';

const DIFFICULTIES: Record<SnakeDifficulty, { speed: number; gridSize: number }> = {
  easy: { speed: 150, gridSize: 15 },
  medium: { speed: 100, gridSize: 20 },
  hard: { speed: 70, gridSize: 25 },
};

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  status: 'idle' | 'playing' | 'paused' | 'gameover';
  gridSize: number;
}

function getRandomPosition(gridSize: number, exclude: Position[] = []): Position {
  let pos: Position;
  do {
    pos = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (exclude.some(p => p.x === pos.x && p.y === pos.y));
  return pos;
}

function createInitialState(gridSize: number, highScore: number = 0): GameState {
  const centerX = Math.floor(gridSize / 2);
  const centerY = Math.floor(gridSize / 2);
  const snake = [
    { x: centerX, y: centerY },
    { x: centerX - 1, y: centerY },
    { x: centerX - 2, y: centerY },
  ];
  return {
    snake,
    food: getRandomPosition(gridSize, snake),
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    score: 0,
    highScore,
    status: 'idle',
    gridSize,
  };
}

export function Snake() {
  const { markGamePlayed } = useAchievements();
  const [difficulty, setDifficulty] = useState<SnakeDifficulty>('easy');
  const [gameState, setGameState] = useState<GameState>(() =>
    createInitialState(DIFFICULTIES.easy.gridSize)
  );
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStatus = useRef(gameState.status);

  useEffect(() => {
    const prev = prevStatus.current;
    const current = gameState.status;
    prevStatus.current = current;

    if (prev === 'idle' && current === 'playing') {
      markGamePlayed('snake');
    }
  }, [gameState.status, markGamePlayed]);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: 'playing',
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'playing' ? 'paused' : 'playing',
    }));
  }, []);

  const resetGame = useCallback((diff: SnakeDifficulty) => {
    setDifficulty(diff);
    setGameState(prev =>
      createInitialState(DIFFICULTIES[diff].gridSize, prev.highScore)
    );
  }, []);

  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (prev.status !== 'playing') return prev;

      const head = prev.snake[0];
      const direction = prev.nextDirection;
      let newHead: Position;

      switch (direction) {
        case 'UP':
          newHead = { x: head.x, y: head.y - 1 };
          break;
        case 'DOWN':
          newHead = { x: head.x, y: head.y + 1 };
          break;
        case 'LEFT':
          newHead = { x: head.x - 1, y: head.y };
          break;
        case 'RIGHT':
          newHead = { x: head.x + 1, y: head.y };
          break;
      }

      if (
        newHead.x < 0 ||
        newHead.x >= prev.gridSize ||
        newHead.y < 0 ||
        newHead.y >= prev.gridSize ||
        prev.snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        return {
          ...prev,
          status: 'gameover',
          highScore: Math.max(prev.highScore, prev.score),
        };
      }

      const ateFood = newHead.x === prev.food.x && newHead.y === prev.food.y;
      const newSnake = [newHead, ...prev.snake];
      if (!ateFood) {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        food: ateFood ? getRandomPosition(prev.gridSize, newSnake) : prev.food,
        score: ateFood ? prev.score + 10 : prev.score,
        direction: prev.nextDirection,
      };
    });
  }, []);

  useEffect(() => {
    if (gameState.status === 'playing') {
      gameLoopRef.current = setInterval(moveSnake, DIFFICULTIES[difficulty].speed);
    } else if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.status, difficulty, moveSnake]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.status !== 'playing' && gameState.status !== 'paused') return;

      const keyMap: Record<string, Direction> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
        W: 'UP',
        S: 'DOWN',
        A: 'LEFT',
        D: 'RIGHT',
      };

      const newDirection = keyMap[e.key];
      if (!newDirection) return;

      const opposites: Record<Direction, Direction> = {
        UP: 'DOWN',
        DOWN: 'UP',
        LEFT: 'RIGHT',
        RIGHT: 'LEFT',
      };

      if (opposites[newDirection] !== gameState.direction) {
        e.preventDefault();
        setGameState(prev => ({
          ...prev,
          nextDirection: newDirection,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.status, gameState.direction]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const getCellSize = () => {
    if (difficulty === 'hard') return 12;
    if (difficulty === 'medium') return 14;
    return 18;
  };

  const cellSize = getCellSize();

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col items-center bg-desktop-surface p-4 outline-none"
      tabIndex={0}
    >
      <div className="flex items-center gap-2 mb-4">
        {(['easy', 'medium', 'hard'] as SnakeDifficulty[]).map((diff) => (
          <button
            key={diff}
            className={`px-3 py-1 text-xs rounded capitalize transition-colors ${
              difficulty === diff
                ? 'bg-warm-600 text-warm-100'
                : 'bg-warm-800 text-warm-400 hover:bg-warm-700'
            }`}
            onClick={() => resetGame(diff)}
          >
            {diff}
          </button>
        ))}
      </div>

      <div className="bg-warm-900 p-2 rounded-lg mb-4">
        <div className="flex items-center justify-between gap-4 px-2">
          <div className="bg-black text-green-500 font-mono text-lg px-2 py-1 rounded min-w-[4rem] text-center">
            {String(gameState.score).padStart(4, '0')}
          </div>
          <div className="flex gap-2">
            {gameState.status === 'idle' ? (
              <button
                className="w-10 h-10 bg-warm-700 rounded flex items-center justify-center hover:bg-warm-600 transition-colors"
                onClick={startGame}
              >
                <Play size={20} className="text-green-400 ml-0.5" />
              </button>
            ) : gameState.status === 'gameover' ? (
              <button
                className="w-10 h-10 bg-warm-700 rounded flex items-center justify-center hover:bg-warm-600 transition-colors"
                onClick={() => resetGame(difficulty)}
              >
                <RotateCcw size={20} className="text-yellow-400" />
              </button>
            ) : (
              <button
                className="w-10 h-10 bg-warm-700 rounded flex items-center justify-center hover:bg-warm-600 transition-colors"
                onClick={pauseGame}
              >
                {gameState.status === 'paused' ? (
                  <Play size={20} className="text-green-400 ml-0.5" />
                ) : (
                  <Pause size={20} className="text-yellow-400" />
                )}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-black text-yellow-500 font-mono text-lg px-2 py-1 rounded min-w-[4rem]">
            <Trophy size={14} className="text-yellow-600" />
            {String(gameState.highScore).padStart(4, '0')}
          </div>
        </div>
      </div>

      <div
        className="bg-warm-800 p-1 rounded overflow-hidden"
        style={{
          width: gameState.gridSize * cellSize + 2,
          height: gameState.gridSize * cellSize + 2,
        }}
      >
        <div
          className="relative bg-warm-900"
          style={{
            width: gameState.gridSize * cellSize,
            height: gameState.gridSize * cellSize,
          }}
        >
          {gameState.snake.map((segment, index) => (
            <div
              key={index}
              className={`absolute rounded-sm transition-all duration-75 ${
                index === 0 ? 'bg-green-400' : 'bg-green-600'
              }`}
              style={{
                width: cellSize - 1,
                height: cellSize - 1,
                left: segment.x * cellSize,
                top: segment.y * cellSize,
              }}
            />
          ))}
          <div
            className="absolute bg-red-500 rounded-full animate-pulse"
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              left: gameState.food.x * cellSize + 0.5,
              top: gameState.food.y * cellSize + 0.5,
            }}
          />
        </div>
      </div>

      {gameState.status === 'idle' && (
        <p className="mt-4 text-warm-500 text-sm">
          Press Play or use arrow keys / WASD to start
        </p>
      )}

      {gameState.status === 'paused' && (
        <p className="mt-4 text-yellow-500 text-sm font-medium">
          Paused
        </p>
      )}

      {gameState.status === 'gameover' && (
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-red-400">Game Over</p>
          <p className="text-warm-400 text-sm mt-1">
            Score: {gameState.score}
            {gameState.score === gameState.highScore && gameState.score > 0 && (
              <span className="text-yellow-400 ml-2">New High Score!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
