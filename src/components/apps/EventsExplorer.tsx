"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { eventDetails } from "../../data/details/event_data";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDesktop } from "../../contexts/DesktopContext";
import { EventCard } from "./events/EventCard";

import { useMobileAppPersistence } from "../../hooks/useMobileAppPersistence";

// Flatten and categorize events from the detailed data source
const EVENTS = [
  ...eventDetails.technicalEvents.map((e) => ({ ...e, type: "Technical", category: "Paper/Project" })),
  ...eventDetails.technicalIndividualEvents.map((e) => ({ ...e, type: "Technical", category: "Individual" })),
  ...eventDetails.nonTechnicalEvents.map((e) => ({ ...e, type: "Non-Technical", category: "Fun" })),
];

type CategoryFilter = "All" | "Technical" | "Non-Technical";

const CATEGORIES: CategoryFilter[] = ["All", "Technical", "Non-Technical"];

export function EventsExplorer({ initialEventId }: { initialEventId?: string }) {
  const { isMobile } = useIsMobile();
  const { openApp } = useDesktop();

  // Persist category selection and expanded event
  const [activeCategory, setActiveCategory] = useMobileAppPersistence<CategoryFilter>("events-category", "All");
  const [expandedId, setExpandedId] = useMobileAppPersistence<string | null>("events-expanded", null);

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
  }, [initialEventId]);

  const filteredEvents = useMemo(
    () =>
      activeCategory === "All"
        ? EVENTS
        : EVENTS.filter((e) => e.type === activeCategory),
    [activeCategory]
  );

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleRegister = useCallback(() => {
    // Open Register app
    setTimeout(() => {
      openApp("register");
    }, 0);
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
            onClick={handleRegister}
            className="flex-shrink-0 px-4 py-1.5 text-xs font-bold border border-[var(--accent-color)] bg-[var(--accent-color)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 active:translate-y-[1px] rounded-full shadow-md hover:shadow-lg"
          >
            Register Now →
          </button>
        </div>
      </div>

      {/* Events Grid - Always Visible */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[var(--border-color)] hover:scrollbar-thumb-[var(--accent-color)]/50">
        <div
          className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isExpanded={expandedId === event.id}
              onToggleExpand={() => handleToggleExpand(event.id)}
              isMobile={isMobile}
            />
          ))}
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
