"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useDesktop } from "../../contexts/DesktopContext";
import { ThemedIcon } from "../ui/ThemedIcon";
// import { useIsMobile } from "../../hooks/useIsMobile"; // Removed
import { getAppColor } from "../../data/appColors";
import { getMacIcon } from "../../data/macIcons";

interface DockItem {
  id: string;
  name: string;
  iconName: string;
  appId: string;
}

const dockItems: DockItem[] = [
  { id: "finder", name: "Finder", iconName: "folder", appId: "finder" },
  { id: "calendar", name: "Calendar", iconName: "calendar", appId: "calendar" },
  { id: "events", name: "Events", iconName: "calendar", appId: "events" },
  { id: "rules", name: "Rules", iconName: "clipboard", appId: "rules" },
  {
    id: "settings",
    name: "Settings",
    iconName: "settings",
    appId: "systemPreferences",
  },
  { id: "terminal", name: "Terminal", iconName: "terminal", appId: "terminal" },
  { id: "mail", name: "Mail", iconName: "mail", appId: "email" },
  {
    id: "minesweeper",
    name: "Minesweeper",
    iconName: "bomb",
    appId: "minesweeper",
  },
  { id: "snake", name: "Snake", iconName: "gamepad", appId: "snake" },
  { id: "spotify", name: "Spotify", iconName: "music", appId: "spotify" },
  { id: "gallery", name: "Gallery", iconName: "image", appId: "gallery" },
  { id: "about", name: "About", iconName: "info", appId: "about" },
  {
    id: "register",
    name: "Register",
    iconName: "clipboard",
    appId: "register",
  },
];

export function Dock() {
  const { state, openApp, focusWindow, minimizeWindow } = useDesktop();
  // const { isMobile } = useIsMobile(); // Removed
  const mouseX = useMotionValue<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const dockRef = useRef<HTMLDivElement>(null);

  // Auto-hide logic
  const [isVisible, setIsVisible] = useState(true);

  // Check if any window is open and NOT minimized
  const hasOpenWindows = state.windows.some(w => !w.isMinimized);

  useEffect(() => {
    // If no windows are overlapping the desktop area, keep dock visible
    if (!hasOpenWindows) {
      setIsVisible(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const screenHeight = window.innerHeight;
      const threshold = 20; // Distance from bottom to trigger show
      const hideThreshold = 100; // Distance from bottom to trigger hide (hysteresis)

      // If hovering dock, always show
      if (isHovered) {
        setIsVisible(true);
        return;
      }

      // If mouse at bottom, show
      if (e.clientY >= screenHeight - threshold) {
        setIsVisible(true);
      }
      // If mouse moves up, hide
      else if (e.clientY < screenHeight - hideThreshold) {
        setIsVisible(false);
      }
    };

    // Initial check when windows open/close or hover state changes
    if (!isHovered && hasOpenWindows) {
      // We don't force hide immediately to avoid jarring UX, 
      // but we start listening to mouse to decide when to hide.
      // Actually, if we just switched to having open windows, we might want to default to hidden 
      // unless mouse is already at bottom. 
      // For simplicity, let's just attach listener.
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHovered, hasOpenWindows]);


  const handleAppClick = (appId: string) => {
    // 1. Handle Mail specifically
    if (appId === "email") {
      window.open("mailto:gustoreg25gcee@gmail.com?subject=Gusto '26 Query", "_self");
      return;
    }

    const existingWindow = state.windows.find(
      (w) => w.appId === appId
    );

    if (existingWindow) {
      // 2. If window is already focused and not minimized, minimize it
      if (state.activeWindowId === existingWindow.id && !existingWindow.isMinimized) {
        minimizeWindow(existingWindow.id);
      } else {
        // 3. Otherwise (minimized or background), bring to front
        focusWindow(existingWindow.id);
      }
    } else {
      // 4. Not open -> open it
      openApp(appId);
    }
  };

  const handleTrashClick = () => {
    const trashWindow = state.windows.find((w) => w.appId === "trash");
    if (trashWindow) {
      if (state.activeWindowId === trashWindow.id && !trashWindow.isMinimized) {
        minimizeWindow(trashWindow.id);
      } else {
        focusWindow(trashWindow.id);
      }
    } else {
      openApp("trash");
    }
  };

  return (
    <motion.div
      ref={dockRef}
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(null)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      initial={{ x: "-50%", y: 0 }}
      animate={{ x: "-50%", y: isVisible ? 0 : 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-1/2 z-[9998] bottom-4"
    >
      <div
        className="dock-container flex items-end shadow-dock gap-3 px-3 py-3"
        style={{
          border: "1px solid var(--border-color)",
          backgroundColor: "var(--surface-primary)", //   theme color
          backdropFilter: "blur(12px)", // Mac-like blur
          borderRadius: "16px",
        }}
      >
        {dockItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isOpen={state.windows.some((w) => w.appId === item.appId)}
            onClick={() => handleAppClick(item.appId)}
          />
        ))}

        {/* Divider */}
        <div
          className="w-px self-center h-10 mx-2"
          style={{ backgroundColor: "var(--border-color)" }}
        />

        {/* Trash */}
        <DockIcon
          item={{
            id: "trash",
            name: "Trash",
            iconName: "trash",
            appId: "trash",
          }}
          mouseX={mouseX}
          isOpen={false} // Trash is always "open" conceptually but let's not show dot
          onClick={handleTrashClick}
          isTrash={true}
          hasItems={state.trashedItems.length > 0}
        />
      </div>
    </motion.div>
  );
}

function DockIcon({
  item,
  mouseX,
  isOpen,
  onClick,
  isTrash,
  hasItems,
}: {
  item: DockItem;
  mouseX: any;
  isOpen: boolean;
  onClick: () => void;
  isTrash?: boolean;
  hasItems?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number | null) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val ? val - bounds.x - bounds.width / 2 : Infinity;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div
      id={`dock-icon-${item.id}`}
      className="flex flex-col items-center gap-1 group relative"
    >
      {/* Tooltip — outside motion.div so overflow doesn't clip it */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[var(--border-color)] shadow-lg z-50">
        {item.name}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--border-color)]" />
      </div>

      <motion.div
        ref={ref}
        style={{
          width,
          height: width,
          backgroundColor: "transparent",
        }}
        onClick={onClick}
        className="dock-item relative flex items-center justify-center rounded-xl border border-transparent transition-colors cursor-pointer shadow-sm"
      >
        {(() => {
          const macSrc = getMacIcon(item.appId, isTrash && hasItems);
          return macSrc ? (
            <Image
              src={macSrc}
              alt={item.name}
              fill
              sizes="80px"
              className="object-contain pointer-events-none"
              draggable={false}
            />
          ) : (
            <div className="w-3/5 h-3/5">
              <ThemedIcon
                name={item.iconName}
                className="w-full h-full"
                style={{ color: getAppColor(item.appId).color }}
              />
            </div>
          );
        })()}
      </motion.div>

      {/* Active Indicator */}
      <div
        className={`w-1 h-1 rounded-full bg-[var(--text-primary)] transition-opacity ${isOpen ? "opacity-100" : "opacity-0"
          }`}
      />
    </div>
  );
}
