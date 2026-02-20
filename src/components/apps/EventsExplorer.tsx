"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { eventDetails } from "../../data/details/event_data";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDesktop } from "../../contexts/DesktopContext";
import { EventCard } from "./events/EventCard";
import { GENERAL_RULES } from "../../data/rules_data";
import { Info } from "lucide-react";

import { useMobileAppPersistence } from "../../hooks/useMobileAppPersistence";

// Flatten and categorize events from the detailed data source
const EVENTS = [
  ...eventDetails.technicalEvents.map((e) => ({
    ...e,
    type: "Technical",
    category: "Paper/Project",
  })),
  ...eventDetails.technicalIndividualEvents.map((e) => ({
    ...e,
    type: "Technical",
    category: "Individual",
  })),
  ...eventDetails.nonTechnicalEvents.map((e) => ({
    ...e,
    type: "Non-Technical",
    category: "Fun",
  })),
];

type CategoryFilter = "All" | "Technical" | "Non-Technical" | "General";

const CATEGORIES: CategoryFilter[] = ["All", "Technical", "Non-Technical", "General"];

import { useSEO } from "../../hooks/useSEO";

export function EventsExplorer({
  initialEventId,
}: {
  initialEventId?: string;
}) {
  useSEO("events");
  const { isMobile } = useIsMobile();
  const { openApp } = useDesktop();

  // Persist category selection and expanded event
  const [activeCategory, setActiveCategory] =
    useMobileAppPersistence<CategoryFilter>("events-category", "All");
  const [expandedId, setExpandedId] = useMobileAppPersistence<string | null>(
    "events-expanded",
    null,
  );

  // Handle deep linking from widget
  useEffect(() => {
    if (initialEventId) {
      setExpandedId(initialEventId);
      const evt = EVENTS.find((e) => e.id === initialEventId);
      if (evt) {
        // Ensure category matches so it's visible
        if (evt.type !== activeCategory && activeCategory !== "All") {
          setActiveCategory(evt.type as CategoryFilter);
        }
      }
    }
  }, [initialEventId, activeCategory, setActiveCategory, setExpandedId]);

  const filteredEvents = useMemo(
    () =>
      activeCategory === "All"
        ? EVENTS
        : EVENTS.filter((e) => e.type === activeCategory),
    [activeCategory],
  );

  const handleToggleExpand = useCallback(
    (id: string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    [setExpandedId],
  );

  const handleRegister = useCallback(() => {
    openApp("register");
  }, [openApp]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--surface-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--surface-primary)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          {/* Category Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const label = isMobile
                ? cat === "Technical"
                  ? "Tech"
                  : cat === "Non-Technical"
                    ? "Non-Tech"
                    : cat
                : cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setExpandedId(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold border transition-colors active:translate-y-[1px] rounded-full shadow-sm ${activeCategory === cat
                    ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)]"
                    : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--accent-color)]"
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Register Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRegister();
            }}
            className="flex-shrink-0 px-4 py-1.5 text-xs font-bold border border-[var(--accent-color)] bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 active:translate-y-[1px] rounded-full shadow-md hover:shadow-lg"
          >
            Register Now →
          </button>
        </div>
      </div>

      {/* Events Grid - Always Visible */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[var(--border-color)] hover:scrollbar-thumb-[var(--accent-color)]/50">
        <div
          className={`grid gap-4 ${isMobile
            ? "grid-cols-1"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {activeCategory !== "General" ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isExpanded={expandedId === event.id}
                onToggleExpand={() => handleToggleExpand(event.id)}
                isMobile={isMobile}
              />
            ))
          ) : (
            <div className="col-span-full bg-[var(--surface-primary)] border-2 border-[var(--border-color)] rounded-lg p-6 shadow-sm border-l-4 border-l-[var(--accent-color)]">
              <div className="flex items-center gap-3 mb-6 border-b border-[var(--border-color)] pb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--accent-color)]/10 flex items-center justify-center text-[var(--accent-color)]">
                  <Info size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">General Rules & Guidelines</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">GUSTO 2026 Symposium Protocol</p>
                </div>
              </div>

              <div className="space-y-4">
                {GENERAL_RULES.map((rule, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <span className="flex-shrink-0 w-6 h-6 rounded bg-[var(--surface-secondary)] border border-[var(--border-color)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--ph-orange)] group-hover:bg-[var(--accent-color)] group-hover:text-white transition-colors">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-0.5">
                      {rule}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <p className="text-xs text-blue-400 leading-relaxed font-medium">
                  <strong>Important:</strong> These rules apply to all participants. Please read event-specific rules in their respective cards for additional requirements.
                </p>
              </div>
            </div>
          )}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 text-[var(--text-muted)] flex flex-col items-center">
            <span className="text-4xl mb-2 opacity-20">📅</span>
            <p>No events found in this category.</p>
          </div>
        )}

        {/* Footer Padding */}
        <div className="h-20" />
      </div>
    </div>
  );
}
