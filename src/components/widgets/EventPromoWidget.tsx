"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";
import { EVENTS } from "../../data/events";

interface EventPromoWidgetProps {
    variant?: "desktop" | "mobile";
    className?: string;
    onEventClick?: (id: string) => void;
}

// Select a few diverse events to feature (e.g. one tech, one non-tech, one fun)
const FEATURED_EVENT_IDS = ["paper-presentation", "project-presentation", "tech-quiz", "hunt-mods", "code-debugging"];
const FEATURED_EVENTS = EVENTS.filter((e) => FEATURED_EVENT_IDS.includes(e.id));

export function EventPromoWidget({ variant = "mobile", className = "", onEventClick }: EventPromoWidgetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % FEATURED_EVENTS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -30) {
            // Swiped left -> next
            setCurrentIndex((prev) => (prev + 1) % FEATURED_EVENTS.length);
        } else if (info.offset.x > 30) {
            // Swiped right -> prev
            setCurrentIndex((prev) => (prev - 1 + FEATURED_EVENTS.length) % FEATURED_EVENTS.length);
        }
    };

    const event = FEATURED_EVENTS[currentIndex];
    if (!event) return null;

    const isDesktop = variant === "desktop";

    return (
        <div
            className={`relative overflow-hidden ${isDesktop
                ? "w-[320px] bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl"
                : "w-full max-w-[320px] bg-black/30 backdrop-blur-md border border-white/15 rounded-[20px] shadow-lg"
                } ${className}`}
        >
            <div className={`${isDesktop ? "p-5" : "px-5 py-4"}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[#FF6B35] text-[10px] font-bold tracking-widest uppercase">
                        Featured Event
                    </span>
                    <div className="flex gap-1">
                        {FEATURED_EVENTS.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? "w-4 bg-white" : "w-1 bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content with Animation */}
                <div className="relative h-[100px] touch-pan-y">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex flex-col justify-between cursor-pointer active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={handleDragEnd}
                            onClick={() => onEventClick?.(event.id)}
                        >
                            <div>
                                <h3 className={`font-bold text-white line-clamp-1 ${isDesktop ? "text-xl" : "text-lg"}`}>
                                    {event.title}
                                </h3>
                                <p className="text-white/60 text-xs mt-1 line-clamp-2 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-white/80">
                                    <Clock size={12} className="text-[#FF6B35]" />
                                    <span className="text-[10px] font-medium">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-white/80">
                                    <MapPin size={12} className="text-[#FF6B35]" />
                                    <span className="text-[10px] font-medium truncate max-w-[100px]">
                                        {event.venue}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
