"use client";

import { useState, useCallback, useMemo } from "react";
import { EVENTS } from "../../data/events";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDesktop } from "../../contexts/DesktopContext";
import { EventCard } from "./events/EventCard";

type CategoryFilter = "All" | "Technical" | "Non-Technical";

const CATEGORIES: CategoryFilter[] = ["All", "Technical", "Non-Technical"];

export function EventsExplorer() {
  const { isMobile } = useIsMobile();
  const { openApp } = useDesktop();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

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
    // Open Register app (simulating going to registration desk)
    // We defer slightly to ensure window focus handling is smooth
    setTimeout(() => {
      openApp("register");
    }, 0);
  }, [openApp]);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--surface-bg)]">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
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
                  className={`px-3 py-1.5 text-xs font-bold border-2 transition-colors active:translate-y-[1px] min-h-[36px] ${activeCategory === cat
                      ? "bg-[#F54E00] text-white border-[#F54E00]"
                      : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[#F54E00]"
                    }`}
                  style={{ borderRadius: "4px" }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            className="flex-shrink-0 px-4 py-1.5 text-xs font-bold border-2 border-[#F54E00] bg-[#F54E00] text-white hover:bg-[#D64000] hover:border-[#D64000] transition-all duration-200 active:translate-y-[1px]"
            style={{ borderRadius: "4px" }}
          >
            Register Now →
          </button>
        </div>
      </div>

      {/* Events Grid - Always Visible */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
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
          <div className="text-center py-12 text-[var(--text-muted)]">
            No events in this category.
          </div>
        )}
      </div>
    </div>
  );
}
