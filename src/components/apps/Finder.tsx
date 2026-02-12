"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  File,
  Home,
  User,
  Briefcase,
  Code,
  Sparkles,
  LayoutGrid,
  List,
} from "lucide-react";
import { MacFolder } from "../ui/icons/MacFolder";
import { FilePreview } from "../ui/FilePreview";
import { useDesktop } from "../../contexts/DesktopContext";
import { useAchievements } from "../../contexts/AchievementsContext";
import { fileSystem, getFilePath } from "../../data/filesystem";
import type { FileNode } from "../../types";

interface FinderProps {
  windowId: string;
  data?: { currentFolder?: FileNode };
}

const iconMap: Record<string, typeof Folder> = {
  folder: Folder,
  text: FileText,
  markdown: File,
  pdf: FileText,
  "about-me": User,
  experience: Briefcase,
  projects: Code,
  playground: Sparkles,
};

export function Finder({ windowId, data }: FinderProps) {
  const { openFile, updateWindowData } = useDesktop();
  const { markFolderVisited, markFileOpened } = useAchievements();
  const [currentFolder, setCurrentFolder] = useState<FileNode>(
    data?.currentFolder || fileSystem,
  );
  const [history, setHistory] = useState<FileNode[]>([
    data?.currentFolder || fileSystem,
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigateTo = useCallback(
    (folder: FileNode) => {
      setCurrentFolder(folder);
      setSelectedItem(null);
      setHistory((prev) => {
        const newHistory = [...prev.slice(0, historyIndex + 1), folder];
        setHistoryIndex(newHistory.length - 1);
        return newHistory;
      });
      updateWindowData(windowId, { currentFolder: folder });
      markFolderVisited(folder.id);
    },
    [historyIndex, windowId, updateWindowData, markFolderVisited],
  );

  useEffect(() => {
    if (data?.currentFolder && data.currentFolder.id !== currentFolder.id) {
      navigateTo(data.currentFolder);
    }
  }, [data?.currentFolder, currentFolder.id, navigateTo]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentFolder(history[newIndex]);
      setSelectedItem(null);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentFolder(history[newIndex]);
      setSelectedItem(null);
    }
  };

  const handleItemClick = (item: FileNode) => {
    setSelectedItem(item.id);
  };

  const handleItemDoubleClick = (item: FileNode) => {
    if (item.type === "folder") {
      navigateTo(item);
    } else {
      openFile(item);
      markFileOpened(item.id);
    }
  };

  const breadcrumbs = getFilePath(currentFolder.id) || ["Desktop"];

  const sidebarItems = [
    { id: "root", name: "Desktop", icon: Home, folder: fileSystem },
    ...(fileSystem.children?.map((child) => ({
      id: child.id,
      name: child.name,
      icon: iconMap[child.id] || Folder,
      folder: child,
    })) || []),
  ];

  const getItemIcon = (item: FileNode) => {
    const IconComponent = iconMap[item.id] || iconMap[item.type] || Folder;
    return IconComponent;
  };

  return (
    <div className="flex h-full">
      <div className="hidden md:flex w-48 bg-desktop-surface/50 border-r border-warm-800/30 flex-col">
        <div className="p-3">
          <p className="text-xs text-warm-400 uppercase tracking-wider mb-2 font-medium ml-2">
            Favorites
          </p>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFolder.id === item.folder.id;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--ph-orange)] text-white font-medium shadow-sm"
                    : "text-warm-300 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => navigateTo(item.folder)}
              >
                <Icon size={18} />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-10 flex items-center justify-between px-3 border-b border-warm-800/30 bg-desktop-surface/30">
          <div className="flex items-center gap-1">
            <button
              className={`p-1 rounded hover:bg-warm-700/30 ${
                historyIndex <= 0
                  ? "opacity-30 cursor-not-allowed"
                  : "text-warm-300"
              }`}
              onClick={goBack}
              disabled={historyIndex <= 0}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className={`p-1 rounded hover:bg-warm-700/30 ${
                historyIndex >= history.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "text-warm-300"
              }`}
              onClick={goForward}
              disabled={historyIndex >= history.length - 1}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1 text-sm text-warm-400">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center">
                {index > 0 && <ChevronRight size={14} className="mx-1" />}
                <span
                  className={
                    index === breadcrumbs.length - 1 ? "text-warm-200" : ""
                  }
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                viewMode === "grid" ? "text-white bg-white/10" : "text-warm-400"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              className={`p-1 rounded hover:bg-white/10 transition-colors ${
                viewMode === "list" ? "text-white bg-white/10" : "text-warm-400"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {currentFolder.children && currentFolder.children.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentFolder.children.map((item) => {
                  const Icon = getItemIcon(item);
                  const isSelected = selectedItem === item.id;
                  return (
                    // ...

                    <motion.button
                      key={item.id}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                        isSelected ? "bg-warm-700/40" : "hover:bg-warm-700/20"
                      }`}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      whileHover={{
                        scale: 1.08,
                        backgroundColor: "rgba(255,255,255,0.05)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                      }}
                    >
                      {item.type === "folder" ? (
                        <MacFolder size={48} />
                      ) : (
                        <div className="scale-125 origin-bottom">
                          <FilePreview
                            type={item.type || "file"}
                            name={item.name}
                          />
                        </div>
                      )}
                      <span className="text-xs text-[var(--text-primary)] mt-3 text-center leading-tight max-w-full font-medium">
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1">
                {currentFolder.children.map((item) => {
                  const Icon = getItemIcon(item);
                  const isSelected = selectedItem === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors border border-transparent ${
                        isSelected
                          ? "bg-[var(--ph-orange)]/20 border-[var(--ph-orange)]/30"
                          : "hover:bg-white/5 hover:border-white/10"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleItemClick(item);
                      }}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        handleItemDoubleClick(item);
                      }}
                    >
                      {item.type === "folder" ? (
                        <MacFolder size={20} />
                      ) : (
                        <Icon size={20} className="text-warm-200" />
                      )}
                      <span className="text-sm text-warm-100 font-medium">
                        {item.name}
                      </span>
                      <span className="text-xs text-warm-500 ml-auto capitalize">
                        {item.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-warm-500">
              <Folder size={48} strokeWidth={1} />
              <p className="mt-2 text-sm">This folder is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
