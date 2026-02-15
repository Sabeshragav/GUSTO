"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type {
  WindowState,
  DesktopItem,
  FileNode,
  Wallpaper,
  ScreensaverSettings,
  Theme,
} from "../types";
import type { ContextMenuItem } from "../components/ui/ContextMenu";
import { fileSystem } from "../data/filesystem";
import { themes } from "../data/themes";

export const wallpapers: Wallpaper[] = [
  { id: "charcoal", name: "Charcoal", type: "solid", value: "#1a1a1a" },
  { id: "slate", name: "Slate", type: "solid", value: "#2d3748" },
  { id: "midnight", name: "Midnight", type: "solid", value: "#0f172a" },
  {
    id: "gradient-ocean",
    name: "Ocean Depths",
    type: "gradient",
    value: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 50%, #1b263b 100%)",
  },
  {
    id: "gradient-dusk",
    name: "Desert Dusk",
    type: "gradient",
    value: "linear-gradient(135deg, #2c1810 0%, #4a3728 50%, #1a1410 100%)",
  },
  { id: "white", name: "Clean White", type: "solid", value: "#ffffff" },
  { id: "terminal-black", name: "Terminal", type: "solid", value: "#000000" },
  {
    id: "nordic-blue",
    name: "Nordic Blue",
    type: "gradient",
    value: "linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e3a5f 100%)",
  },
  {
    id: "retro-amber",
    name: "Retro Amber",
    type: "gradient",
    value: "linear-gradient(135deg, #1a1000 0%, #2d1f00 50%, #1a1200 100%)",
  },

  {
    id: "img-concrete",
    name: "Concrete",
    type: "image",
    value:
      "https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1097456/pexels-photo-1097456.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-architecture",
    name: "Architecture",
    type: "image",
    value:
      "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-minimal",
    name: "Minimal",
    type: "image",
    value:
      "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=200",
  },

  {
    id: "img-mountains",
    name: "Mountains",
    type: "image",
    value:
      "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-forest",
    name: "Forest",
    type: "image",
    value:
      "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-lake",
    name: "Lake",
    type: "image",
    value:
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=200",
  },

  {
    id: "img-circuit",
    name: "Circuit",
    type: "image",
    value:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-code",
    name: "Code",
    type: "image",
    value:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-server",
    name: "Server Room",
    type: "image",
    value:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=200",
  },

  {
    id: "img-aurora",
    name: "Aurora",
    type: "image",
    value:
      "https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1938348/pexels-photo-1938348.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-fjord",
    name: "Fjord",
    type: "image",
    value:
      "https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-snow",
    name: "Snow Peaks",
    type: "image",
    value:
      "https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/869258/pexels-photo-869258.jpeg?auto=compress&cs=tinysrgb&w=200",
  },

  {
    id: "img-vintage",
    name: "Vintage Tech",
    type: "image",
    value:
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-typewriter",
    name: "Typewriter",
    type: "image",
    value:
      "https://images.pexels.com/photos/952594/pexels-photo-952594.jpeg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/952594/pexels-photo-952594.jpeg?auto=compress&cs=tinysrgb&w=200",
  },
  {
    id: "img-sunset",
    name: "Golden Sunset",
    type: "image",
    value:
      "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=1920",
    thumbnail:
      "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?auto=compress&cs=tinysrgb&w=200",
  },
];

export { themes };

interface DesktopState {
  windows: WindowState[];
  activeWindowId: string | null;
  selectedDesktopItems: string[];
  nextZIndex: number;
  trashedItems: DesktopItem[];
  isMatrixMode: boolean;
  isPartyMode: boolean;
  wallpaper: Wallpaper;
  screensaver: ScreensaverSettings;
  theme: Theme;
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  };
}

type DesktopAction =
  | { type: "OPEN_WINDOW"; payload: Omit<WindowState, "zIndex"> }
  | { type: "CLOSE_WINDOW"; payload: string }
  | { type: "FOCUS_WINDOW"; payload: string }
  | { type: "MINIMIZE_WINDOW"; payload: string }
  | { type: "MAXIMIZE_WINDOW"; payload: string }
  | { type: "MOVE_WINDOW"; payload: { id: string; x: number; y: number } }
  | {
    type: "RESIZE_WINDOW";
    payload: { id: string; width: number; height: number };
  }
  | { type: "UPDATE_WINDOW_DATA"; payload: { id: string; data: unknown } }
  | { type: "SELECT_DESKTOP_ITEM"; payload: string }
  | { type: "DESELECT_ALL" }
  | { type: "TRASH_ITEM"; payload: DesktopItem }
  | { type: "EMPTY_TRASH" }
  | { type: "RESTORE_FROM_TRASH"; payload: string }
  | { type: "SET_MATRIX_MODE"; payload: boolean }
  | { type: "SET_PARTY_MODE"; payload: boolean }
  | { type: "SET_WALLPAPER"; payload: Wallpaper }
  | { type: "SET_SCREENSAVER"; payload: ScreensaverSettings }
  | { type: "SET_THEME"; payload: { theme: Theme; wallpaper?: Wallpaper } }
  | {
    type: "OPEN_CONTEXT_MENU";
    payload: { x: number; y: number; items: ContextMenuItem[] };
  }
  | { type: "CLOSE_CONTEXT_MENU" };

