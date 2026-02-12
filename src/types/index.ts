export type FileType = 'folder' | 'text' | 'markdown' | 'pdf' | 'image' | 'app';

export type WallpaperType = 'solid' | 'gradient' | 'image';

export interface Wallpaper {
  id: string;
  name: string;
  type: WallpaperType;
  value: string;
  thumbnail?: string;
}

export interface ScreensaverSettings {
  enabled: boolean;
  timeout: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  icon?: string;
  content?: string;
  children?: FileNode[];
  metadata?: {
    size?: string;
    modified?: string;
    techStack?: string[];
    link?: string;
    images?: string[];
  };
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  data?: unknown;
}

export interface DesktopItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'file' | 'app';
  fileType?: FileType;
  x: number;
  y: number;
  appId?: string;
  fileId?: string;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  component: string;
}

export interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
}

export interface MinesweeperCell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
}

export type MinesweeperDifficulty = 'easy' | 'medium' | 'hard';

export type SnakeDifficulty = 'easy' | 'medium' | 'hard';

export interface MinesweeperState {
  grid: MinesweeperCell[][];
  rows: number;
  cols: number;
  mines: number;
  gameState: 'idle' | 'playing' | 'won' | 'lost';
  flagsPlaced: number;
  startTime: number | null;
  elapsedTime: number;
}

export interface TerminalCommand {
  input: string;
  output: string | React.ReactNode;
  timestamp: number;
}

export type ThemeId = 'modern' | 'classic' | 'terminal' | 'nordic' | 'retro' | 'ph-light' | 'ph-dark';

export type IconLibrary = 'lucide' | 'phosphor';

export interface ThemeIconConfig {
  library: IconLibrary;
  strokeWidth: number;
  filled: boolean;
}

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  iconConfig: ThemeIconConfig;
  recommendedWallpaper: string;
}
