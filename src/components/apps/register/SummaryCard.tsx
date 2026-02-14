"use client";

import { REGISTRATION_PRICE } from "../../../data/events";
import type { Event } from "../../../data/events";

interface SummaryCardProps {
  selectedEvents: Event[];
  isMobile: boolean;
}

export function SummaryCard({ selectedEvents, isMobile }: SummaryCardProps) {
  return (
    <div className="p-3 rounded-lg border-2 border-[var(--border-color)] bg-[var(--accent-color)]/5">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] font-bold text-[var(--text-primary)]">
          Registration Summary
        </h4>
        <span className="text-[13px] font-bold text-[var(--accent-color)]">
          ₹{REGISTRATION_PRICE}
        </span>
      </div>

      {selectedEvents.length > 0 ? (
        <div className="space-y-1">
          {selectedEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between text-[10px]"
            >
              <span className="text-[var(--text-muted)] truncate">
                {event.title}
              </span>
              <span
                className={`ml-2 px-1.5 py-0.5 rounded text-[8px] font-semibold ${
                  event.type === "Technical"
                    ? "bg-blue-500/10 text-blue-300"
                    : "bg-green-500/10 text-green-300"
                }`}
              >
                {event.type === "Technical" ? "Tech" : "Non-Tech"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-[var(--text-muted)]">
          No events selected yet
        </p>
      )}
    </div>
  );
}
