"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Grid3X3, ChevronLeft, Circle, Square, Minus } from "lucide-react";
import { MobileStatusBar } from "./MobileStatusBar";
import { IOSHomeIndicator } from "./IOSHomeIndicator";
import { MobileAppDrawer, type MobileApp } from "./MobileAppDrawer";
import { MobileRecentApps } from "./MobileRecentApps";
import { BootScreen } from "../system/BootScreen";
import { useDesktop } from "../../contexts/DesktopContext";
import { getIOSIcon } from "../../data/iosIcons";
import { useSwipeGestures } from "../../hooks/useSwipeGestures";

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
import { RegisterPage } from "../apps/register/RegisterPage";

// Countdown constants
const TARGET_DATE = new Date("2026-03-04T23:59:59+05:30");

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

// Home screen apps (main grid — page 1)
const HOME_APPS: MobileApp[] = [
  { id: "events", name: "Events", icon: "calendar" },
  { id: "rules", name: "Rules", icon: "clipboard" },
  { id: "contact", name: "Contact", icon: "mail" },
  { id: "transport", name: "Transport", icon: "map" },
  { id: "calendar", name: "Calendar", icon: "calendarDays" },
  { id: "achievements", name: "Achievements", icon: "trophy" },
  { id: "snake", name: "Snake", icon: "gamepad2" },
  { id: "minesweeper", name: "Minesweeper", icon: "bomb" },
];

// Dock apps (always visible at the bottom like a real phone)
const DOCK_APPS: MobileApp[] = [
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "spotify", name: "Music", icon: "music" },
  { id: "systemPreferences", name: "Settings", icon: "settings" },
];

// All apps combined
const ALL_APPS: MobileApp[] = [...HOME_APPS, ...DOCK_APPS];

function renderApp(appId: string, data?: unknown) {
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
    case "register":
      return <RegisterPage data={data} />;
    default:
      return null;
  }
}

/** Detect if device likely has button navigation (Android) or gesture navigation (iOS/modern Android) */
function useNavMode(): "buttons" | "gesture" {
  const [mode, setMode] = useState<"buttons" | "gesture">("gesture");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (isIOS) {
      // Modern iPhones use gesture nav, older ones with home button — check screen ratio
      const ratio = window.screen.height / window.screen.width;
      setMode(ratio > 2 ? "gesture" : "buttons"); // iPhone X+ has ratio > 2
    } else if (isAndroid) {
      // Check if window.innerHeight is significantly less than screen.height
      // (button nav takes screen space, gesture nav doesn't)
      const navBarHeight = window.screen.height - window.innerHeight;
      setMode(navBarHeight > 80 ? "buttons" : "gesture");
    } else {
      // Desktop browser — use gesture mode (they can use mouse-drag)
      setMode("gesture");
    }
  }, []);

  return mode;
}

