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
import posthog from "posthog-js";

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
      if (item.name === "Registration" && typeof window !== 'undefined') {
        console.log("[PostHog] try to register");
        posthog.capture("try to register");
      }
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
    <div className="flex h-full bg-[var(--surface-primary)]/80 backdrop-blur-2xl text-[var(--text-primary)]">
      {/* Sidebar - Translucent & Blur */}
      <div className="hidden md:flex w-52 flex-col pt-4 pb-4 px-2 border-r border-[var(--border-color)] bg-[var(--surface-secondary)]/30 backdrop-blur-xl">
        <div className="mb-2 px-2">
          <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 opacity-70">
            Favorites
          </p>
          <div className="space-y-0.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentFolder.id === item.folder.id;
              return (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--ph-orange)]/10 text-[var(--ph-orange)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  onClick={() => navigateTo(item.folder)}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[var(--ph-orange)]" : "text-[var(--text-tertiary)]"} />
                  <span className="truncate tracking-tight">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="mt-auto px-4 pb-2">
          <div className="h-[1px] bg-[var(--border-color)]/50 mb-4 w-full" />
          <div className="flex items-center gap-2 text-[var(--text-tertiary)]">
            <div className="w-2 h-2 rounded-full bg-green-500/50 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Connected</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-[var(--surface-bg)]/50">
        {/* Toolbar */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-[var(--border-color)] bg-[var(--surface-primary)]/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[var(--surface-secondary)]/50 p-0.5 rounded-lg border border-[var(--border-color)]/50">
              <button
                className={`p-1.5 rounded-md hover:bg-[var(--surface-elevated)] transition-colors ${
                  historyIndex <= 0
                    ? "opacity-30 cursor-not-allowed text-[var(--text-secondary)]"
                    : "text-[var(--text-primary)]"
                }`}
                onClick={goBack}
                disabled={historyIndex <= 0}
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                className={`p-1.5 rounded-md hover:bg-[var(--surface-elevated)] transition-colors ${
                  historyIndex >= history.length - 1
                    ? "opacity-30 cursor-not-allowed text-[var(--text-secondary)]"
                    : "text-[var(--text-primary)]"
                }`}
                onClick={goForward}
                disabled={historyIndex >= history.length - 1}
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </div>
            
            <span className="text-[var(--text-primary)] font-bold text-sm ml-2 hidden sm:block">
              {currentFolder.name}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-[var(--surface-secondary)]/50 p-0.5 rounded-lg border border-[var(--border-color)]/50">
            <button
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "grid" 
                  ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              className={`p-1.5 rounded-md transition-all ${
                viewMode === "list" 
                  ? "bg-[var(--surface-elevated)] text-[var(--text-primary)] shadow-sm" 
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setViewMode("list")}
            >
              <List size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 custom-scrollbar">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-6 px-1">
             <Home size={12} className="opacity-50" />
             {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-1.5">
                 <ChevronRight size={10} className="opacity-30" />
                 <span className={index === breadcrumbs.length - 1 ? "font-semibold text-[var(--text-primary)]" : "hover:text-[var(--text-primary)] transition-colors cursor-pointer"}>
                   {crumb}
                 </span>
              </span>
             ))}
          </div>

          {currentFolder.children && currentFolder.children.length > 0 ? (
            viewMode === "grid" ? (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {currentFolder.children.map((item) => {
                  const Icon = getItemIcon(item);
                  const isSelected = selectedItem === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      className={`group flex flex-col items-center p-3 rounded-xl transition-all duration-200 border ${
                        isSelected 
                          ? "bg-[var(--ph-orange)]/10 border-[var(--ph-orange)]/30 backdrop-blur-sm shadow-sm" 
                          : "bg-transparent border-transparent hover:bg-[var(--surface-secondary)]/50 hover:border-[var(--border-color)]/30"
                      }`}
                      onClick={() => handleItemClick(item)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="relative mb-3 drop-shadow-md transition-transform duration-200 group-hover:-translate-y-1">
                        {item.type === "folder" ? (
                          <MacFolder size={56} />
                        ) : (
                          <div className="mt-1">
                             <Icon size={48} strokeWidth={1} className={
                                item.type === "image" ? "text-purple-400" :
                                item.type === "pdf" ? "text-red-400" :
                                "text-[var(--text-secondary)]"
                             } />
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] md:text-xs font-medium text-center leading-tight max-w-full px-1 line-clamp-2 ${
                        isSelected ? "text-[var(--ph-orange)]" : "text-[var(--text-primary)]"
                      }`}>
                        {item.name}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-0.5"
              >
                <div className="flex px-4 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-[var(--border-color)] mb-1">
                  <span className="flex-1">Name</span>
                  <span className="w-24">Kind</span>
                  <span className="w-24 text-right">Size</span>
                </div>
                {currentFolder.children.map((item) => {
                  const Icon = getItemIcon(item);
                  const isSelected = selectedItem === item.id;
                  return (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors border border-transparent group ${
                        isSelected
                          ? "bg-[var(--ph-orange)]/10 border-[var(--ph-orange)]/20"
                          : "hover:bg-[var(--surface-secondary)]/50 border-transparent hover:border-[var(--border-color)]/30"
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
                        <Icon size={20} className="text-[var(--text-secondary)]" />
                      )}
                      <span className={`text-sm font-medium flex-1 ${isSelected ? "text-[var(--ph-orange)]" : "text-[var(--text-primary)]"}`}>
                        {item.name}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] w-24 capitalize opacity-70">
                        {item.type}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] w-24 text-right font-mono opacity-50">
                        --
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)] animate-fade-in">
              <div className="p-4 rounded-full bg-[var(--surface-secondary)]/50 mb-3">
                 <Folder size={32} strokeWidth={1.5} className="opacity-50" />
              </div>
              <p className="text-sm font-medium">Empty Folder</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
