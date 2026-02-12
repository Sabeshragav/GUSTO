'use client';

import React from 'react';

interface MacFolderProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function MacFolder({ size = 48, className = '', style }: MacFolderProps) {
  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        <defs>
          <linearGradient id="folder-back-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AC8FA" />
            <stop offset="100%" stopColor="#007AFF" />
          </linearGradient>
          <linearGradient id="folder-front-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5AC8FA" />
            <stop offset="100%" stopColor="#007AFF" />
          </linearGradient>
          <linearGradient id="folder-highlight" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
             <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <filter id="folder-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
          </filter>
        </defs>

        {/* Back Plate */}
        <path
          d="M10 25C10 22.2386 12.2386 20 15 20H35C36.3261 20 37.5979 20.5268 38.5355 21.4645L43.5355 26.4645C44.4732 27.4021 45.745 27.9289 47.0711 27.9289H85C87.7614 27.9289 90 30.1675 90 32.9289V75C90 77.7614 87.7614 80 85 80H15C12.2386 80 10 77.7614 10 75V25Z"
          fill="url(#folder-back-gradient)"
        />

        {/* Front Plate (slightly overlapping, creating the pocket) */}
        <path
          d="M10 42C10 39.2386 12.2386 37 15 37H85C87.7614 37 90 39.2386 90 42V78C90 80.7614 87.7614 83 85 83H15C12.2386 83 10 80.7614 10 78V42Z"
          fill="url(#folder-front-gradient)"
          filter="url(#folder-shadow)"
        />
        
        {/* Highlight on front plate */}
         <path
          d="M11 43C11 40.7909 12.7909 39 15 39H85C87.2091 39 89 40.7909 89 43V46H11V43Z"
          fill="url(#folder-highlight)"
        />
      </svg>
    </div>
  );
}
