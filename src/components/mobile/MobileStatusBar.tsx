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
    onChange(); // initial check
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const requestFullscreen = useCallback(() => {
    const el = document.documentElement;
    if (!document.fullscreenElement && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 z-[100] flex items-center justify-between px-4 bg-black/30 backdrop-blur-md text-white text-xs font-medium">
      <span className="tracking-wide">{time}</span>
      <div className="flex items-center gap-1.5">
        {!isFullscreen && (
          <button
            onClick={requestFullscreen}
            className="p-0.5 rounded active:opacity-60 transition-opacity"
            aria-label="Enter fullscreen"
          >
            <Maximize size={12} strokeWidth={2.5} />
          </button>
        )}
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <BatteryFull size={15} strokeWidth={2} />
      </div>
    </div>
  );
}