export const protectedTrashFiles: Record<string, string> = {
  "trash-passwords": "Absolutely not.",
  "trash-journal": "Nope. Nope. Nope.",
  "trash-bank": "Financial data is not part of the  Gusto-2026.",
  "trash-roi": "Some metrics hurt more than they help.",
};

const initialTrashItems: DesktopItem[] = [
  {
    id: "trash-passwords",
    name: "passwords.txt",
    icon: "file",
    type: "file",
    x: 0,
    y: 0,
  },
  {
    id: "trash-journal",
    name: "journal_2020-2022.txt",
    icon: "file",
    type: "file",
    x: 0,
    y: 0,
  },
  {
    id: "trash-bank",
    name: "bank_transactions_2021.csv",
    icon: "file",
    type: "file",
    x: 0,
    y: 0,
  },
  {
    id: "trash-roi",
    name: "side_projects_roi.csv",
    icon: "file",
    type: "file",
    x: 0,
    y: 0,
  },
];

const initialState: DesktopState = {
  windows: [],
  activeWindowId: null,
  selectedDesktopItems: [],
  nextZIndex: 100,
  trashedItems: initialTrashItems,
  isMatrixMode: false,
  isPartyMode: false,
  wallpaper: wallpapers[0],
  screensaver: { enabled: false, timeout: 5 },
  theme: themes.find((t) => t.id === "ph-dark") || themes[0],
  contextMenu: { isOpen: false, x: 0, y: 0, items: [] },
};

function desktopReducer(
  state: DesktopState,
  action: DesktopAction,
): DesktopState {
  switch (action.type) {
    case "OPEN_WINDOW": {
      const existingWindow = state.windows.find(
        (w) => w.id === action.payload.id,
      );
      if (existingWindow) {
        return {
          ...state,
          activeWindowId: action.payload.id,
          windows: state.windows.map((w) =>
            w.id === action.payload.id
              ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
              : w,
          ),
          nextZIndex: state.nextZIndex + 1,
        };
      }
      return {
        ...state,
        windows: [
          ...state.windows,
          { ...action.payload, zIndex: state.nextZIndex },
        ],
        activeWindowId: action.payload.id,
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case "CLOSE_WINDOW":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.payload),
        activeWindowId:
          state.activeWindowId === action.payload ? null : state.activeWindowId,
      };
    case "FOCUS_WINDOW":
      return {
        ...state,
        activeWindowId: action.payload,
        windows: state.windows.map((w) =>
          w.id === action.payload
            ? { ...w, isMinimized: false, zIndex: state.nextZIndex }
            : w,
        ),
        nextZIndex: state.nextZIndex + 1,
      };
    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload ? { ...w, isMinimized: true } : w,
        ),
        activeWindowId:
          state.activeWindowId === action.payload ? null : state.activeWindowId,
      };
    case "MAXIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload ? { ...w, isMaximized: !w.isMaximized } : w,
        ),
      };
    case "MOVE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id
            ? { ...w, x: action.payload.x, y: action.payload.y }
            : w,
        ),
      };
    case "RESIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id
            ? {
              ...w,
              width: action.payload.width,
              height: action.payload.height,
            }
            : w,
        ),
      };
    case "UPDATE_WINDOW_DATA":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.payload.id ? { ...w, data: action.payload.data } : w,
        ),
      };
    case "SELECT_DESKTOP_ITEM":
      return {
        ...state,
        selectedDesktopItems: [action.payload],
      };
    case "DESELECT_ALL":
      return {
        ...state,
        selectedDesktopItems: [],
      };
    case "TRASH_ITEM":
      return {
        ...state,
        trashedItems: [...state.trashedItems, action.payload],
      };
    case "EMPTY_TRASH":
      return {
        ...state,
        trashedItems: [],
      };
    case "RESTORE_FROM_TRASH":
      return {
        ...state,
        trashedItems: state.trashedItems.filter(
          (item) => item.id !== action.payload,
        ),
      };
    case "SET_MATRIX_MODE":
      return {
        ...state,
        isMatrixMode: action.payload,
      };
    case "SET_PARTY_MODE":
      return {
        ...state,
        isPartyMode: action.payload,
      };
    case "SET_WALLPAPER":
      return {
        ...state,
        wallpaper: action.payload,
      };
    case "SET_SCREENSAVER":
      return {
        ...state,
        screensaver: action.payload,
      };
    case "SET_THEME": {
      const { theme, wallpaper } = action.payload;
      return {
        ...state,
        theme,
        wallpaper: wallpaper || state.wallpaper,
      };
    }
    case "OPEN_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: {
          isOpen: true,
          x: action.payload.x,
          y: action.payload.y,
          items: action.payload.items,
        },
      };
    case "CLOSE_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: {
          ...state.contextMenu,
          isOpen: false,
        },
      };
    default:
      return state;
  }
}

