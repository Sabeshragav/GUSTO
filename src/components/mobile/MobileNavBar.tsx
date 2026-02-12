"use client";

import { ChevronLeft, Circle, Square } from "lucide-react";

interface MobileNavBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecent: () => void;
}

export function MobileNavBar({ onBack, onHome, onRecent }: MobileNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-[300] flex items-center justify-around bg-black/40 backdrop-blur-md border-t border-white/10">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-12 h-12 text-white/70 active:text-white active:scale-90 transition-all duration-150"
        aria-label="Back"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        onClick={onHome}
        className="flex items-center justify-center w-12 h-12 text-white/70 active:text-white active:scale-90 transition-all duration-150"
        aria-label="Home"
      >
        <Circle size={18} strokeWidth={2.5} />
      </button>
      <button
        onClick={onRecent}
        className="flex items-center justify-center w-12 h-12 text-white/70 active:text-white active:scale-90 transition-all duration-150"
        aria-label="Recent Apps"
      >
        <Square size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
