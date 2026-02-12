"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { Grid3X3 } from "lucide-react";
import { MobileStatusBar } from "./MobileStatusBar";
import { MobileNavBar } from "./MobileNavBar";
import { MobileAppDrawer, type MobileApp } from "./MobileAppDrawer";
import { MobileRecentApps } from "./MobileRecentApps";
import { ThemedIcon } from "../ui/ThemedIcon";
import { BootScreen } from "../system/BootScreen";
import { useDesktop } from "../../contexts/DesktopContext";

// App components — reused from desktop
import { EventsExplorer } from "../apps/EventsExplorer";
import { RulesSection } from "../apps/RulesSection";
import { ContactSection } from "../apps/ContactSection";
import { TransportInfo } from "../apps/TransportInfo";
import { Terminal } from "../apps/Terminal";
import { CalendarApp } from "../apps/Calendar";
import { Snake } from "../apps/Snake";
import { Minesweeper } from "../apps/Minesweeper";
import { SystemPreferences } from "../apps/SystemPreferences";
import { Achievements } from "../apps/Achievements";
import { Spotify } from "../apps/Spotify";

// Countdown constants
const TARGET_DATE = new Date("2026-03-06T09:00:00+05:30");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(): TimeLeft {
  const diff = Math.max(0, TARGET_DATE.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Home screen apps (shown on main grid)
const HOME_APPS: MobileApp[] = [
  { id: "events", name: "Events", icon: "calendar" },
  { id: "rules", name: "Rules", icon: "clipboard" },
  { id: "contact", name: "Contact", icon: "mail" },
  { id: "transport", name: "Transport", icon: "map" },
];

// All apps (shown in drawer)
const ALL_APPS: MobileApp[] = [
  ...HOME_APPS,
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "calendar", name: "Calendar", icon: "calendarDays" },
  { id: "snake", name: "Snake", icon: "gamepad2" },
  { id: "minesweeper", name: "Minesweeper", icon: "bomb" },
  { id: "systemPreferences", name: "Settings", icon: "settings" },
  { id: "achievements", name: "Achievements", icon: "trophy" },
  { id: "spotify", name: "Spotify", icon: "music" },
];

function renderApp(appId: string) {
  switch (appId) {
    case "events":
      return <EventsExplorer />;
    case "rules":
      return <RulesSection />;
    case "contact":
      return <ContactSection />;
    case "transport":
      return <TransportInfo />;
    case "terminal":
      return <Terminal />;
    case "calendar":
      return <CalendarApp />;
    case "snake":
      return <Snake />;
    case "minesweeper":
      return <Minesweeper />;
    case "systemPreferences":
      return <SystemPreferences />;
    case "achievements":
      return <Achievements />;
    case "spotify":
      return <Spotify />;
    default:
      return null;
  }
}

export function MobileOS() {
  const { state } = useDesktop();
  const [isBooting, setIsBooting] = useState(true);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    // Request fullscreen after boot animation
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    } catch {}
  }, []);

  const openApp = useCallback((appId: string) => {
    setActiveApp(appId);
    setRecentApps((prev) => {
      const filtered = prev.filter((id) => id !== appId);
      return [appId, ...filtered].slice(0, 8);
    });
    setShowDrawer(false);
    setShowRecents(false);
  }, []);

  const goHome = useCallback(() => {
    setActiveApp(null);
    setShowDrawer(false);
    setShowRecents(false);
  }, []);

  const goBack = useCallback(() => {
    if (showRecents) {
      setShowRecents(false);
    } else if (showDrawer) {
      setShowDrawer(false);
    } else if (activeApp) {
      setActiveApp(null);
    }
  }, [showRecents, showDrawer, activeApp]);

  const toggleRecents = useCallback(() => {
    setShowRecents((prev) => !prev);
    setShowDrawer(false);
  }, []);

  const removeRecent = useCallback((appId: string) => {
    setRecentApps((prev) => prev.filter((id) => id !== appId));
  }, []);

  const clearAllRecents = useCallback(() => {
    setRecentApps([]);
  }, []);

  // Wallpaper background style
  const wallpaperStyle = useMemo((): React.CSSProperties => {
    const { wallpaper } = state;
    if (wallpaper.type === "image") {
      return {
        backgroundImage: `url(${wallpaper.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    } else if (wallpaper.type === "gradient") {
      return { background: wallpaper.value };
    }
    return { backgroundColor: wallpaper.value };
  }, [state]);

  const units = [
    { label: "D", value: pad(timeLeft.days) },
    { label: "H", value: pad(timeLeft.hours) },
    { label: "M", value: pad(timeLeft.minutes) },
    { label: "S", value: pad(timeLeft.seconds) },
  ];

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={wallpaperStyle}
    >
      <AnimatePresence>
        {isBooting && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      <MobileStatusBar />

      {activeApp ? (
        /* ── Fullscreen App ── */
        <div className="absolute inset-0 pt-10 pb-12 z-[50] bg-[var(--surface-bg)] overflow-auto">
          {/* App title bar */}
          <div className="sticky top-0 z-10 h-11 flex items-center justify-center px-4 bg-[var(--surface-bg)]/95 backdrop-blur-sm border-b border-[var(--border-color)]">
            <h1 className="text-[var(--text-primary)] text-sm font-bold">
              {ALL_APPS.find((a) => a.id === activeApp)?.name ?? activeApp}
            </h1>
          </div>
          <div className="h-full overflow-auto">{renderApp(activeApp)}</div>
        </div>
      ) : (
        /* ── Home Screen ── */
        <div className="absolute inset-0 pt-10 pb-12 flex flex-col items-center">
          {/* Countdown widget */}
          <div className="mt-8 mb-6 flex flex-col items-center">
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
              GUSTO 2026
            </p>
            <div className="flex items-baseline gap-1">
              {units.map((u, i) => (
                <span key={u.label} className="flex items-baseline">
                  <span className="text-white font-black font-mono text-3xl tabular-nums drop-shadow-lg">
                    {u.value}
                  </span>
                  <span className="text-[#F54E00] text-[9px] font-bold ml-0.5 mr-1">
                    {u.label}
                  </span>
                  {i < units.length - 1 && (
                    <span className="text-white/40 text-xl font-light">:</span>
                  )}
                </span>
              ))}
            </div>
            <p className="text-white/40 text-[10px] mt-2 font-medium">
              Registration closes 1st March 2026
            </p>
          </div>

          {/* App Grid */}
          <div className="flex-1 flex items-start justify-center w-full px-8 mt-4">
            <div className="grid grid-cols-2 gap-6 w-full max-w-[280px]">
              {HOME_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => openApp(app.id)}
                  className="flex flex-col items-center gap-2 active:scale-90 transition-transform duration-150"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center shadow-lg">
                    <ThemedIcon
                      name={app.icon}
                      className="w-8 h-8 text-[var(--ph-orange)]"
                    />
                  </div>
                  <span className="text-white text-xs font-medium drop-shadow-md">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* App Drawer trigger */}
          <div className="mb-4">
            <button
              onClick={() => setShowDrawer(true)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center active:scale-90 transition-transform duration-150"
            >
              <Grid3X3 size={18} className="text-white/70" />
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      <MobileAppDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        apps={ALL_APPS}
        onAppOpen={openApp}
      />
      <MobileRecentApps
        isOpen={showRecents}
        onClose={() => setShowRecents(false)}
        recentApps={recentApps}
        allApps={ALL_APPS}
        onAppOpen={openApp}
        onRemoveRecent={removeRecent}
        onClearAll={clearAllRecents}
      />

      <MobileNavBar onBack={goBack} onHome={goHome} onRecent={toggleRecents} />
    </div>
  );
}