/** iOS-style icon button using macOS SVG icons */
function IOSAppIcon({
  app,
  onOpen,
  size = 58,
}: {
  app: MobileApp;
  onOpen: (id: string) => void;
  size?: number;
}) {
  const iconUrl = getIOSIcon(app.id);

  return (
    <button
      onClick={() => onOpen(app.id)}
      className="flex flex-col items-center gap-1 active:scale-90 transition-transform duration-150"
    >
      <div
        className="relative rounded-[22%] overflow-hidden shadow-lg shadow-black/30"
        style={{ width: size, height: size }}
      >
        {iconUrl ? (
          <Image
            src={iconUrl}
            alt={app.name}
            fill
            className="object-cover"
            draggable={false}
            sizes={`${size}px`}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {app.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <span className="text-white text-[10px] font-medium drop-shadow-md tracking-tight leading-tight">
        {app.name}
      </span>
    </button>
  );
}

/** Bottom Dock — always visible on home screen, like a real phone */
function MobileDock({
  apps,
  onOpen,
}: {
  apps: MobileApp[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-4 mb-2 px-6 py-3 rounded-[26px] bg-white/15 backdrop-blur-2xl border border-white/20 shadow-lg">
      <div className="flex items-center justify-around">
        {apps.map((app) => (
          <IOSAppIcon key={app.id} app={app} onOpen={onOpen} size={50} />
        ))}
      </div>
    </div>
  );
}

/** Android-style 3-button nav bar */
function ButtonNavBar({
  onBack,
  onHome,
  onRecent,
}: {
  onBack: () => void;
  onHome: () => void;
  onRecent: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-[300] flex items-center justify-around bg-black/50 backdrop-blur-md border-t border-white/10">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-12 h-12 rounded-full text-white/70 active:text-white active:scale-75 active:bg-white/15 transition-all duration-100"
        aria-label="Back"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        onClick={onHome}
        className="flex items-center justify-center w-12 h-12 rounded-full text-white/70 active:text-white active:scale-75 active:bg-white/15 transition-all duration-100"
        aria-label="Home"
      >
        <Circle size={18} strokeWidth={2.5} />
      </button>
      <button
        onClick={onRecent}
        className="flex items-center justify-center w-12 h-12 rounded-full text-white/70 active:text-white active:scale-75 active:bg-white/15 transition-all duration-100"
        aria-label="Recent Apps"
      >
        <Square size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export function MobileOS() {
  const { state, closeWindow } = useDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const navMode = useNavMode();
  const [isBooting, setIsBooting] = useState(true);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [activeAppData, setActiveAppData] = useState<unknown>(undefined);
  const [recentApps, setRecentApps] = useState<string[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [backPressCount, setBackPressCount] = useState(0);
  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      }
    } catch {}
  }, []);

  const openApp = useCallback((appId: string, data?: unknown) => {
    setActiveApp(appId);
    setActiveAppData(data);
    setRecentApps((prev) => {
      const filtered = prev.filter((id) => id !== appId);
      return [appId, ...filtered].slice(0, 8);
    });
    setShowDrawer(false);
    setShowRecents(false);
    setBackPressCount(0);
  }, []);

  // Intercept windows opened via DesktopContext
  useEffect(() => {
    const registerWindow = state.windows.find((w) => w.appId === "register");
    if (registerWindow && activeApp !== "register") {
      openApp("register", registerWindow.data);
      closeWindow(registerWindow.id);
    }
  }, [state.windows, activeApp, openApp, closeWindow]);

  const goHome = useCallback(() => {
    setActiveApp(null);
    setShowDrawer(false);
    setShowRecents(false);
    setBackPressCount(0);
  }, []);

  /** Double-back to exit: first back closes overlay/app, second back from home does nothing */
  const goBack = useCallback(() => {
    if (showRecents) {
      setShowRecents(false);
      setBackPressCount(0);
    } else if (showDrawer) {
      setShowDrawer(false);
      setBackPressCount(0);
    } else if (activeApp) {
      // First back from an app → go home
      setActiveApp(null);
      setBackPressCount(0);
    } else {
      // Already on home screen — track double-back
      setBackPressCount((prev) => {
        if (prev === 0) {
          // Start timer — if no second back in 2s, reset
          if (backTimerRef.current) clearTimeout(backTimerRef.current);
          backTimerRef.current = setTimeout(() => {
            setBackPressCount(0);
          }, 2000);
          return 1;
        }
        // Second back — could exit fullscreen or do nothing
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        return 0;
      });
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

  // Swipe gestures — always enabled (works via pointer events for both mouse & touch)
  useSwipeGestures(containerRef, {
    onSwipeUpHome: goHome,
    onSwipeUpRecents: toggleRecents,
    onSwipeBack: goBack,
  });

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

  // Bottom padding depends on nav mode
  const bottomPad = navMode === "buttons" ? "pb-14" : "pb-8";

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden touch-none"
      style={wallpaperStyle}
    >
      <AnimatePresence>
        {isBooting && <BootScreen onComplete={handleBootComplete} />}
      </AnimatePresence>

      <MobileStatusBar />

      <AnimatePresence mode="wait">
        {activeApp ? (
          /* ── Fullscreen App with iOS-style animation ── */
          <motion.div
            key={`app-${activeApp}`}
            initial={{ scale: 0.92, opacity: 0, borderRadius: "40px" }}
            animate={{ scale: 1, opacity: 1, borderRadius: "0px" }}
            exit={{ scale: 0.92, opacity: 0, borderRadius: "40px" }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 0.8,
            }}
            className={`absolute inset-0 pt-11 ${bottomPad} z-[50] bg-[var(--surface-bg)] overflow-hidden`}
          >
            {/* App title bar with iOS-style back */}
            <div className="sticky top-0 z-10 h-11 flex items-center justify-between px-4 bg-[var(--surface-bg)]/95 backdrop-blur-xl border-b border-[var(--border-color)]">
              <button
                onClick={goBack}
                className="flex items-center gap-1 text-[#007AFF] text-sm font-medium active:opacity-50 transition-opacity"
              >
                <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
                  <path
                    d="M9 1L2 8L9 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Back
              </button>
              <h1 className="text-[var(--text-primary)] text-sm font-semibold absolute left-1/2 -translate-x-1/2">
                {ALL_APPS.find((a) => a.id === activeApp)?.name ?? activeApp}
              </h1>
              {/* Minimize button */}
              <button
                onClick={goHome}
                className="text-[#007AFF] active:opacity-50 transition-opacity"
                aria-label="Minimize"
              >
                <Minus size={20} strokeWidth={2.5} />
              </button>
            </div>
            <div className="h-full overflow-auto pb-12 touch-auto">
              {renderApp(activeApp, activeAppData)}
            </div>
          </motion.div>
        ) : (
          /* ── Home Screen ── */
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 pt-11 ${bottomPad} flex flex-col`}
          >
            {/* GUSTO watermark background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
              <div className="flex">
                {Array.from("GUSTO").map((letter, i) => (
                  <span
                    key={i}
                    className="font-black text-white/[0.07] tracking-tighter"
                    style={{ fontSize: "5rem", lineHeight: 0.85 }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <span className="text-white/[0.07] text-lg font-bold tracking-[0.5em] mt-2 uppercase">
                2026
              </span>
            </div>

            {/* Countdown widget — iOS widget style */}
            <div className="mt-4 mb-3 flex flex-col items-center z-10 px-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-[20px] border border-white/15 px-5 py-3 shadow-lg w-full max-w-[320px]">
                <p className="text-white/60 text-[10px] font-semibold tracking-widest uppercase text-center mb-1.5">
                  Countdown
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  {units.map((u, i) => (
                    <span key={u.label} className="flex items-baseline">
                      <span className="text-white font-black font-mono text-2xl tabular-nums drop-shadow-lg">
                        {u.value}
                      </span>
                      <span className="text-[#FF6B35] text-[8px] font-bold ml-0.5 mr-1">
                        {u.label}
                      </span>
                      {i < units.length - 1 && (
                        <span className="text-white/30 text-lg font-light">
                          :
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <p className="text-white/40 text-[9px] mt-1 font-medium text-center">
                  Registration closes 1st March 2026
                </p>
              </div>
            </div>

            {/* App Grid */}
            <div className="flex-1 flex items-start justify-center w-full px-6 mt-1 z-10 overflow-y-auto touch-auto">
              <div className="grid grid-cols-4 gap-x-4 gap-y-5 w-full max-w-[340px]">
                {HOME_APPS.map((app) => (
                  <IOSAppIcon
                    key={app.id}
                    app={app}
                    onOpen={openApp}
                    size={56}
                  />
                ))}
              </div>
            </div>

            {/* Page dots */}
            <div className="flex items-center justify-center gap-1.5 py-2 z-10">
              <div className="w-[6px] h-[6px] rounded-full bg-white/80" />
              <div className="w-[6px] h-[6px] rounded-full bg-white/25" />
            </div>

            {/* Bottom Dock */}
            <div className="z-10">
              <MobileDock apps={DOCK_APPS} onOpen={openApp} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Navigation: buttons OR gesture indicator based on detection */}
      {navMode === "buttons" ? (
        <ButtonNavBar
          onBack={goBack}
          onHome={goHome}
          onRecent={toggleRecents}
        />
      ) : (
        <IOSHomeIndicator />
      )}

      {/* Double-back toast */}
      <AnimatePresence>
        {backPressCount === 1 && !activeApp && !showDrawer && !showRecents && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm"
          >
            <span className="text-white text-xs font-medium">
              Swipe back again to exit fullscreen
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
