"use client";

import type { Event } from "../../../data/events";
import type { Pass } from "../../../data/eventValidation";
import { getSelectionCounts } from "../../../data/eventValidation";

interface SelectionSummaryProps {
  selectedEvents: Event[];
  pass: Pass;
}

export function SelectionSummary({
  selectedEvents,
  pass,
}: SelectionSummaryProps) {
  const counts = getSelectionCounts(selectedEvents, pass);

  return (
    <div className="flex-shrink-0 px-4 py-2.5 border-b-2 border-[var(--border-color)] bg-[var(--surface-bg)]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-[#F54E00]">{pass.name}</span>
          <span className="text-[11px] text-[var(--text-muted)]">—</span>
          <span className="text-[11px] text-[var(--text-secondary)]">
            {counts.total} / {counts.maxTotal} selected
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Tech: {counts.tech}/{counts.maxTech}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-[11px] font-mono text-[var(--text-secondary)]">
              Non-Tech: {counts.nonTech}/{counts.maxNonTech}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-1.5 h-1 bg-[var(--surface-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#F54E00] transition-all duration-300 rounded-full"
          style={{
            width: `${Math.min((counts.total / counts.maxTotal) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
