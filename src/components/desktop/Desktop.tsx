"use client";

import { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { DesktopIcon } from "./DesktopIcon";
import { DesktopWidgets } from "./DesktopWidgets";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { WindowManager } from "./WindowManager";
import { MatrixEffect } from "../effects/MatrixEffect";
import { ConfettiEffect } from "../effects/ConfettiEffect";
import { Screensaver } from "../effects/Screensaver";
import { BootScreen } from "../system/BootScreen";
import { ContextMenu } from "../ui/ContextMenu";
import { useDesktop } from "../../contexts/DesktopContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { DesktopItem } from "../../types";

import { fileSystem } from "../../data/filesystem";

export function Desktop() {
  const {
    state,
    deselectAll,
    setMatrixMode,
    setPartyMode,
    openContextMenu,
    closeContextMenu,
    setWallpaper,
  } = useDesktop();
  const { isMobile } = useIsMobile();
  const [isBooting, setIsBooting] = useState(true);
  const desktopRef = useRef<HTMLDivElement>(null);
  const konamiSequence = useRef<string[]>([]);
  const tripleClickCount = useRef(0);
  const tripleClickTimer = useRef<ReturnType<typeof setTimeout>>();
  const [iconsJiggling, setIconsJiggling] = useState(false);
  /* ... (existing code) ... */

  const desktopItems = useMemo<DesktopItem[]>(() => {
    if (!fileSystem.children) return [];
    return fileSystem.children.map((child, index) => ({
      id: child.id,
      name: child.name,
      icon:
        child.type === "app"
          ? child.icon || "file"
          : child.type === "folder"
            ? "folder"
            : "file",
      type:
        child.type === "app"
          ? "app"
          : child.type === "folder"
            ? "folder"
            : "file",
      x: isMobile ? 0 : 20,
      y: isMobile ? 0 : 20 + index * 100,
      fileId: child.type === "app" ? undefined : child.id,
      appId: child.type === "app" ? child.name.toLowerCase() : undefined,
    }));
  }, [isMobile]);

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

  const handleDesktopClick = (e: React.MouseEvent) => {
    if (e.target === desktopRef.current) {
      deselectAll();

      tripleClickCount.current++;
      if (tripleClickTimer.current) {
        clearTimeout(tripleClickTimer.current);
      }

      if (tripleClickCount.current >= 3) {
        setIconsJiggling(true);
        setTimeout(() => setIconsJiggling(false), 500);
        tripleClickCount.current = 0;
      } else {
        tripleClickTimer.current = setTimeout(() => {
          tripleClickCount.current = 0;
        }, 500);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.target === desktopRef.current) {
      deselectAll();
      openContextMenu(e.clientX, e.clientY, [
        {
          label: "New Folder",
          icon: require("lucide-react").FolderPlus,
          action: () => console.log("New Folder"),
          disabled: true,
        },
        { separator: true },
        {
          label: "Clean Up",
          icon: require("lucide-react").Sparkles,
          action: () => console.log("Clean Up"),
          disabled: true,
        },
        { label: "Sort By", disabled: true },
        { separator: true },
        {
          label: "Change Wallpaper...",
          icon: require("lucide-react").Image,
          action: () => {
            // We can't easily open specific settings tab yet, so just placeholder
            console.log("Open settings");
          },
          disabled: true,
        },
      ]);
    }
  };

  useEffect(() => {
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      konamiSequence.current.push(e.code);
      konamiSequence.current = konamiSequence.current.slice(-10);

      if (konamiSequence.current.join(",") === konamiCode.join(",")) {
        document.body.classList.add("crt-effect");
        setTimeout(() => document.body.classList.remove("crt-effect"), 5000);
        konamiSequence.current = [];
      }

      if (e.metaKey && e.key === "w") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useLayoutEffect(() => {
    const themeClasses = [
      "theme-modern",
      "theme-classic",
      "theme-terminal",
      "theme-nordic",
      "theme-retro",
      "theme-ph-light",
      "theme-ph-dark",
    ];
    themeClasses.forEach((cls) => document.body.classList.remove(cls));
    document.body.classList.add(`theme-${state.theme.id}`);
  }, [state.theme.id]);

  return (
    <div
      ref={desktopRef}
      className="w-full h-full relative transition-all duration-500 overflow-hidden"
      style={wallpaperStyle}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      <AnimatePresence>
        {isBooting && (
          <BootScreen
            onComplete={() => {
              setIsBooting(false);
              // Request fullscreen after boot animation
              try {
                const el = document.documentElement;
                if (!document.fullscreenElement && el.requestFullscreen) {
                  el.requestFullscreen().catch(() => {});
                }
              } catch {}
            }}
          />
        )}
      </AnimatePresence>

      <DesktopWidgets />
      <MenuBar />

      <div
        className={`absolute inset-0 pt-10 pb-20 px-4 pointer-events-none ${isMobile ? "mobile-icons-container" : ""}`}
      >
        <div
          className={`pointer-events-auto ${isMobile ? "mobile-icons-grid" : ""}`}
        >
          {desktopItems.map((item) => (
            <div
              key={item.id}
              className={iconsJiggling ? "animate-icon-jiggle" : ""}
            >
              <DesktopIcon item={item} isMobile={isMobile} />
            </div>
          ))}
        </div>
      </div>

      <WindowManager />
      <Dock />

      {state.isMatrixMode && (
        <MatrixEffect onComplete={() => setMatrixMode(false)} />
      )}
      {state.isPartyMode && (
        <ConfettiEffect onComplete={() => setPartyMode(false)} />
      )}

      {state.contextMenu.isOpen && (
        <ContextMenu
          x={state.contextMenu.x}
          y={state.contextMenu.y}
          items={state.contextMenu.items}
          onClose={closeContextMenu}
        />
      )}

      <Screensaver />
    </div>
  );
}
