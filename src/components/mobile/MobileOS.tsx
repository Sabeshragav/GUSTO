"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, Circle, Square, Minus, Construction } from "lucide-react";
import Image from "next/image";

import { MobileStatusBar } from "./MobileStatusBar";
import { IOSHomeIndicator } from "./IOSHomeIndicator";
import { MobileAppDrawer, type MobileApp } from "./MobileAppDrawer";
import { MobileRecentApps } from "./MobileRecentApps";
import { MobileOnboarding } from "./MobileOnboarding";
import { BootScreen } from "../system/BootScreen";

import { useDesktop } from "../../contexts/DesktopContext";
import {
  MobileAppProvider,
  useMobileApp,
} from "../../contexts/MobileAppContext";
import { useSwipeGestures } from "../../hooks/useSwipeGestures";
import { getIOSIcon } from "../../data/iosIcons";
import { EventPromoWidget } from "../widgets/EventPromoWidget";

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
import { Gallery } from "../apps/Gallery";
import { About } from "../apps/About";
import { RegisterPage } from "../apps/register/RegisterPage";
// import { BrowserChrome } from "../apps/register/BrowserChrome"; // Removed

// ── Constants ──

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

const PAGE_1_APPS: MobileApp[] = [
  { id: "events", name: "Events", icon: "calendar" },
  { id: "rules", name: "Rules", icon: "clipboard" },
  { id: "contact", name: "Contact", icon: "mail" },
  { id: "transport", name: "Transport", icon: "map" },
  { id: "calendar", name: "Calendar", icon: "calendarDays" },
  { id: "achievements", name: "Achievements", icon: "trophy" },
  { id: "browser", name: "Browser", icon: "globe" },
  { id: "minesweeper", name: "Minesweeper", icon: "bomb" },
];

const PAGE_2_APPS: MobileApp[] = [
  { id: "gallery", name: "Gallery", icon: "image" },
  { id: "about", name: "About", icon: "info" },
  { id: "register", name: "Register", icon: "user-plus" },
];

const HOME_PAGES = [PAGE_1_APPS, PAGE_2_APPS];

const DOCK_APPS: MobileApp[] = [
  { id: "terminal", name: "Terminal", icon: "terminal" },
  { id: "spotify", name: "Music", icon: "music" },
  { id: "systemPreferences", name: "Settings", icon: "settings" },
];

const ALL_APPS: MobileApp[] = [...PAGE_1_APPS, ...PAGE_2_APPS, ...DOCK_APPS];

// ── Sub-components ──

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
      id={`app-icon-${app.id}`}
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
            width={size}
            height={size}
            className="object-cover w-full h-full"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
            <span className="text-white text-lg font-bold">
              {app.name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <span className="text-white text-[10px] font-medium drop-shadow-md tracking-tight leading-tight mix-blend-plus-lighter">
        {app.name}
      </span>
    </button>
  );
}

