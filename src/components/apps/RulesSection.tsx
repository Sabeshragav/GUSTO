"use client";

import { useIsMobile } from "../../hooks/useIsMobile";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Type,
  Palette,
  Undo2,
  Redo2,
  Printer,
  Save,
  ChevronDown,
  Minus,
  Plus,
  FileText,
} from "lucide-react";

import { useSEO } from "../../hooks/useSEO";

const GENERAL_RULES = [
  "All participants must carry a valid college ID card for entry.",
  "Registration is mandatory for all events.",
  "Participants must report to their respective event venues at least 15 minutes before the scheduled time.",
  "Any form of malpractice or use of unauthorized materials will lead to immediate disqualification.",
  "The decision of the judges and organizing committee is final and binding.",
  "Participants must maintain discipline and decorum throughout the event.",
  "Mobile phones must be switched off or kept in silent mode during technical events.",
  "Participants are responsible for their belongings. The organizing committee is not liable for any loss.",
  "Cross-college teams are allowed only where explicitly stated in event-specific rules.",
  "All submissions (abstracts, photos, memes) must be original work. Plagiarism will result in disqualification.",
  "Event timings and venues are subject to change. Participants will be notified of any updates.",
  "Lunch and refreshments will be provided to registered participants.",
  "Certificate of participation will be provided to all registered participants.",
  "Winners will be awarded certificates and prizes during the valedictory ceremony.",
];

const CODE_OF_CONDUCT = [
  "Be respectful to fellow participants, volunteers, and organizers.",
  "Do not damage college property or infrastructure.",
  "Follow all safety guidelines provided by the organizing team.",
  "Report any issues or emergencies to the nearest volunteer or organizer.",
  "Smoking and consumption of alcohol is strictly prohibited on campus.",
];

function ToolbarButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
        active
          ? "bg-[var(--accent-color)]/20 text-[var(--accent-color)]"
          : "text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
      }`}
      onClick={(e) => e.preventDefault()}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-[var(--border-color)] mx-0.5" />;
}

export function RulesSection() {
  useSEO("rules");
  const { isMobile } = useIsMobile();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--surface-bg)]">
      {/* Menu Bar */}
      <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[var(--surface-primary)] border-b border-[var(--border-color)] text-[10px] font-medium text-[var(--text-muted)]">
        {["File", "Edit", "View", "Insert", "Format", "Tools", "Help"].map(
          (item) => (
            <button
              key={item}
              className="px-2 py-0.5 rounded hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              {item}
            </button>
          )
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-1.5">
          <button
            className="p-1 rounded hover:bg-[var(--surface-secondary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Save size={12} />
          </button>
          <button
            className="p-1 rounded hover:bg-[var(--surface-secondary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Printer size={12} />
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex-shrink-0 px-2 py-1.5 bg-[var(--surface-primary)] border-b border-[var(--border-color)] flex items-center gap-0.5 flex-wrap">
        {/* Undo / Redo */}
        <ToolbarButton>
          <Undo2 size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Redo2 size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Font Family */}
        <button
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-[var(--text-primary)] bg-[var(--surface-secondary)] border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors min-w-[90px]"
          onClick={(e) => e.preventDefault()}
        >
          <Type size={12} />
          <span className="truncate">Inter</span>
          <ChevronDown size={10} className="ml-auto opacity-50" />
        </button>

        {/* Font Size */}
        <div className="flex items-center border border-[var(--border-color)] rounded bg-[var(--surface-secondary)] overflow-hidden">
          <button
            className="px-1 py-1 text-[var(--text-muted)] hover:bg-[var(--surface-primary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Minus size={10} />
          </button>
          <span className="px-1.5 text-[11px] font-mono font-medium text-[var(--text-primary)] min-w-[24px] text-center">
            12
          </span>
          <button
            className="px-1 py-1 text-[var(--text-muted)] hover:bg-[var(--surface-primary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <Plus size={10} />
          </button>
        </div>

        <ToolbarDivider />

        {/* Text Formatting */}
        <ToolbarButton active>
          <Bold size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Italic size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Underline size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Strikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Palette size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton active>
          <AlignLeft size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <AlignCenter size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <AlignRight size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton>
          <List size={14} />
        </ToolbarButton>
        <ToolbarButton active>
          <ListOrdered size={14} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton>
          <Heading1 size={14} />
        </ToolbarButton>
        <ToolbarButton>
          <Heading2 size={14} />
        </ToolbarButton>
      </div>

      {/* Ruler */}
      <div className="flex-shrink-0 h-5 bg-[var(--surface-secondary)] border-b border-[var(--border-color)] flex items-center px-4 overflow-hidden">
        <div className="flex items-end w-full gap-0">
          {Array.from({ length: 30 }, (_, i) => (
            <div key={i} className="flex items-end" style={{ minWidth: "24px" }}>
              {i % 5 === 0 ? (
                <div className="flex flex-col items-center">
                  <span className="text-[7px] font-mono text-[var(--text-muted)] leading-none">
                    {i}
                  </span>
                  <div className="w-px h-1.5 bg-[var(--text-muted)]" />
                </div>
              ) : (
                <div className="w-px h-1 bg-[var(--border-color)] mx-auto" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Area */}
      <div className="flex-1 overflow-y-auto bg-[#e8e8e8] dark:bg-[#2a2a2a] p-4 flex justify-center">
        {/* Page */}
        <div
          className={`bg-white dark:bg-[var(--surface-primary)] shadow-lg border border-[var(--border-color)] ${
            isMobile ? "w-full" : "w-full max-w-[680px]"
          }`}
          style={{
            minHeight: isMobile ? "auto" : "860px",
            padding: isMobile ? "24px 20px" : "48px 56px",
          }}
        >
          {/* Document Title */}
          <div className="flex items-center gap-2 mb-1">
            <FileText
              size={18}
              className="text-[var(--accent-color)] flex-shrink-0"
            />
            <h1 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
              General Rules & Regulations
            </h1>
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-6 pl-[26px] font-medium">
            GUSTO 2026 — Government College of Engineering, Erode
          </p>

          <div className="w-full h-px bg-[var(--border-color)] mb-6" />

          {/* Section 1: General Rules */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-[var(--accent-color)] text-white text-[10px] font-bold rounded-sm flex-shrink-0">
                §
              </span>
              General Rules
            </h2>

            <div className="space-y-1">
              {GENERAL_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 group hover:bg-[var(--accent-color)]/5 rounded px-2 py-1.5 -mx-2 transition-colors"
                >
                  {/* Line number */}
                  <span className="font-mono text-[10px] text-[var(--text-muted)]/40 w-5 text-right flex-shrink-0 pt-0.5 select-none group-hover:text-[var(--accent-color)]/60">
                    {idx + 1}
                  </span>
                  {/* Bullet indicator */}
                  <span className="text-[var(--accent-color)] text-xs flex-shrink-0 pt-0.5">
                    ●
                  </span>
                  {/* Rule text */}
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Code of Conduct */}
          <section className="mb-8">
            <h2 className="text-sm font-black text-[var(--text-primary)] uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 bg-green-500 text-white text-[10px] font-bold rounded-sm flex-shrink-0">
                ✓
              </span>
              Code of Conduct
            </h2>

            <div className="space-y-1">
              {CODE_OF_CONDUCT.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 group hover:bg-green-500/5 rounded px-2 py-1.5 -mx-2 transition-colors"
                >
                  <span className="font-mono text-[10px] text-[var(--text-muted)]/40 w-5 text-right flex-shrink-0 pt-0.5 select-none group-hover:text-green-500/60">
                    {GENERAL_RULES.length + idx + 1}
                  </span>
                  <span className="text-green-500 text-xs flex-shrink-0 pt-0.5">
                    ◆
                  </span>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed flex-1">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Note box */}
          <div className="border-l-4 border-[var(--accent-color)] bg-[var(--accent-color)]/5 px-4 py-3 text-sm text-[var(--text-secondary)] rounded-r">
            <strong className="text-[var(--text-primary)]">Note:</strong> For
            event-specific rules, please refer to the individual event details in
            the Events section.
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-1 bg-[var(--surface-primary)] border-t border-[var(--border-color)] text-[9px] font-mono text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <span>Page 1 of 1</span>
          <span>·</span>
          <span>{GENERAL_RULES.length + CODE_OF_CONDUCT.length} items</span>
          <span>·</span>
          <span>
            {GENERAL_RULES.concat(CODE_OF_CONDUCT)
              .join(" ")
              .split(/\s+/).length}{" "}
            words
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>UTF-8</span>
          <span>·</span>
          <span>Read Only</span>
        </div>
      </div>
    </div>
  );
}
