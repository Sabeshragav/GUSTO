"use client";

import type { Event } from "../../../data/events";

interface EventCardProps {
  event: Event;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
}

export function EventCard({
  event,
  isExpanded,
  onToggleExpand,
  isMobile,
}: EventCardProps) {
  const techBadge =
    event.type === "Technical"
      ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
      : "bg-purple-500/15 text-purple-400 border border-purple-500/30";

  const trackBadge =
    "bg-[var(--surface-secondary)] text-[var(--text-muted)] border border-[var(--border-color)]";

  return (
    <div
      className={`border-2 border-[var(--border-color)] bg-[var(--surface-primary)] transition-all duration-200 ${!isMobile ? "hover:scale-[1.01] hover:shadow-md" : "active:scale-[0.99]"
        }`}
      style={{ borderRadius: "6px" }}
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        {/* Title + Type badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold text-[var(--text-primary)] leading-tight">
            {event.title}
          </h3>
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

        {/* Description — full when expanded, truncated otherwise */}
        <p
          className={`text-sm text-[var(--text-secondary)] leading-relaxed mb-3 ${isExpanded ? "" : "line-clamp-2"
            }`}
        >
          {event.description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onToggleExpand}
            className="w-full px-3 py-2 text-xs font-bold bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors active:translate-y-[1px]"
            style={{ borderRadius: "4px" }}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </div>
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
          <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)] marker:text-[#F54E00]">
            {event.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
