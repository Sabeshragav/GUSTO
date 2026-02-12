"use client";

import { useState, useCallback, useMemo } from "react";
import { EVENTS, type Event } from "../../data/events";
import {
  PASSES,
  validateSelection,
  type Pass,
  type ValidationResult,
} from "../../data/eventValidation";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useDesktop } from "../../contexts/DesktopContext";
import { PassSelector } from "./events/PassSelector";
import { EventCard } from "./events/EventCard";
import { SelectionSummary } from "./events/SelectionSummary";

type CategoryFilter = "All" | "Technical" | "Non-Technical";

const CATEGORIES: CategoryFilter[] = ["All", "Technical", "Non-Technical"];

export function EventsExplorer() {
  const { isMobile } = useIsMobile();
  const { openApp } = useDesktop();
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const filteredEvents = useMemo(
    () =>
      activeCategory === "All"
        ? EVENTS
        : EVENTS.filter((e) => e.type === activeCategory),
    [activeCategory],
  );

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const handleSelectPass = useCallback((pass: Pass) => {
    setSelectedPass(pass);
    setSelectedEvents([]); // Reset selections when changing pass
  }, []);

  const handleToggleSelect = useCallback(
    (event: Event) => {
      setSelectedEvents((prev) => {
        const exists = prev.some((e) => e.id === event.id);
        if (exists) {
          return prev.filter((e) => e.id !== event.id);
        }
        // Validate before adding
        if (!selectedPass) return prev;
        const result = validateSelection(prev, selectedPass, event);
        if (!result.isValid) return prev;
        return [...prev, event];
      });
    },
    [selectedPass],
  );

  const getValidation = useCallback(
    (event: Event): ValidationResult => {
      if (!selectedPass)
        return { isValid: false, message: "Select a pass first" };
      return validateSelection(selectedEvents, selectedPass, event);
    },
    [selectedEvents, selectedPass],
  );

  const canProceed = selectedPass !== null && selectedEvents.length >= 1;

  const handleProceed = useCallback(() => {
    if (!canProceed) return;
    // Defer so the register window opens after the events window's
    // mousedown → focusWindow handler finishes, keeping it on top.
    setTimeout(() => {
      openApp("register", { tier: selectedPass, events: selectedEvents });
    }, 0);
  }, [canProceed, selectedPass, selectedEvents, openApp]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
        <div className="flex items-center justify-between gap-2 mb-2">
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
                    ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                    : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[#6C63FF]"
                }`}
                style={{ borderRadius: "4px" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!canProceed}
            className={`flex-shrink-0 px-4 py-1.5 text-xs font-bold border-2 transition-all duration-200 active:translate-y-[1px] ${
              canProceed
                ? "bg-[#6C63FF] text-white border-[#6C63FF] hover:bg-[#5A52E0] hover:border-[#5A52E0]"
                : "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)] opacity-50 cursor-not-allowed"
            }`}
            style={{ borderRadius: "4px" }}
          >
            Proceed →
          </button>
        </div>

        <div className="flex justify-end items-center">
          {/* Inline validation hint */}
          {!canProceed && selectedPass && selectedEvents.length === 0 && (
            <p className="text-[11px] text-amber-400 mt-1">
              ⚠ Select at least 1 event to proceed
            </p>
          )}
          {/* {!selectedPass && (
            <p className="text-[11px] text-[var(--text-muted)] mt-1">
              Select a tier and at least 1 event to proceed
            </p>
          )} */}
        </div>
      </div>

      {/* Pass Selector */}
      <PassSelector
        selectedPassId={selectedPass?.id ?? null}
        onSelectPass={handleSelectPass}
        isMobile={isMobile}
      />

      {/* Selection Summary */}
      {selectedPass && (
        <SelectionSummary selectedEvents={selectedEvents} pass={selectedPass} />
      )}

      {/* Events Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {!selectedPass && (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            <div className="text-3xl mb-2">🎟️</div>
            Select a pass above to start choosing events
          </div>
        )}

        <div
          className={`grid gap-4 ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isSelected={selectedEvents.some((e) => e.id === event.id)}
              isExpanded={expandedId === event.id}
              onToggleExpand={() => handleToggleExpand(event.id)}
              onToggleSelect={() => handleToggleSelect(event)}
              validation={getValidation(event)}
              passSelected={!!selectedPass}
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