function MobileDock({
  apps,
  onOpen,
}: {
  apps: MobileApp[];
  onOpen: (id: string) => void;
}) {
  return (
    <div className="mx-8 mb-3 px-4 py-2 rounded-[22px] bg-black/20 backdrop-blur-lg border border-white/10 shadow-lg">
      <div className="flex items-center justify-around gap-4">
        {apps.map((app) => (
          <IOSAppIcon key={app.id} app={app} onOpen={onOpen} size={42} />
        ))}
      </div>
    </div>
  );
}

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
    <div
      className="fixed bottom-0 left-0 right-0 z-[300] flex items-center justify-around bg-black/80 backdrop-blur-md border-t border-white/5"
      style={{ height: 'calc(48px + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <button
        onClick={onBack}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Back"
      >
        <ChevronLeft size={24} strokeWidth={2} />
      </button>
      <button
        onClick={onHome}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Home"
      >
        <Circle size={18} strokeWidth={2.5} />
      </button>
      <button
        onClick={onRecent}
        className="w-12 h-12 flex items-center justify-center text-white/60 active:text-white active:bg-white/10 rounded-full transition-all"
        aria-label="Recent Apps"
      >
        <Square size={16} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function PlaceholderApp({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/60 p-8 text-center">
      <Construction size={48} className="mb-4 text-white/40" />
      <h2 className="text-xl font-bold mb-2">{name}</h2>
      <p className="text-sm">
        This app is currently under construction. Check back later!
      </p>
    </div>
  );
}

function renderApp(appId: string, data?: unknown) {
  switch (appId) {
    case "events":
      return <EventsExplorer initialEventId={(data as any)?.initialEventId} />;
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
    case "gallery":
      return <Gallery />;
    case "about":
      return <About />;
    case "register":
    case "browser":
      return <RegisterPage data={data} />;
    default:
      return <PlaceholderApp name={appId} />;
  }
}

// ── Main Content ──

function MobileOSContent() {
  const { state: desktopState, closeWindow } = useDesktop();
  const { activeApp, activeAppData, openApp, goHome, closeApp, recentApps } =
    useMobileApp();

  const containerRef = useRef<HTMLDivElement>(null);
  const allowExitRef = useRef(false);
  const backTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [navMode, setNavMode] = useState<"buttons" | "gesture">("gesture");
  const [isBooting, setIsBooting] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showRecents, setShowRecents] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [backPressCount, setBackPressCount] = useState(0);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    if (isIOS) {
      setNavMode(
        window.screen.height / window.screen.width > 2 ? "gesture" : "buttons",
      );
    } else if (isAndroid) {
      setNavMode(
        window.screen.height - window.innerHeight > 80 ? "buttons" : "gesture",
      );
    } else {
      setNavMode("gesture");
    }
  }, []);

  useEffect(() => {
    setTimeLeft(getTimeLeft());
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Helper: re-request fullscreen after a short delay.
  // Called from click/touch handlers so the browser still has
  // a valid user-gesture ("transient activation") context.
  const reEnterFullscreen = useCallback(() => {
    setTimeout(() => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => { });
      }
    }, 150);
  }, []);

  // Catch-all: if the browser drops fullscreen for any reason (native swipe
  // gestures, Android back button, etc.) after boot, re-request it.
  // Skips re-request when the user intentionally exits (double-press back).
  useEffect(() => {
    if (isBooting) return;
    const onFullscreenChange = () => {
      if (document.fullscreenElement) {
        // User re-entered fullscreen (e.g. via status bar) — re-activate protection
        allowExitRef.current = false;
      } else if (!allowExitRef.current) {
        setTimeout(() => {
          if (!document.fullscreenElement && !allowExitRef.current) {
            document.documentElement.requestFullscreen?.().catch(() => { });
          }
        }, 200);
      }
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [isBooting]);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    try {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen?.().catch(() => { });
    } catch { }
  }, []);

  const handleOpenApp = useCallback(
    (appId: string, data?: unknown) => {
      setShowRecents(false);
      setShowDrawer(false);
      setBackPressCount(0);
      openApp(appId, data);
    },
    [openApp],
  );

  useEffect(() => {
    const registerWindow = desktopState.windows.find(
      (w) => w.appId === "register",
    );
    if (registerWindow && activeApp !== "register") {
      handleOpenApp("register", registerWindow.data);
      closeWindow(registerWindow.id);
    }
  }, [desktopState.windows, activeApp, closeWindow, handleOpenApp]);

  const handleGoHome = useCallback(() => {
    if (showRecents) setShowRecents(false);
    if (showDrawer) setShowDrawer(false);
    if (activeApp) {
      goHome();
      reEnterFullscreen();
    }
    setBackPressCount(0);
  }, [showRecents, showDrawer, activeApp, goHome, reEnterFullscreen]);

  const handleGoBack = useCallback(() => {
    if (showRecents) {
      setShowRecents(false);
      setBackPressCount(0);
    } else if (showDrawer) {
      setShowDrawer(false);
      setBackPressCount(0);
    } else if (activeApp) {
      goHome();
      reEnterFullscreen();
      setBackPressCount(0);
    } else {
      // Home screen: require two presses to exit fullscreen
      setBackPressCount((prev) => {
        if (prev === 0) {
          if (backTimerRef.current) clearTimeout(backTimerRef.current);
          backTimerRef.current = setTimeout(() => setBackPressCount(0), 2000);
          return 1;
        }
        // Second press — intentionally exit fullscreen
        allowExitRef.current = true;
        if (document.fullscreenElement)
          document.exitFullscreen?.().catch(() => { });
        return 0;
      });
    }
  }, [showRecents, showDrawer, activeApp, goHome, reEnterFullscreen]);

  const toggleRecents = useCallback(() => {
    setShowRecents((p) => !p);
    setShowDrawer(false);
  }, []);

  const handleWidgetClick = useCallback(
    (eventId: string) => {
      handleOpenApp("events", { initialEventId: eventId });
    },
    [handleOpenApp],
  );

  const handlePageDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x < -30) {
      if (currentPage < HOME_PAGES.length - 1) setCurrentPage((p) => p + 1);
    } else if (info.offset.x > 30) {
      if (currentPage > 0) {
        setCurrentPage((p) => p - 1);
      } else {
        // Handle Back gesture on Page 0 (Swipe Right -> Back)
        handleGoBack();
      }
    }
  };

  useSwipeGestures(containerRef, {
    onSwipeUpHome: handleGoHome,
    onSwipeUpRecents: toggleRecents,
    onSwipeBack: handleGoBack,
    // Note: Left/Right swipes now handled by Framer Motion drag on page container
  });

  const wallpaperStyle = useMemo((): React.CSSProperties => {
    const { wallpaper } = desktopState;
    if (wallpaper.type === "image")
      return {
        backgroundImage: `url(${wallpaper.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    if (wallpaper.type === "gradient") return { background: wallpaper.value };
    return { backgroundColor: wallpaper.value };
  }, [desktopState]);

  const units = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hrs", value: pad(timeLeft.hours) },
    { label: "Min", value: pad(timeLeft.minutes) },
    { label: "Sec", value: pad(timeLeft.seconds) },
  ];

  // Use inline style for safe-area-aware bottom padding
  const bottomPadStyle: React.CSSProperties = navMode === "buttons"
    ? { paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0px))' }
    : { paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))' };

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
      <MobileOnboarding isReady={!isBooting && !activeApp} />

      <AnimatePresence mode="wait">
        {activeApp ? (
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
            className="absolute inset-0 pt-11 z-[50] bg-[var(--surface-bg)] overflow-hidden flex flex-col"
            style={bottomPadStyle}
          >
            <div className="sticky top-0 z-10 h-11 min-h-[44px] flex items-center justify-between px-4 bg-[var(--surface-bg)]/95 backdrop-blur-md border-b border-[var(--border-color)]">
              <button
                id="mobile-back-btn"
                onClick={handleGoBack}
                className="flex items-center gap-1 text-[#007AFF] text-sm font-medium active:opacity-50 transition-opacity"
              >
                <ChevronLeft size={20} /> Back
              </button>
              <h1 className="text-[var(--text-primary)] text-sm font-semibold absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
                {ALL_APPS.find((a) => a.id === activeApp)?.name ?? activeApp}
              </h1>
              <button
                id="mobile-minimize-btn"
                onClick={handleGoHome}
                className="text-[#007AFF] active:opacity-50 transition-opacity"
                aria-label="Minimize"
              >
                <Minus size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 overflow-auto touch-auto">
              {renderApp(activeApp, activeAppData)}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 pt-11 flex flex-col"
            style={bottomPadStyle}
          >
            {/* GUSTO watermark */}
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
              <span className="text-white/[0.07] text-[10px] font-bold tracking-[0.2em] mt-1 uppercase">
                Let&apos;s meet on March 6th!
              </span>
            </div>

            {/* Page Content with Drag Animation */}
            <div className="flex-1 w-full relative z-10 flex flex-col overflow-hidden">
              <AnimatePresence mode="wait" custom={currentPage}>
                <motion.div
                  key={currentPage}
                  custom={currentPage}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex-1 flex flex-col items-center w-full px-6 overflow-y-auto touch-auto pb-4 cursor-grab active:cursor-grabbing"
                  style={{ willChange: "transform" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handlePageDragEnd}
                >
                  {/* Page 0: Branding & Widgets */}
                  {currentPage === 0 && (
                    <div className="w-full max-w-[340px] flex flex-col gap-4 mt-2 mb-4">
                      {/* Header Branding */}
                      <div className="flex flex-col items-center justify-center pt-4 pb-2">
                        <div className="flex items-center gap-5 mb-3">
                          <div className="relative w-16 h-16 drop-shadow-xl filter brightness-110">
                            <Image
                              src="/logos/GCEE/white.png"
                              alt="GCEE Logo"
                              width={64}
                              height={64}
                              className="object-contain w-full h-full"
                            />
                          </div>
                          <div className="h-10 w-[1.5px] bg-white/20 rounded-full"></div>
                          <div className="relative w-16 h-16 drop-shadow-xl filter brightness-110">
                            <Image
                              src="/logos/AIT/silver.png"
                              alt="AIT Logo"
                              width={64}
                              height={64}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                        <h2 className="text-white text-xs font-black text-center uppercase tracking-widest leading-relaxed max-w-[300px] drop-shadow-md">
                          Government College of Engineering, Erode
                        </h2>
                        <h3 className="text-[#FF6B35] text-[10px] font-black text-center uppercase tracking-[0.2em] mt-1.5 drop-shadow-sm">
                          Information Technology
                        </h3>
                      </div>
                      {/* Countdown */}
                      <div className="bg-black/30 backdrop-blur-md rounded-[20px] border border-white/10 px-4 py-3 shadow-lg flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[#FF6B35] text-[9px] font-bold uppercase tracking-wider mb-0.5">
                            Countdown
                          </span>
                          <span className="text-white/60 text-[10px] font-medium leading-tight">
                            Registration Ends Soon
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {units.map((u) => (
                            <div
                              key={u.label}
                              className="flex flex-col items-center"
                            >
                              <span className="text-white text-lg font-bold font-mono leading-none tracking-tight">
                                {u.value}
                              </span>
                              <span className="text-[8px] text-white/50 font-bold uppercase tracking-wider mt-0.5">
                                {u.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Event Promo Widget */}
                      <EventPromoWidget
                        variant="mobile"
                        onEventClick={handleWidgetClick}
                      />
                    </div>
                  )}

                  {/* App Grid */}
                  <div
                    className={`grid grid-cols-4 gap-x-4 gap-y-6 w-full max-w-[340px] ${currentPage === 0 ? "mt-0" : "mt-8"}`}
                  >
                    {HOME_PAGES[currentPage].map((app) => (
                      <IOSAppIcon
                        key={app.id}
                        app={app}
                        onOpen={handleOpenApp}
                        size={56}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Page Dots */}
            <div className="flex items-center justify-center gap-2 py-3 z-10">
              {HOME_PAGES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === currentPage ? "w-4 bg-white" : "w-1.5 bg-white/30"
                    }`}
                />
              ))}
            </div>

            <div className="z-10">
              <MobileDock apps={DOCK_APPS} onOpen={handleOpenApp} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileAppDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        apps={ALL_APPS}
        onAppOpen={handleOpenApp}
      />
      <MobileRecentApps
        isOpen={showRecents}
        onClose={() => setShowRecents(false)}
        recentApps={recentApps}
        allApps={ALL_APPS}
        onAppOpen={handleOpenApp}
        onRemoveRecent={closeApp}
        onClearAll={() => {
          recentApps.forEach((id) => closeApp(id));
        }}
        renderApp={renderApp}
      />

      {navMode === "buttons" ? (
        <ButtonNavBar
          onBack={handleGoBack}
          onHome={handleGoHome}
          onRecent={toggleRecents}
        />
      ) : (
        <IOSHomeIndicator />
      )}

      <AnimatePresence>
        {backPressCount === 1 && !activeApp && !showDrawer && !showRecents && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[400] px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm"
          >
            <span className="text-white text-xs font-medium">
              Press back again to exit fullscreen
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MobileOS() {
  return (
    <MobileAppProvider>
      <MobileOSContent />
    </MobileAppProvider>
  );
}
