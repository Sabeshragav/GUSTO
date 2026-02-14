"use client";

import type { Event } from "../../../data/events";
import { getValidFallbacks } from "../../../data/eventValidation";

interface FallbackStepProps {
  abstractEvents: Event[];
  selectedEvents: Event[];
  allEvents: Event[];
  fallbackSelections: Record<string, string>;
  onFallbackChange: (abstractEventId: string, fallbackEventId: string) => void;
  isMobile: boolean;
}

export function FallbackStep({
  abstractEvents,
  selectedEvents,
  allEvents,
  fallbackSelections,
  onFallbackChange,
}: FallbackStepProps) {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-[var(--border-color)]">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          🔄 Fallback Events
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Choose a fallback event for each abstract-based event. If your
          abstract is not shortlisted, you&apos;ll be auto-registered for the
          fallback.
        </p>
      </div>

      {abstractEvents.length === 0 ? (
        <div className="p-4 rounded-lg border border-[var(--border-color)] bg-[var(--surface-secondary)] text-center">
          <p className="text-[11px] text-[var(--text-muted)]">
            ✅ No abstract events selected — no fallbacks needed. You can
            proceed to the next step.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {abstractEvents.map((ae) => {
            const validFallbacks = getValidFallbacks(
              selectedEvents,
              ae,
              allEvents,
            );

            return (
              <div
                key={ae.id}
                className="p-3 rounded-lg bg-purple-500/5 border border-[var(--border-color)]"
              >
                <p className="text-[11px] text-purple-300 font-semibold mb-1">
                  ⚠️ Fallback for &quot;{ae.title}&quot;
                </p>
                <p className="text-[9px] text-[var(--text-muted)] mb-2">
                  If your abstract is rejected, you&apos;ll be auto-registered
                  for this event instead:
                </p>
                <select
                  value={fallbackSelections[ae.id] || ""}
                  onChange={(e) => onFallbackChange(ae.id, e.target.value)}
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
          })}
        </div>
      )}
    </div>
  );
}
