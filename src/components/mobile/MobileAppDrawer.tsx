"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { ThemedIcon } from "../ui/ThemedIcon";

export interface MobileApp {
  id: string;
  name: string;
  icon: string;
}

interface MobileAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apps: MobileApp[];
  onAppOpen: (appId: string) => void;
}

// App categories
const GUSTO_APP_IDS = ["events", "rules", "contact", "transport"];
const GAMES_APP_IDS = ["snake", "minesweeper"];
const UTILITIES_APP_IDS = [
  "terminal",
  "calendar",
  "systemPreferences",
  "achievements",
  "spotify",
];

function categorizeApps(apps: MobileApp[]) {
  const gusto: MobileApp[] = [];
  const games: MobileApp[] = [];
  const utilities: MobileApp[] = [];

  for (const app of apps) {
    if (GUSTO_APP_IDS.includes(app.id)) {
      gusto.push(app);
    } else if (GAMES_APP_IDS.includes(app.id)) {
      games.push(app);
    } else if (UTILITIES_APP_IDS.includes(app.id)) {
      utilities.push(app);
    }
  }

  return { gusto, games, utilities };
}

export function MobileAppDrawer({
  isOpen,
  onClose,
  apps,
  onAppOpen,
}: MobileAppDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearch("");
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const filtered = search.trim()
    ? apps.filter((a) =>
        a.name.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : null;

  const categories = categorizeApps(apps);

  const renderAppButton = (app: MobileApp) => (
    <button
      key={app.id}
      onClick={() => {
        onAppOpen(app.id);
        onClose();
      }}
      className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform duration-150"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
        <ThemedIcon
          name={app.icon}
          className="w-7 h-7 text-[var(--ph-orange)]"
        />
      </div>
      <span className="text-white/80 text-[10px] font-medium truncate max-w-[60px]">
        {app.name}
      </span>
    </button>
  );

  const renderSection = (title: string, sectionApps: MobileApp[]) => {
    if (sectionApps.length === 0) return null;
    return (
      <div className="mb-6">
        <h3 className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 px-1">
          {title}
        </h3>
        <div className="grid grid-cols-4 gap-y-5 gap-x-4">
          {sectionApps.map(renderAppButton)}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Full-page drawer panel */}
      <div
        ref={panelRef}
        className={`fixed inset-x-0 top-0 bottom-0 z-[201] bg-[#0d0d1a]/98 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle + Search area */}
        <div className="pt-12 px-5 pb-3">
          {/* Drag handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-white/20" />
          </div>

          {/* Search bar */}
          <div className="flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-3.5 py-2.5">
            <Search size={16} className="text-white/40 shrink-0" />
            <input
              type="text"
              placeholder="Search apps"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white text-sm placeholder:text-white/30 outline-none w-full"
            />
          </div>
        </div>

        {/* Scrollable app list */}
        <div
          className="overflow-y-auto px-5 pb-16"
          style={{ height: "calc(100% - 120px)" }}
        >
          {filtered ? (
            /* Search results */
            <div className="mb-6">
              <h3 className="text-white/50 text-[11px] font-semibold uppercase tracking-[0.15em] mb-3 px-1">
                Search Results
              </h3>
              {filtered.length > 0 ? (
                <div className="grid grid-cols-4 gap-y-5 gap-x-4">
                  {filtered.map(renderAppButton)}
                </div>
              ) : (
                <p className="text-white/30 text-sm text-center py-8">
                  No apps found
                </p>
              )}
            </div>
          ) : (
            /* Categorized view */
            <>
              {renderSection("GUSTO", categories.gusto)}
              {renderSection("Games", categories.games)}
              {renderSection("Utilities", categories.utilities)}
            </>
          )}
        </div>
      </div>
    </>
  );
}
