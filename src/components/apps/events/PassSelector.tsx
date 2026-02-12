"use client";

import { PASSES, type Pass } from "../../../data/eventValidation";

interface PassSelectorProps {
  selectedPassId: string | null;
  onSelectPass: (pass: Pass) => void;
  onClearPass: () => void;
  isMobile: boolean;
}

export function PassSelector({
  selectedPassId,
  onSelectPass,
  onClearPass,
  isMobile,
}: PassSelectorProps) {
  const selectedPass = PASSES.find((p) => p.id === selectedPassId);

  // ── Compact pill when a pass is already chosen ──
  if (selectedPass) {
    return (
      <div className="flex-shrink-0 px-4 py-2 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Pass:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-[#6C63FF]/15 text-[#6C63FF] border border-[#6C63FF]/30">
            {selectedPass.name}
            <span className="mx-0.5 text-[10px] opacity-60">•</span>₹
            {selectedPass.price}
            <span className="mx-0.5 text-[10px] opacity-60">•</span>
            <span className="font-normal text-[11px]">
              {selectedPass.description}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClearPass();
              }}
              className="ml-1 w-4 h-4 flex items-center justify-center rounded-full bg-[#6C63FF]/20 hover:bg-[#6C63FF]/40 transition-colors text-[#6C63FF] text-[10px] leading-none"
              aria-label="Change pass"
            >
              ✕
            </button>
          </span>
        </div>
      </div>
    );
  }

  // ── Full pass selector cards ──
  return (
    <div className="flex-shrink-0 px-4 py-3 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
        Select Your Pass
      </h3>
      <div
        className={`flex gap-2 ${
          isMobile
            ? "overflow-x-auto overflow-y-visible pt-2.5 pb-1 -mx-1 px-1 pr-2 snap-x"
            : "pt-2.5"
        }`}
      >
        {PASSES.map((pass) => (
          <button
            key={pass.id}
            onClick={() => onSelectPass(pass)}
            className={`relative flex-shrink-0 text-left border-2 transition-all duration-200 ${
              isMobile ? "min-w-[140px] snap-start p-2.5" : "flex-1 p-3"
            } border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[#6C63FF] hover:bg-[#6C63FF]/5`}
            style={{ borderRadius: "6px" }}
          >
            {/* Price badge */}
            <span className="absolute -top-2 -right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--surface-primary)] text-[var(--text-muted)] border border-[var(--border-color)]">
              ₹{pass.price}
            </span>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold text-[var(--text-primary)]">
                {pass.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[var(--surface-primary)] text-[var(--text-muted)]">
                Max {pass.maxTotal}
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
              {pass.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
