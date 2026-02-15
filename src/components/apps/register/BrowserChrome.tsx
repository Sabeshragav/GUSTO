"use client";

import {
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Shield,
  Star,
  X,
  Plus,
  Lock,
  Minus,
  Square,
  MoreHorizontal,
} from "lucide-react";
import { useIsMobile } from "../../../hooks/useIsMobile";

interface BrowserChromeProps {
  children: React.ReactNode;
  url?: string;
  title?: string;
}

export function BrowserChrome({
  children,
  url = "https://gusto26.in/register",
  title = "Register — GUSTO'26",
}: BrowserChromeProps) {
  const { isMobile } = useIsMobile();

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--surface-bg)]">
      {/* Tab Bar */}
      <div className="flex-shrink-0 flex items-center bg-[var(--surface-secondary)] border-b border-[var(--border-color)] pl-1 pr-2">
        {/* Active Tab */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--surface-primary)] border-x border-t border-[var(--border-color)] rounded-t-lg relative -mb-px max-w-[220px] min-w-0">
          {/* Favicon */}
          <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[7px] font-black leading-none">
              G
            </span>
          </div>
          <span className="text-[11px] font-medium text-[var(--text-primary)] truncate">
            {title}
          </span>
          <button
            className="ml-auto flex-shrink-0 p-0.5 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <X size={10} />
          </button>
        </div>

        {/* New Tab Button */}
        <button
          className="p-1 ml-1 rounded hover:bg-[var(--surface-primary)] text-[var(--text-muted)] transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Plus size={12} />
        </button>

        {/* Window Controls (desktop only) */}
        {!isMobile && (
          <div className="ml-auto flex items-center gap-1.5">
            <button
              className="p-1 rounded hover:bg-[var(--surface-primary)] text-[var(--text-muted)] transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <Minus size={12} />
            </button>
            <button
              className="p-1 rounded hover:bg-[var(--surface-primary)] text-[var(--text-muted)] transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <Square size={10} />
            </button>
            <button
              className="p-1 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <X size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 bg-[var(--surface-primary)] border-b border-[var(--border-color)]">
        {/* Nav Buttons */}
        <button
          className="p-1 rounded text-[var(--text-muted)]/40 cursor-not-allowed"
          disabled
        >
          <ChevronLeft size={16} />
        </button>
        <button
          className="p-1 rounded text-[var(--text-muted)]/40 cursor-not-allowed"
          disabled
        >
          <ChevronRight size={16} />
        </button>
        <button
          className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <RotateCw size={14} />
        </button>

        {/* URL Bar */}
        <div className="flex-1 flex items-center gap-1.5 px-3 py-1 bg-[var(--surface-secondary)] border border-[var(--border-color)] rounded-full hover:border-[var(--text-muted)]/30 transition-colors">
          <Lock size={11} className="text-green-500 flex-shrink-0" />
          <span className="text-[11px] font-medium text-[var(--text-muted)] truncate">
            <span className="text-green-500">https://</span>
            <span className="text-[var(--text-primary)]">gusto26.in</span>
            <span className="text-[var(--text-muted)]">/register</span>
          </span>
        </div>

        {/* Right actions */}
        <button
          className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Star size={14} />
        </button>
        <button
          className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          <Shield size={14} />
        </button>
        {!isMobile && (
          <button
            className="p-1 rounded text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal size={14} />
          </button>
        )}
      </div>

      {/* Bookmarks Bar (desktop only) */}
      {!isMobile && (
        <div className="flex-shrink-0 flex items-center gap-2 px-3 py-1 bg-[var(--surface-primary)] border-b border-[var(--border-color)] text-[10px] text-[var(--text-muted)]">
          {[
            { icon: "🎓", label: "GCEE Portal" },
            { icon: "📅", label: "Events" },
            { icon: "📋", label: "Rules" },
            { icon: "📞", label: "Contact" },
          ].map((bm) => (
            <button
              key={bm.label}
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[var(--surface-secondary)] transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <span>{bm.icon}</span>
              <span className="font-medium">{bm.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Page Content */}
      <div className="flex-1 overflow-auto pb-24">{children}</div>

      {/* Status Bar (subtle) */}
      <div className="flex-shrink-0 flex items-center px-3 py-0.5 bg-[var(--surface-primary)] border-t border-[var(--border-color)] text-[9px] font-mono text-[var(--text-muted)]">
        <Lock size={8} className="text-green-500 mr-1" />
        <span>Secure connection to gusto26.in</span>
      </div>
    </div>
  );
}
