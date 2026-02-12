"use client";

import { useDesktop } from "../../contexts/DesktopContext";
import * as LucideIcons from "lucide-react";
import * as PhosphorIcons from "@phosphor-icons/react";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { IconLibrary } from "../../types";

// Material Design icons (Android style) — imported individually for tree-shaking
import {
  MdCalendarToday,
  MdDateRange,
  MdAssignment,
  MdMail,
  MdMap,
  MdTerminal,
  MdSportsEsports,
  MdMusicNote,
  MdDelete,
  MdSettings,
  MdFolder,
  MdInsertDriveFile,
  MdDescription,
  MdImage,
  MdEmojiEvents,
  MdPalette,
  MdMonitor,
  MdLightMode,
  MdDarkMode,
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
  MdClose,
  MdCheck,
  MdStar,
  MdAccessTime,
  MdWifi,
  MdBatteryFull,
  MdApps,
  MdList,
  MdHome,
  MdDownload,
  MdDesktopWindows,
  MdAutoAwesome,
} from "react-icons/md";
import { GiBombingRun } from "react-icons/gi";
import type { IconType } from "react-icons";

type LucideIconName = keyof typeof LucideIcons;
type PhosphorIconName = keyof typeof PhosphorIcons;

interface IconMappingEntry {
  lucide: LucideIconName;
  phosphor: PhosphorIconName;
  material: IconType;
}

const iconMapping: Record<string, IconMappingEntry> = {
  folder: { lucide: "Folder", phosphor: "Folder", material: MdFolder },
  terminal: { lucide: "Terminal", phosphor: "Terminal", material: MdTerminal },
  mail: { lucide: "Mail", phosphor: "Envelope", material: MdMail },
  bomb: { lucide: "Bomb", phosphor: "Bomb", material: GiBombingRun },
  gamepad: {
    lucide: "Gamepad2",
    phosphor: "GameController",
    material: MdSportsEsports,
  },
  gamepad2: {
    lucide: "Gamepad2",
    phosphor: "GameController",
    material: MdSportsEsports,
  },
  music: { lucide: "Music", phosphor: "MusicNotes", material: MdMusicNote },
  trash: { lucide: "Trash2", phosphor: "Trash", material: MdDelete },
  settings: { lucide: "Settings", phosphor: "Gear", material: MdSettings },
  file: { lucide: "File", phosphor: "File", material: MdInsertDriveFile },
  fileText: {
    lucide: "FileText",
    phosphor: "FileText",
    material: MdDescription,
  },
  image: { lucide: "Image", phosphor: "Image", material: MdImage },
  trophy: { lucide: "Trophy", phosphor: "Trophy", material: MdEmojiEvents },
  palette: { lucide: "Palette", phosphor: "Palette", material: MdPalette },
  monitor: { lucide: "Monitor", phosphor: "Monitor", material: MdMonitor },
  sun: { lucide: "Sun", phosphor: "Sun", material: MdLightMode },
  moon: { lucide: "Moon", phosphor: "Moon", material: MdDarkMode },
  chevronLeft: {
    lucide: "ChevronLeft",
    phosphor: "CaretLeft",
    material: MdChevronLeft,
  },
  chevronRight: {
    lucide: "ChevronRight",
    phosphor: "CaretRight",
    material: MdChevronRight,
  },
  search: { lucide: "Search", phosphor: "MagnifyingGlass", material: MdSearch },
  x: { lucide: "X", phosphor: "X", material: MdClose },
  check: { lucide: "Check", phosphor: "Check", material: MdCheck },
  star: { lucide: "Star", phosphor: "Star", material: MdStar },
  clock: { lucide: "Clock", phosphor: "Clock", material: MdAccessTime },
  wifi: { lucide: "Wifi", phosphor: "WifiHigh", material: MdWifi },
  battery: {
    lucide: "Battery",
    phosphor: "BatteryFull",
    material: MdBatteryFull,
  },
  apple: { lucide: "Apple", phosphor: "AppleLogo", material: MdApps },
  grid: { lucide: "Grid3X3", phosphor: "SquaresFour", material: MdApps },
  list: { lucide: "List", phosphor: "List", material: MdList },
  home: { lucide: "Home", phosphor: "House", material: MdHome },
  download: {
    lucide: "Download",
    phosphor: "DownloadSimple",
    material: MdDownload,
  },
  desktop: {
    lucide: "Monitor",
    phosphor: "Desktop",
    material: MdDesktopWindows,
  },
  sparkles: {
    lucide: "Sparkles",
    phosphor: "Sparkle",
    material: MdAutoAwesome,
  },
  calendar: {
    lucide: "Calendar",
    phosphor: "CalendarBlank",
    material: MdCalendarToday,
  },
  calendarDays: {
    lucide: "Calendar",
    phosphor: "CalendarBlank",
    material: MdDateRange,
  },
  clipboard: {
    lucide: "ClipboardList",
    phosphor: "ClipboardText",
    material: MdAssignment,
  },
  map: { lucide: "Map", phosphor: "MapTrifold", material: MdMap },
};

interface ThemedIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
  /** Override platform detection: 'mobile' forces Material Design, 'desktop' forces Phosphor */
  platform?: "mobile" | "desktop" | "auto";
}

function getPhosphorWeight(filled: boolean): "regular" | "bold" | "fill" {
  return filled ? "fill" : "regular";
}

export function ThemedIcon({
  name,
  size = 24,
  className = "",
  style,
  weight,
  platform = "auto",
}: ThemedIconProps) {
  const { state } = useDesktop();
  const { iconConfig } = state.theme;
  const { isMobile } = useIsMobile();
  const mapping = iconMapping[name];

  if (!mapping) {
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon size={size} className={className} style={style} />;
  }

  // Determine which platform to render for
  const useMobileIcons =
    platform === "mobile" || (platform === "auto" && isMobile);

  // Mobile → Material Design icons (Android style)
  if (useMobileIcons) {
    const MaterialIcon = mapping.material;
    if (MaterialIcon) {
      return <MaterialIcon size={size} className={className} style={style} />;
    }
  }

  // Desktop → Phosphor icons (macOS style)
  if (iconConfig.library === "phosphor") {
    const PhosphorIcon = PhosphorIcons[
      mapping.phosphor
    ] as React.ComponentType<{
      size: number;
      className?: string;
      style?: React.CSSProperties;
      weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
    }>;
    if (PhosphorIcon) {
      return (
        <PhosphorIcon
          size={size}
          className={className}
          style={style}
          weight={weight || getPhosphorWeight(iconConfig.filled)}
        />
      );
    }
  }

  const LucideIcon = LucideIcons[mapping.lucide] as React.ComponentType<{
    size: number;
    className?: string;
    style?: React.CSSProperties;
    strokeWidth?: number;
  }>;
  if (LucideIcon) {
    return (
      <LucideIcon
        size={size}
        className={className}
        style={style}
        strokeWidth={iconConfig.strokeWidth}
      />
    );
  }

  const FallbackIcon = LucideIcons.HelpCircle;
  return <FallbackIcon size={size} className={className} style={style} />;
}

export function useIconConfig() {
  const { state } = useDesktop();
  return state.theme.iconConfig;
}

export function getIconLibrary(): IconLibrary {
  return "lucide";
}