interface DesktopContextValue {
  state: DesktopState;
  openWindow: (window: Omit<WindowState, "zIndex">) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  moveWindow: (id: string, x: number, y: number) => void;
  resizeWindow: (id: string, width: number, height: number) => void;
  updateWindowData: (id: string, data: unknown) => void;
  selectDesktopItem: (id: string) => void;
  deselectAll: () => void;
  trashItem: (item: DesktopItem) => void;
  emptyTrash: () => void;
  restoreFromTrash: (id: string) => void;
  setMatrixMode: (enabled: boolean) => void;
  setPartyMode: (enabled: boolean) => void;
  setWallpaper: (wallpaper: Wallpaper) => void;
  setScreensaver: (settings: ScreensaverSettings) => void;
  setTheme: (theme: Theme, applyWallpaper?: boolean) => void;
  openFile: (file: FileNode) => void;
  openApp: (appId: string, data?: unknown) => void;
  getActiveWindow: () => WindowState | null;
  isWindowOpen: (id: string) => boolean;
  openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
}

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(desktopReducer, initialState);

  const openWindow = useCallback((window: Omit<WindowState, "zIndex">) => {
    dispatch({ type: "OPEN_WINDOW", payload: window });
  }, []);

  const closeWindow = useCallback((id: string) => {
    dispatch({ type: "CLOSE_WINDOW", payload: id });
  }, []);

  const focusWindow = useCallback((id: string) => {
    dispatch({ type: "FOCUS_WINDOW", payload: id });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    dispatch({ type: "MINIMIZE_WINDOW", payload: id });
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    dispatch({ type: "MAXIMIZE_WINDOW", payload: id });
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    dispatch({ type: "MOVE_WINDOW", payload: { id, x, y } });
  }, []);

  const resizeWindow = useCallback(
    (id: string, width: number, height: number) => {
      dispatch({ type: "RESIZE_WINDOW", payload: { id, width, height } });
    },
    [],
  );

  const updateWindowData = useCallback((id: string, data: unknown) => {
    dispatch({ type: "UPDATE_WINDOW_DATA", payload: { id, data } });
  }, []);

  const selectDesktopItem = useCallback((id: string) => {
    dispatch({ type: "SELECT_DESKTOP_ITEM", payload: id });
  }, []);

  const deselectAll = useCallback(() => {
    dispatch({ type: "DESELECT_ALL" });
  }, []);

  const trashItem = useCallback((item: DesktopItem) => {
    dispatch({ type: "TRASH_ITEM", payload: item });
  }, []);

  const emptyTrash = useCallback(() => {
    dispatch({ type: "EMPTY_TRASH" });
  }, []);

  const restoreFromTrash = useCallback((id: string) => {
    dispatch({ type: "RESTORE_FROM_TRASH", payload: id });
  }, []);

  const setMatrixMode = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_MATRIX_MODE", payload: enabled });
  }, []);

  const setPartyMode = useCallback((enabled: boolean) => {
    dispatch({ type: "SET_PARTY_MODE", payload: enabled });
  }, []);

  const setWallpaper = useCallback((wallpaper: Wallpaper) => {
    dispatch({ type: "SET_WALLPAPER", payload: wallpaper });
  }, []);

  const setScreensaver = useCallback((settings: ScreensaverSettings) => {
    dispatch({ type: "SET_SCREENSAVER", payload: settings });
  }, []);

  const setTheme = useCallback((theme: Theme, applyWallpaper = true) => {
    const recommendedWallpaper = applyWallpaper
      ? wallpapers.find((w) => w.id === theme.recommendedWallpaper)
      : undefined;

    dispatch({
      type: "SET_THEME",
      payload: {
        theme,
        wallpaper: recommendedWallpaper,
      },
    });
  }, []);

  const openApp = useCallback(
    (appId: string, data?: unknown) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      const appConfigs: Record<string, Partial<WindowState>> = {
        finder: {
          id: "finder-main",
          title: "Finder",
          width: 800,
          height: 550,
          data: { currentFolder: fileSystem },
        },
        terminal: {
          id: "terminal",
          title: "Terminal",
          width: 700,
          height: 450,
        },
        email: {
          id: "email",
          title: "Mail",
          width: 900,
          height: 600,
        },
        minesweeper: {
          id: "minesweeper",
          title: "Minesweeper",
          width: 520,
          height: 580,
        },
        snake: {
          id: "snake",
          title: "Snake",
          width: 520,
          height: 600,
        },
        trash: {
          id: "trash",
          title: "Trash",
          width: 700,
          height: 500,
        },
        systemPreferences: {
          id: "system-preferences",
          title: "System Preferences",
          width: 750,
          height: 580,
        },
        achievements: {
          id: "achievements",
          title: "Achievements",
          width: 500,
          height: 550,
        },
        spotify: {
          id: "spotify",
          title: "Spotify",
          width: 520,
          height: 550,
        },
        calendar: {
          id: "calendar",
          title: "Calendar",
          width: 800,
          height: 600,
        },
        events: {
          id: "events",
          title: "GUSTO'26 Events",
          width: 900,
          height: 600,
        },
        rules: {
          id: "rules",
          title: "Rules",
          width: 650,
          height: 550,
        },
        contact: {
          id: "contact",
          title: "Contact",
          width: 700,
          height: 550,
        },
        transport: {
          id: "transport",
          title: "Transport",
          width: 800,
          height: 600,
        },
        register: {
          id: "register",
          title: "Register — GUSTO'26",
          width: 700,
          height: 650,
        },
        gallery: {
          id: "gallery",
          title: "Gallery",
          width: 700,
          height: 550,
        },
        about: {
          id: "about",
          title: "About — GUSTO'26",
          width: 500,
          height: 600,
        },
      };

      const config = appConfigs[appId];
      if (config) {
        openWindow({
          id: config.id!,
          appId,
          title: config.title!,
          x: centerX - (config.width || 600) / 2,
          y: centerY - (config.height || 400) / 2,
          width: config.width || 600,
          height: config.height || 400,
          isMinimized: false,
          isMaximized: false,
          data: data || config.data,
        });
      }
    },
    [openWindow],
  );

  const openFile = useCallback(
    (file: FileNode) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      if (file.type === "app") {
        openApp(file.name.toLowerCase());
        return;
      }

      if (file.type === "folder") {
        openWindow({
          id: `finder-${file.id}`,
          appId: "finder",
          title: file.name,
          x: centerX - 400,
          y: centerY - 275,
          width: 800,
          height: 550,
          isMinimized: false,
          isMaximized: false,
          data: { currentFolder: file },
        });
      } else if (file.type === "text" || file.type === "markdown") {
        openWindow({
          id: `viewer-${file.id}`,
          appId: "textViewer",
          title: file.name,
          x: centerX - 300,
          y: centerY - 250,
          width: 600,
          height: 500,
          isMinimized: false,
          isMaximized: false,
          data: { file },
        });
      } else if (file.type === "pdf") {
        openWindow({
          id: "pdf-viewer",
          appId: "pdfViewer",
          title: "CV.pdf",
          x: centerX - 350,
          y: centerY - 300,
          width: 700,
          height: 600,
          isMinimized: false,
          isMaximized: false,
          data: { file },
        });
      } else if (file.type === "image") {
        openWindow({
          id: `image-${file.id}`,
          appId: "imageViewer",
          title: file.name,
          x: centerX - 350,
          y: centerY - 250,
          width: 700,
          height: 500,
          isMinimized: false,
          isMaximized: false,
          data: { file },
        });
      }
    },
    [openWindow, openApp],
  );

  const getActiveWindow = useCallback(() => {
    return state.windows.find((w) => w.id === state.activeWindowId) || null;
  }, [state.windows, state.activeWindowId]);

  const isWindowOpen = useCallback(
    (id: string) => {
      return state.windows.some((w) => w.id === id && !w.isMinimized);
    },
    [state.windows],
  );

  const openContextMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[]) => {
      dispatch({ type: "OPEN_CONTEXT_MENU", payload: { x, y, items } });
    },
    [],
  );

  const closeContextMenu = useCallback(() => {
    dispatch({ type: "CLOSE_CONTEXT_MENU" });
  }, []);

  return (
    <DesktopContext.Provider
      value={{
        state,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        maximizeWindow,
        moveWindow,
        resizeWindow,
        updateWindowData,
        selectDesktopItem,
        deselectAll,
        trashItem,
        emptyTrash,
        restoreFromTrash,
        setMatrixMode,
        setPartyMode,
        setWallpaper,
        setScreensaver,
        setTheme,
        openFile,
        openApp,
        getActiveWindow,
        isWindowOpen,
        openContextMenu,
        closeContextMenu,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktop() {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return context;
}
