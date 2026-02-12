"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useDesktop } from "../../contexts/DesktopContext";
import { ThemedIcon } from "../ui/ThemedIcon";
import { useIsMobile } from "../../hooks/useIsMobile";

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
];

export function Dock() {
  const { state, openApp, focusWindow } = useDesktop();
  const { isMobile } = useIsMobile();
  const mouseX = useMotionValue<number | null>(null);

  const handleAppClick = (appId: string) => {
    const existingWindow = state.windows.find(
      (w) => w.appId === appId && !w.isMinimized,
    );

    if (existingWindow) {
      focusWindow(existingWindow.id);
    } else {
      openApp(appId);
    }
  };

  const handleTrashClick = () => {
    openApp("trash");
  };

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(null)}
      className={`fixed left-1/2 -translate-x-1/2 z-[9998] ${isMobile ? "bottom-2" : "bottom-4"}`}
    >
      <div
        className={`dock-container flex items-end shadow-dock ${isMobile ? "gap-1 px-2 py-2" : "gap-3 px-3 py-3"}`}
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
            isMobile={isMobile}
          />
        ))}

        {/* Divider */}
        <div
          className={`w-px self-center ${isMobile ? "h-6 mx-1" : "h-10 mx-2"}`}
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
          isMobile={isMobile}
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
  isMobile,
}: {
  item: DockItem;
  mouseX: any;
  isOpen: boolean;
  onClick: () => void;
  isTrash?: boolean;
  hasItems?: boolean;
  isMobile: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number | null) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val ? val - bounds.x - bounds.width / 2 : Infinity;
  });

  const widthSync = useTransform(
    distance,
    [-150, 0, 150],
    isMobile ? [40, 60, 40] : [48, 80, 48],
  );
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <div className="flex flex-col items-center gap-1 group">
      <motion.div
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className="dock-item relative flex items-center justify-center rounded-xl bg-[var(--surface-secondary)] border border-transparent hover:border-[var(--ph-orange)] transition-colors cursor-pointer shadow-sm"
      >
        <div className="w-3/5 h-3/5 text-[var(--ph-orange)]">
          <ThemedIcon
            name={item.iconName}
            className="w-full h-full"
            style={
              isTrash && hasItems
                ? { color: "var(--ph-orange)" }
                : isTrash
                  ? { color: "var(--text-secondary)" }
                  : undefined
            }
          />
        </div>

        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-[var(--border-color)] shadow-lg z-50">
          {item.name}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[var(--border-color)]" />
        </div>
      </motion.div>

      {/* Active Indicator */}
      <div
        className={`w-1 h-1 rounded-full bg-[var(--text-primary)] transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
