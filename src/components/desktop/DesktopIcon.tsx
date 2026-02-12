"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Folder,
  FileText,
  File,
  Terminal,
  Mail,
  Trash2,
  Image,
  Bomb,
} from "lucide-react";
import { useDesktop } from "../../contexts/DesktopContext";
import type { DesktopItem } from "../../types";
import { findFileById } from "../../data/filesystem";
import { MacFolder } from "../ui/icons/MacFolder";
import { getAppColor } from "../../data/appColors";

interface DesktopIconProps {
  item: DesktopItem;
  isMobile?: boolean;
}

const iconMap: Record<string, typeof Folder> = {
  folder: Folder,
  file: FileText,
  text: FileText,
  markdown: File,
  pdf: FileText,
  image: Image,
  terminal: Terminal,
  mail: Mail,
  trash: Trash2,
  minesweeper: Bomb,
};

import { FilePreview } from "../ui/FilePreview";

export function DesktopIcon({ item, isMobile = false }: DesktopIconProps) {
  const {
    state,
    selectDesktopItem,
    openFile,
    openApp,
    deselectAll,
    openContextMenu,
    trashItem,
  } = useDesktop();
  const [isJiggling, setIsJiggling] = useState(false);
  const lastClickTime = useRef(0);
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = state.selectedDesktopItems.includes(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime.current;

    if (timeSinceLastClick < 300) {
      handleDoubleClick();
    } else {
      selectDesktopItem(item.id);
    }

    lastClickTime.current = now;
  };

  const handleDoubleClick = () => {
    deselectAll();

    if (item.appId) {
      openApp(item.appId);
    } else if (item.fileId) {
      const file = findFileById(item.fileId);
      if (file) {
        openFile(file);
      }
    }
  };

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      if (e.dataTransfer) {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
      }
    };

    const element = ref.current;
    if (element && !isMobile) {
      element.addEventListener("dragstart", handleDragStart);
      return () => {
        element.removeEventListener("dragstart", handleDragStart);
      };
    }
  }, [item.id, isMobile]);

  const triggerJiggle = () => {
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 300);
  };

  const IconComponent = iconMap[item.icon] || iconMap[item.type] || Folder;

  const getIconColor = () => {
    if (item.appId) {
      const appColor = getAppColor(item.appId);
      if (item.icon === "trash") {
        return state.trashedItems.length > 0
          ? appColor.color
          : "var(--text-secondary)";
      }
      return appColor.color;
    }
    if (item.icon === "trash") {
      return state.trashedItems.length > 0
        ? getAppColor("trash").color
        : "var(--text-secondary)";
    }
    return getAppColor(item.id).color;
  };

  const positionStyle: React.CSSProperties = isMobile
    ? {}
    : { position: "absolute", left: item.x, top: item.y };

  const isFolder = item.type === "folder" || item.icon === "folder";
  const isApp = item.type === "app";

  return (
    <motion.div
      ref={ref}
      className={`desktop-icon flex flex-col items-center justify-center p-2 cursor-pointer ${
        isMobile ? "w-full" : "w-24"
      } ${isSelected ? "bg-black/5 border border-[var(--border-color)]" : ""} ${isJiggling ? "animate-icon-jiggle" : ""}`}
      style={{
        ...positionStyle,
        borderRadius: "4px",
      }}
      onClick={handleClick}
      draggable={!isMobile}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        selectDesktopItem(item.id);

        openContextMenu(e.clientX, e.clientY, [
          {
            label: "Open",
            icon: require("lucide-react").ExternalLink,
            action: () => handleDoubleClick(),
          },
          {
            label: "Get Info",
            icon: require("lucide-react").Info,
            disabled: true,
          },
          { separator: true },
          {
            label: "Move to Trash",
            icon: require("lucide-react").Trash2,
            danger: true,
            action: () => trashItem(item),
          },
        ]);
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <div
        className={`flex items-center justify-center ${isMobile ? "w-12 h-12" : "w-14"}`}
        style={!isFolder && !isApp ? undefined : { color: getIconColor() }}
      >
        {isFolder ? (
          <MacFolder size={isMobile ? 40 : 48} />
        ) : isApp ? (
          <IconComponent size={isMobile ? 40 : 48} strokeWidth={1.5} />
        ) : (
          <div className="scale-125 origin-bottom">
            <FilePreview type={item.type} name={item.name} />
          </div>
        )}
      </div>
      <span
        className={`text-center mt-3 leading-tight px-1 break-words font-medium ${isMobile ? "text-[10px]" : "text-xs"}`}
        style={{ color: "var(--text-primary)", textShadow: "none" }}
      >
        {item.name}
      </span>
    </motion.div>
  );
}
