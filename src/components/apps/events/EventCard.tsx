"use client";

import type { Event } from "../../../data/events";
import type { ValidationResult } from "../../../data/eventValidation";

interface EventCardProps {
  event: Event;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  validation: ValidationResult;
  passSelected: boolean;
  isMobile: boolean;
}

export function EventCard({
  event,
  isSelected,
  isExpanded,
  onToggleExpand,
  onToggleSelect,
  validation,
  passSelected,
  isMobile,
}: EventCardProps) {
  const techBadge =
    event.type === "Technical"
      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
      : "bg-purple-500/15 text-purple-400 border border-purple-500/30";

  const trackBadge =
    "bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]";

  const canSelect = !isSelected && validation.isValid;
  const showWarning = !isSelected && !validation.isValid && passSelected;

  return (
    <div
      className={`border-2 bg-[var(--surface-primary)] transition-all duration-200 ${
        isSelected
          ? "border-[#6C63FF] shadow-[0_0_0_1px_rgba(108,99,255,0.3)]"
          : "border-[var(--border-color)]"
      } ${!isMobile ? "hover:scale-[1.01] hover:shadow-md" : "active:scale-[0.99]"}`}
      style={{ borderRadius: "6px" }}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        {/* Title + Type badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
            {event.title}
          </h3>
          {isSelected && (
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#6C63FF] flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3 h-3"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          )}
        </div>

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${techBadge}`}
          >
            {event.type}
          </span>
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${trackBadge}`}
          >
            Track {event.track}
          </span>
          <span className="text-[11px] font-mono text-[var(--text-muted)]">
            {event.timeSlot}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3">
          {event.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onToggleSelect}
            disabled={!passSelected || (!canSelect && !isSelected)}
            className={`flex-1 px-3 py-2 text-xs font-bold border-2 transition-all duration-200 active:translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed ${
              isSelected
                ? "bg-[#6C63FF] text-white border-[#6C63FF] hover:bg-[#5A52E0]"
                : canSelect
                  ? "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[#6C63FF] hover:text-[#6C63FF]"
                  : "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)]"
            }`}
            style={{ borderRadius: "4px" }}
          >
            {isSelected ? "✓ Selected" : "Select"}
          </button>
          <button
            onClick={onToggleExpand}
            className="px-3 py-2 text-xs font-bold bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors active:translate-y-[1px]"
            style={{ borderRadius: "4px" }}
          >
            {isExpanded ? "Hide" : "Details"}
          </button>
        </div>

        {/* Inline warning */}
        {showWarning && validation.message && (
          <div className="mt-2 px-2.5 py-1.5 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
            ⚠ {validation.message}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t-2 border-[var(--border-color)] p-4 bg-[var(--surface-bg)]">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)] rounded">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Time
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.time}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)] rounded">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Date
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.date}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)] rounded">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Team Size
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.team_size}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)] rounded">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Venue
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.venue}
              </span>
            </div>
          </div>

          <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 border-b border-[var(--border-color)] pb-1">
            Rules & Guidelines
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)] marker:text-[#6C63FF]">
            {event.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
