"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDesktop } from "../../contexts/DesktopContext";
import { useIsMobile } from "../../hooks/useIsMobile";

// GUSTO 2026 event date — March 7, 2026
const TARGET_DATE = new Date("2026-03-04T23:59:59+05:30");
const REG_CLOSE_TEXT = "Registration closes on 4th March 2026";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, TARGET_DATE.getTime() - now.getTime());

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function DesktopWidgets() {
  const { state } = useDesktop();
  const { isMobile } = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine text color based on wallpaper/theme
  const isDarkWallpaper =
    state.theme.id.includes("dark") ||
    state.wallpaper.id.includes("midnight") ||
    state.wallpaper.id.includes("slate");
  const textColor = isDarkWallpaper ? "text-white/80" : "text-black/60";
  const shadowClass = isDarkWallpaper ? "drop-shadow-md" : "drop-shadow-sm";
  const labelColor = isDarkWallpaper ? "text-[#F54E00]" : "text-[#D64000]";

  if (!mounted) return null;

  const units: { label: string; value: string }[] = [
    { label: "DAYS", value: pad(timeLeft.days) },
    { label: "HOURS", value: pad(timeLeft.hours) },
    { label: "MINUTES", value: pad(timeLeft.minutes) },
    { label: "SECONDS", value: pad(timeLeft.seconds) },
  ];

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0`}>
      {/* Countdown Timer Widget - Top Right */}
      <div
        className={`absolute ${isMobile ? "top-14 right-3 left-3" : "top-16 right-8"} flex flex-col items-${isMobile ? "center" : "end"} ${textColor} ${shadowClass} z-10`}
      >
        <motion.p
          className={`font-bold mb-2 ${isMobile ? "text-xs" : "text-base"} tracking-wide`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The clock is ticking away !
        </motion.p>

        {/* Labels row */}
        <motion.div
          className={`flex ${isMobile ? "gap-6" : "gap-10"} justify-center mb-1`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {units.map((u) => (
            <span
              key={u.label}
              className={`${labelColor} font-bold uppercase tracking-widest ${isMobile ? "text-[8px] w-8" : "text-[10px] w-14"} text-center`}
            >
              {u.label}
            </span>
          ))}
        </motion.div>

        {/* Numbers row */}
        <motion.div
          className="flex items-baseline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {units.map((u, i) => (
            <span key={u.label} className="flex items-baseline">
              <span
                className={`font-black font-mono tabular-nums leading-none ${isMobile ? "text-3xl" : "text-7xl"}`}
              >
                {u.value}
              </span>
              {i < units.length - 1 && (
                <span
                  className={`font-bold mx-1 ${isMobile ? "text-xl" : "text-5xl"} opacity-60`}
                >
                  :
                </span>
              )}
            </span>
          ))}
        </motion.div>

        <motion.p
          className={`mt-2 font-medium opacity-60 ${isMobile ? "text-[10px]" : "text-sm"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {REG_CLOSE_TEXT}
        </motion.p>
      </div>

      {/* Brand Widget - Massive, Center/Background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-70">
        <div className="flex overflow-hidden">
          {Array.from("GUSTO").map((letter, index) => (
            <motion.span
              key={index}
              className={`font-black tracking-tighter ${textColor}`}
              style={{
                fontSize: isMobile ? "5rem" : "18rem",
                lineHeight: 0.8,
                opacity: 0.1,
              }}
              initial={{ y: 200, opacity: 0 }}
              animate={{ y: 0, opacity: 0.1 }}
              transition={{
                duration: 1.5,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              whileHover={{
                y: -20,
                opacity: 0.3,
                transition: { duration: 0.3 },
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          className={`text-xl font-bold tracking-[0.5em] mt-4 uppercase ${textColor}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ delay: 1.5, duration: 2 }}
        >
          2026
        </motion.div>
      </div>
    </div>
  );
}
