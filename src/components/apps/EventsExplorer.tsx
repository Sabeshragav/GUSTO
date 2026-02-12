"use client";

import { useState, useCallback } from "react";
import { EVENTS, type Event } from "../../data/events";
import { useIsMobile } from "../../hooks/useIsMobile";

type CategoryFilter = "All" | "Technical" | "Non-Technical";

const CATEGORIES: CategoryFilter[] = ["All", "Technical", "Non-Technical"];

function EventCard({
  event,
  isExpanded,
  onToggle,
}: {
  event: Event;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const categoryColor =
    event.type === "Technical"
      ? "bg-[var(--ph-orange)] text-white"
      : "bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border-color)]";

  return (
    <div
      className="border-2 border-[var(--border-color)] bg-[var(--surface-primary)] transition-shadow hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]"
      style={{ borderRadius: "2px" }}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${categoryColor}`}
          >
            {event.type}
          </span>
          <span className="text-xs font-mono text-[var(--text-muted)] whitespace-nowrap">
            {event.fee}
          </span>
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] mb-1 leading-tight">
          {event.title}
        </h3>

        <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3">
          {event.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
          <span>👥 {event.team_size}</span>
          <span>📍 {event.venue}</span>
        </div>

        <button
          onClick={onToggle}
          className="w-full px-4 py-2 text-sm font-bold bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:bg-[var(--ph-orange)] hover:text-white hover:border-[var(--ph-orange)] transition-colors active:translate-y-[1px]"
        >
          {isExpanded ? "Hide Details" : "View Details"}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t-2 border-[var(--border-color)] p-4 bg-[var(--surface-bg)] animate-fade-in">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)]">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Time
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.time}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)]">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Date
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.date}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)]">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Team Size
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.team_size}
              </span>
            </div>
            <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)]">
              <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                Fee
              </span>
              <span className="font-mono text-sm text-[var(--text-primary)]">
                {event.fee}
              </span>
            </div>
          </div>

          <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2 border-b border-[var(--border-color)] pb-1">
            Rules & Guidelines
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[var(--text-secondary)] marker:text-[var(--ph-orange)]">
            {event.rules.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function EventsExplorer() {
  const { isMobile } = useIsMobile();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents =
    activeCategory === "All"
      ? EVENTS
      : EVENTS.filter((e) => e.type === activeCategory);

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          GUSTO 2026 — Events
        </h2>

        {/* Category Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setExpandedId(null);
              }}
              className={`px-3 py-1.5 text-xs font-bold border-2 transition-colors active:translate-y-[1px] min-h-[36px] ${
                activeCategory === cat
                  ? "bg-[var(--ph-orange)] text-white border-[var(--ph-orange)]"
                  : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--ph-orange)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isExpanded={expandedId === event.id}
              onToggle={() => handleToggle(event.id)}
            />
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 text-[var(--text-muted)]">
            No events in this category.
          </div>
        )}
      </div>
    </div>
  );
}
