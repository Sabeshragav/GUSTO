"use client";

import { ChevronLeft, Circle, Square } from "lucide-react";

interface MobileNavBarProps {
  onBack: () => void;
  onHome: () => void;
  onRecent: () => void;
}

export function MobileNavBar({ onBack, onHome, onRecent }: MobileNavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-[300] flex items-center justify-around bg-black/80 backdrop-blur-md border-t border-white/5">
      <button
        onClick={onBack}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Back"
      >
        <ChevronLeft size={24} strokeWidth={2} />
      </button>

      <button
        onClick={onHome}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Home"
      >
        <Circle size={18} strokeWidth={2.5} />
      </button>

      <button
        onClick={onRecent}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Recent Apps"
      >
        <Square size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}
