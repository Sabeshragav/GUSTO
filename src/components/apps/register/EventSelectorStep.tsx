"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, Clock, Send, FileText, Zap } from "lucide-react";
import { EVENTS, type Event } from "../../../data/events";
import { getValidFallbacks } from "../../../data/eventValidation";
import type {
  SelectionCounts,
  EventValidation,
} from "../../../hooks/useEventValidation";

/* ─── Event type badge colors ─── */
function getEventTypeBadge(eventType: string) {
  switch (eventType) {
    case "ABSTRACT":
      return {
        label: "Abstract",
        icon: FileText,
        color: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      };
    case "DIRECT":
      return {
        label: "Direct",
        icon: Zap,
        color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      };
    case "SUBMISSION":
      return {
        label: "Online Submission",
        icon: Send,
        color: "bg-green-500/20 text-green-300 border-green-500/30",
      };
    default:
      return {
        label: eventType,
        icon: FileText,
        color: "bg-gray-500/20 text-gray-300 border-gray-500/30",
      };
  }
}

/* ─── Event card ─── */
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
}) {
  const badge = getEventTypeBadge(event.eventType);
  const BadgeIcon = badge.icon;

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (isSelected || validation.canSelect) onToggle();
      }}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
        isSelected
          ? "border-[var(--accent-color)] bg-[var(--accent-color)]/10"
          : validation.canSelect
            ? "border-[var(--border-color)] hover:border-[var(--text-muted)] bg-[var(--surface-secondary)]"
            : "border-[var(--border-color)] opacity-50 cursor-not-allowed bg-[var(--surface-secondary)]"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-[12px] font-bold text-[var(--text-primary)] truncate">
              {event.title}
            </h4>
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-semibold rounded border ${badge.color}`}
            >
              <BadgeIcon size={9} />
              {badge.label}
            </span>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] line-clamp-2">
            {event.description}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[9px] text-[var(--text-muted)] flex items-center gap-1">
              <Clock size={9} />
              {event.time}
            </span>
            <span className="text-[9px] text-[var(--text-muted)]">
              {event.venue}
            </span>
            <span className="text-[9px] text-[var(--text-muted)]">
              Team: {event.team_size}
            </span>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isSelected
              ? "border-[var(--accent-color)] bg-[var(--accent-color)]"
              : "border-[var(--text-muted)]"
          }`}
        >
          {isSelected && <Check size={11} className="text-white" />}
        </div>
      </div>

      {/* Validation warning */}
      {!isSelected && !validation.canSelect && validation.reason && (
        <div className="flex items-center gap-1 mt-2 text-[9px] text-amber-400">
          <AlertTriangle size={10} />
          {validation.reason}
        </div>
      )}
    </motion.button>
  );
}

/* ─── Fallback selector ─── */
function FallbackSelector({
  abstractEvent,
  selectedEvents,
  allEvents,
  currentFallback,
  onFallbackChange,
}: {
  abstractEvent: Event;
  selectedEvents: Event[];
  allEvents: Event[];
  currentFallback: string;
  onFallbackChange: (abstractEventId: string, fallbackEventId: string) => void;
}) {
  const validFallbacks = getValidFallbacks(
    selectedEvents,
    abstractEvent,
    allEvents,
  );

  return (
    <div className="mt-2 p-2.5 rounded-lg bg-purple-500/5 border border-purple-500/20">
      <p className="text-[10px] text-purple-300 font-semibold mb-1.5">
        ⚠️ Fallback event for &quot;{abstractEvent.title}&quot;
      </p>
      <p className="text-[9px] text-[var(--text-muted)] mb-2">
        If your abstract is rejected, you&apos;ll be auto-registered for this
        event instead:
      </p>
      <select
        value={currentFallback}
        onChange={(e) => onFallbackChange(abstractEvent.id, e.target.value)}
        className="w-full text-[11px] px-2 py-1.5 rounded border border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)]"
      >
        <option value="">Select fallback event...</option>
        {validFallbacks.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title} ({e.time})
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Main component ─── */
interface EventSelectorStepProps {
  selectedEvents: Event[];
  onToggleEvent: (event: Event) => void;
  validateEvent: (event: Event) => EventValidation;
  counts: SelectionCounts;
  isMobile: boolean;
  fallbackSelections: Record<string, string>;
  onFallbackChange: (abstractEventId: string, fallbackEventId: string) => void;
  allEvents: Event[];
}

export function EventSelectorStep({
  selectedEvents,
  onToggleEvent,
  validateEvent,
  counts,
  isMobile,
  fallbackSelections,
  onFallbackChange,
  allEvents,
}: EventSelectorStepProps) {
  const techEvents = EVENTS.filter((e) => e.type === "Technical");
  const nonTechEvents = EVENTS.filter((e) => e.type === "Non-Technical");
  const abstractSelected = selectedEvents.filter(
    (e) => e.eventType === "ABSTRACT",
  );

  return (
    <div className="space-y-4">
      {/* Selection rule info */}
      <div className="p-3 rounded-lg bg-[var(--accent-color)]/5 border border-[var(--border-color)]">
        <p className="text-[11px] font-semibold text-[var(--accent-color)]">
          Select 1 to 3 events
        </p>
        <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
          Max 2 Technical + Max 2 Non-Technical. At least 1 event required.
        </p>
      </div>

      {/* Counters */}
      <div className="flex gap-2">
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
            counts.tech > 0
              ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
              : "border-[var(--border-color)] text-[var(--text-muted)]"
          }`}
        >
          Tech: {counts.tech}/2
        </span>
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
            counts.nonTech > 0
              ? "bg-green-500/10 border-green-500/30 text-green-300"
              : "border-[var(--border-color)] text-[var(--text-muted)]"
          }`}
        >
          Non-Tech: {counts.nonTech}/2
        </span>
        <span
          className={`px-2.5 py-1 rounded text-[10px] font-bold border ${
            counts.total === 3
              ? "bg-[var(--accent-color)]/10 border-[var(--accent-color)] text-[var(--accent-color)]"
              : "border-[var(--border-color)] text-[var(--text-muted)]"
          }`}
        >
          Total: {counts.total}/3
        </span>
      </div>

      {/* Technical Events */}
      <div>
        <h3 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
          Technical Events
        </h3>
        <div className="space-y-2">
          {techEvents.map((event) => {
            const isSelected = selectedEvents.some((e) => e.id === event.id);
            return (
              <div key={event.id}>
                <EventSelectCard
                  event={event}
                  isSelected={isSelected}
                  validation={validateEvent(event)}
                  onToggle={() => onToggleEvent(event)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Technical Events */}
      <div>
        <h3 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
          Non-Technical Events
        </h3>
        <div className="space-y-2">
          {nonTechEvents.map((event) => {
            const isSelected = selectedEvents.some((e) => e.id === event.id);
            return (
              <div key={event.id}>
                <EventSelectCard
                  event={event}
                  isSelected={isSelected}
                  validation={validateEvent(event)}
                  onToggle={() => onToggleEvent(event)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
