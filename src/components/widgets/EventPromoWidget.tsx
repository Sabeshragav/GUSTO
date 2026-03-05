"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  MapPin,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EVENTS } from "../../data/events";

interface EventPromoWidgetProps {
  variant?: "desktop" | "mobile";
  className?: string;
  onEventClick?: (id: string) => void;
}

// Select a few diverse events to feature
const FEATURED_EVENT_IDS = [
  // "paper-presentation",
  // "project-presentation",
  "tech-quiz",
  "hunt-mods",
  "code-debugging",
];
const FEATURED_EVENTS = EVENTS.filter((e) => FEATURED_EVENT_IDS.includes(e.id));

type Slide =
  | { type: "event"; event: (typeof FEATURED_EVENTS)[number]; duration: number }
  | {
      type: "info";
      id: string;
      label: string;
      title: string;
      lines: string[];
      duration: number;
    };

// Important notice FIRST, then featured events
const SLIDES: Slide[] = [
  {
    type: "info",
    id: "on-spot-reg",
    label: "Important Notice",
    title: "On-Spot Registration",
    lines: [
      "Available for select events only on March 6th.",
      "Check each event's details to see eligibility.",
      "You must reach the registration desk before 9:00 AM, late arrivals will not be accepted.",
    ],
    duration: 30000,
  },
  // ...FEATURED_EVENTS.map((event) => ({
  //   type: "event" as const,
  //   event,
  //   duration: 1000,
  // })),
];

export function EventPromoWidget({
  variant = "mobile",
  className = "",
  onEventClick,
}: EventPromoWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const containerRef = useRef<HTMLDivElement>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Auto-advance with per-slide duration
  useEffect(() => {
    const slide = SLIDES[currentIndex];
    const timer = setTimeout(goNext, slide.duration);
    return () => clearTimeout(timer);
  }, [currentIndex, goNext]);

  // Keyboard navigation (left/right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Touch swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0)
        goNext(); // swipe left -> next
      else goPrev(); // swipe right -> prev
    }
  };

  const slide = SLIDES[currentIndex];
  if (!slide) return null;

  const isDesktop = variant === "desktop";

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`relative overflow-hidden outline-none ${
        isDesktop
          ? "w-[320px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
          : "w-full max-w-[320px] bg-black/30 backdrop-blur-md border border-white/15 rounded-[20px] shadow-lg"
      } ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`${isDesktop ? "p-5" : "px-5 py-4"}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#FF6B35] text-[10px] font-bold tracking-widest uppercase">
            {slide.type === "event" ? "Featured Event" : slide.label}
          </span>
          <div className="flex gap-1">
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content with Animation */}
        <div className="relative h-[100px]">
          <AnimatePresence mode="wait" initial={false}>
            {slide.type === "event" ? (
              <motion.div
                key={slide.event.id}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col justify-between cursor-pointer"
                onClick={() => onEventClick?.(slide.event.id)}
              >
                <div>
                  <h3
                    className={`font-bold text-white line-clamp-1 ${isDesktop ? "text-xl" : "text-lg"}`}
                  >
                    {slide.event.title}
                  </h3>
                  <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {slide.event.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Clock size={12} className="text-[#FF6B35]" />
                    <span className="text-[10px] font-medium">
                      {slide.event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <MapPin size={12} className="text-[#FF6B35]" />
                    <span className="text-[10px] font-medium truncate max-w-[100px]">
                      {slide.event.venue}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col justify-between"
              >
                <div>
                  <h3
                    className={`font-bold text-white flex items-center gap-2 ${isDesktop ? "text-lg" : "text-base"}`}
                  >
                    <AlertTriangle
                      size={16}
                      className="text-amber-400 shrink-0"
                    />
                    {slide.title}
                  </h3>
                  <ul className="mt-1.5 space-y-1">
                    {slide.lines.map((line, i) => (
                      <li
                        key={i}
                        className="text-white/70 text-[11px] leading-snug flex items-start gap-1.5"
                      >
                        <span className="text-amber-400 mt-0.5 shrink-0">
                          •
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation arrows (desktop only) */}
        {/* {isDesktop && (
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              onClick={goPrev}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={14} className="text-white/70" />
            </button>
            <button
              onClick={goNext}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={14} className="text-white/70" />
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
}
