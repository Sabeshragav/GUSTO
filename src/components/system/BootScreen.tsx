"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

type BootPhase = "logo" | "loading" | "done";

export function BootScreen({ onComplete }: BootScreenProps) {
  const [phase, setPhase] = useState<BootPhase>("logo");
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("");

  // Typewriter effect for Phase 1
  useEffect(() => {
    const fullText = "> GUSTO 2026";
    let currentIndex = 0;

    const typeTimer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeTimer);
        // Transition to loading phase after typing is done + small delay
        setTimeout(() => setPhase("loading"), 1000);
      }
    }, 100); // Typing speed

    return () => clearInterval(typeTimer);
  }, []);

  // Loading Progress for Phase 2
  useEffect(() => {
    if (phase === "loading") {
      const duration = 3000;
      const interval = 30;
      const steps = duration / interval;
      const increment = 100 / steps;

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return Math.min(prev + increment, 100);
        });
      }, interval);

      const doneTimer = setTimeout(() => {
        setPhase("done");
      }, duration + 500);

      return () => {
        clearInterval(timer);
        clearTimeout(doneTimer);
      };
    }
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#141414] text-white font-mono"
      onClick={phase === "done" ? onComplete : undefined}
      style={{ cursor: phase === "done" ? "pointer" : "default" }}
    >
      <AnimatePresence mode="wait">
        {phase === "logo" && (
          <motion.div
            key="logo"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold tracking-widest text-white/90">
              {text}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-3 h-8 md:h-12 ml-1 bg-[#F54E00] align-middle"
              />
            </h1>
          </motion.div>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            {/* Text-based Progress */}
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-light text-white/90 tabular-nums tracking-tighter">
                {Math.round(progress)}
              </span>
              <span className="text-xl text-[#F54E00] font-bold">%</span>
            </div>

            {/* Minimal Loading Text */}
            <div className="text-xs font-mono text-white/40 tracking-[0.3em] uppercase">
              Loading System Modules...
            </div>

            {/* Decorative ASCII Line */}
            <div className="text-[10px] text-white/20 tracking-widest">
              :: 0x892F :: GUSTO_OS_KERNEL ::
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="text-2xl md:text-4xl font-bold tracking-widest text-white/90">
              GUSTO 2026
            </div>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-sm text-[#F54E00] font-mono tracking-[0.3em] uppercase"
            >
              Tap to Enter
            </motion.div>
            <div className="text-[10px] text-white/20 tracking-widest">
              :: SYSTEM READY ::
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
