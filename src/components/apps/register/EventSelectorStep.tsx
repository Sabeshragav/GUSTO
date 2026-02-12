"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertCircle, Clock, MapPin, Users } from "lucide-react";
import { EVENTS, type Event } from "../../../data/events";
import type { Pass } from "../../../data/eventValidation";
import type { SelectionCounts, EventValidation } from "../../../hooks/usePassValidation";

interface EventSelectorStepProps {
    selectedPass: Pass;
    selectedEvents: Event[];
    onToggleEvent: (event: Event) => void;
    validateEvent: (event: Event) => EventValidation;
    counts: SelectionCounts;
    isMobile: boolean;
}

type Category = "All" | "Technical" | "Non-Technical";
const CATEGORIES: Category[] = ["All", "Technical", "Non-Technical"];

export function EventSelectorStep({
    selectedPass,
    selectedEvents,
    onToggleEvent,
    validateEvent,
    counts,
    isMobile,
}: EventSelectorStepProps) {
    const [activeCategory, setActiveCategory] = useState<Category>("All");

    const filteredEvents =
        activeCategory === "All"
            ? EVENTS
            : EVENTS.filter((e) => e.type === activeCategory);

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="pb-2 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    📋 Select Events
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Choose events within your {selectedPass.name} pass limits
                </p>
            </div>

            {/* Counters bar */}
            <div className="flex flex-wrap gap-2 items-center">
                <CounterBadge
                    label="Selected"
                    current={counts.total}
                    max={counts.maxTotal}
                />
                <CounterBadge
                    label="Tech"
                    current={counts.tech}
                    max={counts.maxTech}
                />
                <CounterBadge
                    label="Non-Tech"
                    current={counts.nonTech}
                    max={counts.maxNonTech}
                />
            </div>

            {/* Category filter */}
            <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 text-[11px] font-bold border-2 rounded transition-colors ${activeCategory === cat
                                ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                                : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--text-muted)]"
                            }`}
                    >
                        {isMobile
                            ? cat === "Technical"
                                ? "Tech"
                                : cat === "Non-Technical"
                                    ? "Non-Tech"
                                    : cat
                            : cat}
                    </button>
                ))}
            </div>

            {/* Events grid */}
            <div
                className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
                    }`}
            >
                {filteredEvents.map((event) => {
                    const isSelected = selectedEvents.some((e) => e.id === event.id);
                    const validation = isSelected
                        ? { canSelect: true, reason: null }
                        : validateEvent(event);

                    return (
                        <EventSelectCard
                            key={event.id}
                            event={event}
                            isSelected={isSelected}
                            validation={validation}
                            onToggle={() => onToggleEvent(event)}
                            isMobile={isMobile}
                        />
                    );
                })}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-[var(--text-muted)] text-sm">
                    No events in this category.
                </div>
            )}
        </div>
    );
}

/* ─── Counter Badge ─── */
function CounterBadge({
    label,
    current,
    max,
}: {
    label: string;
    current: number;
    max: number;
}) {
    const isFull = current >= max;
    return (
        <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold transition-colors ${isFull
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10 text-[var(--accent-color)]"
                    : "border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                }`}
        >
            <span>{label}:</span>
            <span className="tabular-nums">
                {current} / {max}
            </span>
        </div>
    );
}

/* ─── Event Card ─── */
function EventSelectCard({
    event,
    isSelected,
    validation,
    onToggle,
}: {
    event: Event;
    isSelected: boolean;
    validation: EventValidation;
    onToggle: () => void;
    isMobile: boolean;
}) {
    const disabled = !isSelected && !validation.canSelect;

    return (
        <motion.button
            type="button"
            onClick={disabled ? undefined : onToggle}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`relative p-3 rounded border-2 text-left transition-all duration-200 ${isSelected
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                    : disabled
                        ? "border-[var(--border-color)] bg-[var(--surface-secondary)] opacity-50 cursor-not-allowed"
                        : "border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--text-muted)] cursor-pointer"
                }`}
        >
            {/* Checkbox indicator */}
            <div className="absolute top-3 right-3">
                <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected
                            ? "bg-[var(--accent-color)] border-[var(--accent-color)]"
                            : "border-[var(--border-color)] bg-transparent"
                        }`}
                >
                    {isSelected && (
                        <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                </div>
            </div>

            <div className="pr-8">
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${event.type === "Technical"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "bg-green-500/10 text-green-400 border border-green-500/20"
                            }`}
                    >
                        {event.type}
                    </span>
                    <span className="text-[10px] font-medium text-[var(--text-muted)]">
                        Track {event.track}
                    </span>
                </div>

                <h4 className="text-sm font-bold text-[var(--text-primary)] mb-1">
                    {event.title}
                </h4>

                <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mb-2">
                    {event.description}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {event.time}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {event.venue}
                    </span>
                    <span className="flex items-center gap-1">
                        <Users size={10} />
                        {event.team_size}
                    </span>
                </div>
            </div>

            {/* Validation error */}
            <AnimatePresence>
                {disabled && validation.reason && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400"
                    >
                        <AlertCircle size={10} />
                        <span>{validation.reason}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
