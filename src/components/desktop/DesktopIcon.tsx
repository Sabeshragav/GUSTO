"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useDesktop } from "../../contexts/DesktopContext";
import type { DesktopItem } from "../../types";
import { findFileById } from "../../data/filesystem";
import { MacFolder } from "../ui/icons/MacFolder";
import { ThemedIcon } from "../ui/ThemedIcon";
import { getAppColor } from "../../data/appColors";
import { getMacIcon, getMacFolderIcon } from "../../data/macIcons";

interface DesktopIconProps {
  item: DesktopItem;
}

import { FilePreview } from "../ui/FilePreview";

export function DesktopIcon({ item }: DesktopIconProps) {
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
    // Open immediately on single click as requested
    handleDoubleClick();
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
    if (element) {
      element.addEventListener("dragstart", handleDragStart);
      return () => {
        element.removeEventListener("dragstart", handleDragStart);
      };
    }
  }, [item.id]);

  const triggerJiggle = () => {
    setIsJiggling(true);
    setTimeout(() => setIsJiggling(false), 300);
  };

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

  const positionStyle: React.CSSProperties = { position: "absolute", left: item.x, top: item.y };

  const isFolder = item.type === "folder" || item.icon === "folder";
  const isApp = item.type === "app";

  return (
    <motion.div
      ref={ref}
      className={`desktop-icon flex flex-col items-center justify-center p-2 cursor-pointer w-24 ${isSelected ? "bg-black/5 border border-[var(--border-color)]" : ""} ${isJiggling ? "animate-icon-jiggle" : ""}`}
      style={{
        ...positionStyle,
        borderRadius: "4px",
      }}
      onClick={handleClick}
      draggable={true}
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
        className="flex items-center justify-center w-14"
        style={!isFolder && !isApp ? undefined : { color: getIconColor() }}
      >
        {isFolder ? (
          <img
            src={getMacFolderIcon()}
            alt={item.name}
            className="w-14 h-14 object-contain pointer-events-none"
            draggable={false}
          />
        ) : isApp ? (
          (() => {
            const macSrc = getMacIcon(
              item.appId || item.id,
              item.icon === "trash" && state.trashedItems.length > 0,
            );
            return macSrc ? (
              <img
                src={macSrc}
                alt={item.name}
                className="w-14 h-14 object-contain pointer-events-none"
                draggable={false}
              />
            ) : (
              <ThemedIcon
                name={item.icon}
                size={48}
                style={{ color: getIconColor() }}
              />
            );
          })()
        ) : (
          <div className="scale-125 origin-bottom">
            <FilePreview type={item.type} name={item.name} />
          </div>
        )}
      </div>
      <span
        className="text-center mt-3 leading-tight px-1 break-words font-medium text-xs"
        style={{ color: "var(--text-primary)", textShadow: "none" }}
      >
        {item.name}
      </span>
    </motion.div>
  );
}
