"use client";

import { useState, useEffect, useCallback } from "react";
import { Wifi, BatteryFull, Signal, Maximize } from "lucide-react";

export function MobileStatusBar() {
  const [time, setTime] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    onChange();
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const requestFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(() => { });
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-11 z-[100] flex items-center justify-between px-5">
      {/* Left: Time — iOS style (bold) */}
      <span className="text-white text-[14px] font-semibold tracking-tight drop-shadow-sm">
        {time}
      </span>

      {/* Center: Dynamic Island notch hint */}
      <div className="absolute left-1/2 -translate-x-1/2 top-[5px]">
        <div className="w-[120px] h-[28px] bg-black rounded-full shadow-lg shadow-black/50 flex items-center justify-center">
          {!isFullscreen && (
            <button
              onClick={requestFullscreen}
              className="p-0.5 rounded active:opacity-60 transition-opacity"
              aria-label="Enter fullscreen"
            >
              <Maximize size={11} strokeWidth={2.5} className="text-white/50" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Status icons — iOS style */}
      <div className="flex items-center gap-1">
        <Signal size={14} strokeWidth={2.5} className="text-white drop-shadow-sm" />
        <Wifi size={14} strokeWidth={2.5} className="text-white drop-shadow-sm" />
        <BatteryFull size={18} strokeWidth={1.5} className="text-white drop-shadow-sm" />
      </div>
    </div>
  );
}
