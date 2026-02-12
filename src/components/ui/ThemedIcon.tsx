'use client';

import { useDesktop } from '../../contexts/DesktopContext';
import * as LucideIcons from 'lucide-react';
import * as PhosphorIcons from '@phosphor-icons/react';
import type { IconLibrary } from '../../types';

type LucideIconName = keyof typeof LucideIcons;
type PhosphorIconName = keyof typeof PhosphorIcons;

const iconMapping: Record<string, { lucide: LucideIconName; phosphor: PhosphorIconName }> = {
  folder: { lucide: 'Folder', phosphor: 'Folder' },
  terminal: { lucide: 'Terminal', phosphor: 'Terminal' },
  mail: { lucide: 'Mail', phosphor: 'Envelope' },
  bomb: { lucide: 'Bomb', phosphor: 'Bomb' },
  gamepad: { lucide: 'Gamepad2', phosphor: 'GameController' },
  music: { lucide: 'Music', phosphor: 'MusicNotes' },
  trash: { lucide: 'Trash2', phosphor: 'Trash' },
  settings: { lucide: 'Settings', phosphor: 'Gear' },
  file: { lucide: 'File', phosphor: 'File' },
  fileText: { lucide: 'FileText', phosphor: 'FileText' },
  image: { lucide: 'Image', phosphor: 'Image' },
  trophy: { lucide: 'Trophy', phosphor: 'Trophy' },
  palette: { lucide: 'Palette', phosphor: 'Palette' },
  monitor: { lucide: 'Monitor', phosphor: 'Monitor' },
  sun: { lucide: 'Sun', phosphor: 'Sun' },
  moon: { lucide: 'Moon', phosphor: 'Moon' },
  chevronLeft: { lucide: 'ChevronLeft', phosphor: 'CaretLeft' },
  chevronRight: { lucide: 'ChevronRight', phosphor: 'CaretRight' },
  search: { lucide: 'Search', phosphor: 'MagnifyingGlass' },
  x: { lucide: 'X', phosphor: 'X' },
  check: { lucide: 'Check', phosphor: 'Check' },
  star: { lucide: 'Star', phosphor: 'Star' },
  clock: { lucide: 'Clock', phosphor: 'Clock' },
  wifi: { lucide: 'Wifi', phosphor: 'WifiHigh' },
  battery: { lucide: 'Battery', phosphor: 'BatteryFull' },
  apple: { lucide: 'Apple', phosphor: 'AppleLogo' },
  grid: { lucide: 'Grid3X3', phosphor: 'SquaresFour' },
  list: { lucide: 'List', phosphor: 'List' },
  home: { lucide: 'Home', phosphor: 'House' },
  download: { lucide: 'Download', phosphor: 'DownloadSimple' },
  desktop: { lucide: 'Monitor', phosphor: 'Desktop' },
  sparkles: { lucide: 'Sparkles', phosphor: 'Sparkle' },
  calendar: { lucide: 'Calendar', phosphor: 'CalendarBlank' },
};

interface ThemedIconProps {
  name: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
}

function getPhosphorWeight(filled: boolean): 'regular' | 'bold' | 'fill' {
  return filled ? 'fill' : 'regular';
}

export function ThemedIcon({ name, size = 24, className = '', style, weight }: ThemedIconProps) {
  const { state } = useDesktop();
  const { iconConfig } = state.theme;
  const mapping = iconMapping[name];

  if (!mapping) {
    const FallbackIcon = LucideIcons.HelpCircle;
    return <FallbackIcon size={size} className={className} style={style} />;
  }

  if (iconConfig.library === 'phosphor') {
    const PhosphorIcon = PhosphorIcons[mapping.phosphor] as React.ComponentType<{
      size: number;
      className?: string;
      style?: React.CSSProperties;
      weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
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
  return 'lucide';
}
