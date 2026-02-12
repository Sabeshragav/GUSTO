"use client";

import { PASSES, type Pass } from "../../../data/eventValidation";

interface PassSelectorProps {
  selectedPassId: string | null;
  onSelectPass: (pass: Pass) => void;
  isMobile: boolean;
}

export function PassSelector({
  selectedPassId,
  onSelectPass,
  isMobile,
}: PassSelectorProps) {
  return (
    <div className="flex-shrink-0 px-4 py-3 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
        Select Your Pass
      </h3>
      <div
        className={`flex gap-2 ${
          isMobile ? "overflow-x-auto pb-1 -mx-1 px-1 snap-x" : ""
        }`}
      >
        {PASSES.map((pass) => {
          const isSelected = selectedPassId === pass.id;
          return (
            <button
              key={pass.id}
              onClick={() => onSelectPass(pass)}
              className={`flex-shrink-0 text-left border-2 transition-all duration-200 ${
                isMobile ? "min-w-[140px] snap-start p-2.5" : "flex-1 p-3"
              } ${
                isSelected
                  ? "border-[#6C63FF] bg-[#6C63FF]/10"
                  : "border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--text-muted)]"
              }`}
              style={{ borderRadius: "6px" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-sm font-bold ${
                    isSelected ? "text-[#6C63FF]" : "text-[var(--text-primary)]"
                  }`}
                >
                  {pass.name}
                </span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isSelected
                      ? "bg-[#6C63FF]/20 text-[#6C63FF]"
                      : "bg-[var(--surface-primary)] text-[var(--text-muted)]"
                  }`}
                >
                  Max {pass.maxTotal}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                {pass.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
