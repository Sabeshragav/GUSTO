'use client';

import { useEffect, useState } from 'react';

interface MatrixEffectProps {
  onComplete: () => void;
}

interface MatrixChar {
  id: number;
  char: string;
  x: number;
  duration: number;
  delay: number;
}

export function MatrixEffect({ onComplete }: MatrixEffectProps) {
  const [chars, setChars] = useState<MatrixChar[]>([]);

  useEffect(() => {
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
    const columns = Math.floor(window.innerWidth / 20);
    const newChars: MatrixChar[] = [];

    for (let i = 0; i < columns * 3; i++) {
      newChars.push({
        id: i,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        x: (i % columns) * 20 + Math.random() * 10,
        duration: 1 + Math.random() * 2,
        delay: Math.random() * 2,
      });
    }

    setChars(newChars);

    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden bg-black/80">
      {chars.map((char) => (
        <span
          key={char.id}
          className="matrix-char absolute text-lg"
          style={{
            left: char.x,
            top: -30,
            animationDuration: `${char.duration}s`,
            animationDelay: `${char.delay}s`,
          }}
        >
          {char.char}
        </span>
      ))}
    </div>
  );
}
