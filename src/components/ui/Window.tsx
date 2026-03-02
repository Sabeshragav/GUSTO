"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useDesktop } from "../../contexts/DesktopContext";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { WindowState } from "../../types";

interface WindowProps {
  window: WindowState;
  children: ReactNode;
  minWidth?: number;
  minHeight?: number;
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw" | null;

const resizeCursors: Record<string, string> = {
  n: "ns-resize",
  s: "ns-resize",
  e: "ew-resize",
  w: "ew-resize",
  ne: "nesw-resize",
  nw: "nwse-resize",
  se: "nwse-resize",
  sw: "nesw-resize",
};

export function Window({
  window: win,
  children,
  minWidth = 300,
  minHeight = 200,
}: WindowProps) {
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
  } = useDesktop();
  const { isMobile, isTouchDevice } = useIsMobile();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<ResizeDirection>(null);
  const [isClosing, setIsClosing] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    windowX: 0,
    windowY: 0,
  });
  const windowRef = useRef<HTMLDivElement>(null);

  // Track latest window state to avoid effect re-runs
  const winState = useRef(win);
  useEffect(() => {
    winState.current = win;
  });

  // Clamp window position & size to viewport on resize (e.g. exiting fullscreen
  // when the file-upload dialog opens). Without this the submit button can end
  // up below the visible area on smaller screens.
  useEffect(() => {
    if (isMobile || isTouchDevice) return;

    const clampToViewport = () => {
      const w = winState.current;
      if (w.isMaximized || w.isMinimized) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const menuBarHeight = 28;
      const dockBuffer = 80; // keep clear of the dock hover zone at the bottom

      // Ensure the window fits within the viewport —
      // shrink it first if necessary, then reposition.
      let newWidth = Math.min(w.width, vw);
      let newHeight = Math.min(w.height, vh - menuBarHeight - dockBuffer);
      let newX = w.x;
      let newY = w.y;

      // Keep the window's right/bottom edge above the dock zone
      if (newX + newWidth > vw) newX = Math.max(0, vw - newWidth);
      if (newY + newHeight > vh - dockBuffer) newY = Math.max(menuBarHeight, vh - dockBuffer - newHeight);

      // Keep top-left in view
      if (newX < 0) newX = 0;
      if (newY < menuBarHeight) newY = menuBarHeight;

      const posChanged = newX !== w.x || newY !== w.y;
      const sizeChanged = newWidth !== w.width || newHeight !== w.height;

      if (sizeChanged) resizeWindow(w.id, newWidth, newHeight);
      if (posChanged) moveWindow(w.id, newX, newY);
    };

    window.addEventListener("resize", clampToViewport);
    return () => window.removeEventListener("resize", clampToViewport);
  }, [isMobile, isTouchDevice, moveWindow, resizeWindow]);

  useEffect(() => {
    if (!isDragging) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const newX = e.clientX - dragOffset.current.x;
        const newY = Math.max(28, e.clientY - dragOffset.current.y);

        // Only dispatch if changed significantly or at all
        // (Avoiding sub-pixel thrashing if necessary, but strict equality is fine usually)
        if (newX !== winState.current.x || newY !== winState.current.y) {
          moveWindow(winState.current.id, newX, newY);
        }
      });
    };

    const handleMouseUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, moveWindow]);

  useEffect(() => {
    if (!isResizing) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const deltaX = e.clientX - resizeStart.current.x;
        const deltaY = e.clientY - resizeStart.current.y;

        let newWidth = resizeStart.current.width;
        let newHeight = resizeStart.current.height;
        let newX = resizeStart.current.windowX;
        let newY = resizeStart.current.windowY;

        if (isResizing.includes("e")) {
          newWidth = Math.max(minWidth, resizeStart.current.width + deltaX);
        }
        if (isResizing.includes("w")) {
          const widthDelta = Math.min(
            deltaX,
            resizeStart.current.width - minWidth
          );
          newWidth = resizeStart.current.width - widthDelta;
          newX = resizeStart.current.windowX + widthDelta;
        }
        if (isResizing.includes("s")) {
          newHeight = Math.max(minHeight, resizeStart.current.height + deltaY);
        }
        if (isResizing.includes("n")) {
          const heightDelta = Math.min(
            deltaY,
            resizeStart.current.height - minHeight
          );
          newHeight = resizeStart.current.height - heightDelta;
          newY = Math.max(28, resizeStart.current.windowY + heightDelta);
        }

        // Batch updates or check if needed
        const hasSizeChange =
          newWidth !== winState.current.width ||
          newHeight !== winState.current.height;

        const hasPosChange =
          newX !== winState.current.x ||
          newY !== winState.current.y;

        if (hasSizeChange) {
          resizeWindow(winState.current.id, newWidth, newHeight);
        }
        if (hasPosChange) {
          moveWindow(winState.current.id, newX, newY);
        }
      });
    };

    const handleMouseUp = () => {
      if (rafId) cancelAnimationFrame(rafId);
      setIsResizing(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, minHeight, resizeWindow, moveWindow]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".traffic-light")) return;
    
    // Only focus if not already the active window to prevent unnecessary renders
    // We check via a ref or context, but context is cleanest:
    // Actually, focusWindow updates Z-index too, so we might want to call it 
    // to bring to front even if active? 
    // Yes, but if it is already top, we might save a render.
    // simpler: allow focusWindow.
    focusWindow(win.id);
    
    if (isMobile || isTouchDevice) return;
    
    e.preventDefault(); // Prevent text selection/native drag
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    };
  };

  const handleResizeStart =
    (direction: ResizeDirection) => (e: React.MouseEvent) => {
      e.stopPropagation();
      focusWindow(win.id);
      setIsResizing(direction);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: win.width,
        height: win.height,
        windowX: win.x,
        windowY: win.y,
      };
    };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => closeWindow(win.id), 150);
  };

  if (win.isMinimized) return null;

  const mobileInset = 8;
  const mobileWindowStyle: React.CSSProperties = {
    top: 28 + mobileInset,
    left: mobileInset,
    width: `calc(100vw - ${mobileInset * 2}px)`,
    height: `calc(100vh - 28px - 60px - ${mobileInset * 2}px)`,
    zIndex: win.zIndex,
  };

  const windowStyle: React.CSSProperties = isMobile
    ? mobileWindowStyle
    : win.isMaximized
      ? {
        top: 28,
        left: 0,
        width: "100vw",
        height: "calc(100vh - 28px)",
        zIndex: win.zIndex,
      }
      : {
        top: win.y,
        left: win.x,
        width: win.width,
        height: win.height,
        zIndex: win.zIndex,
      };

  const resizeHandleClass =
    "absolute bg-transparent hover:bg-warm-500/10 transition-colors";
  const cornerHandleClass =
    "absolute bg-transparent hover:bg-warm-500/10 transition-colors z-10";

  const trafficLightSize = isMobile ? "w-4 h-4" : "w-3 h-3";
  const showResizeHandles = !win.isMaximized && !isMobile && !isTouchDevice;

  const windowContent = (
    <div
      ref={windowRef}
      className={`fixed flex flex-col overflow-hidden ${isClosing ? "animate-window-close" : "animate-window-open"
        }`}
      style={{
        ...windowStyle,
        borderRadius: "var(--window-radius)",
        border: "2px solid var(--border-color)",
        boxShadow: "var(--shadow-window)",
        backgroundColor: "var(--surface-bg)",
      }}
      onClick={() => focusWindow(win.id)}
    >
      {/* Window Header */}
      <div
        className={`window-header relative flex items-center justify-center cursor-grab active:cursor-grabbing flex-shrink-0 select-none ${isMobile ? "h-10 px-2" : "h-10 px-2"
          }`}
        style={{
          backgroundColor: "var(--surface-primary)",
          borderBottom: "2px solid var(--border-color)",
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Window Controls (Mac Style - Left) */}
        <div className="absolute left-3 flex items-center gap-2 group traffic-light z-10">
          <button
            className="flex items-center justify-center w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] active:shade-10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            title="Close"
          >
            <svg
              className="w-2 h-2 text-[#4D0000] opacity-0 group-hover:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <button
            className="flex items-center justify-center w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] active:shade-10 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(win.id);
            }}
            title="Minimize"
          >
            <svg
              className="w-2 h-2 text-[#995700] opacity-0 group-hover:opacity-100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>

          {!isMobile && (
            <button
              className="flex items-center justify-center w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] active:shade-10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                maximizeWindow(win.id);
              }}
              title={win.isMaximized ? "Restore" : "Maximize"}
            >
              <svg
                className="w-1.5 h-1.5 text-[#006500] opacity-0 group-hover:opacity-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          )}
        </div>

        {/* Title (Centered) */}
        <div className="flex items-center gap-2">
          {/* Optional: Add app icon here if available in window state */}
          <span
            className="font-bold text-sm tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {win.title}
          </span>
        </div>
      </div>

      {/* Window Content */}
      <div
        className="flex-1 overflow-hidden relative"
        style={{ backgroundColor: "var(--surface-bg)" }}
      >
        {children}
      </div>

      {/* Resize Handles */}
      {showResizeHandles && (
        <>
          {/* Edge handles — offset to avoid overlapping corner areas */}
          <div
            className={`${resizeHandleClass} top-0 left-5 right-5 h-2 cursor-n-resize`}
            onMouseDown={handleResizeStart("n")}
          />
          <div
            className={`${resizeHandleClass} bottom-0 left-5 right-5 h-2 cursor-s-resize`}
            onMouseDown={handleResizeStart("s")}
          />
          <div
            className={`${resizeHandleClass} left-0 top-5 bottom-5 w-2 cursor-w-resize`}
            onMouseDown={handleResizeStart("w")}
          />
          <div
            className={`${resizeHandleClass} right-0 top-5 bottom-5 w-2 cursor-e-resize`}
            onMouseDown={handleResizeStart("e")}
          />
          {/* Corner handles — larger hit area + higher z-index */}
          <div
            className={`${cornerHandleClass} top-0 left-0 w-5 h-5 cursor-nw-resize rounded-tl-xl`}
            onMouseDown={handleResizeStart("nw")}
          />
          <div
            className={`${cornerHandleClass} top-0 right-0 w-5 h-5 cursor-ne-resize rounded-tr-xl`}
            onMouseDown={handleResizeStart("ne")}
          />
          <div
            className={`${cornerHandleClass} bottom-0 left-0 w-5 h-5 cursor-sw-resize rounded-bl-xl`}
            onMouseDown={handleResizeStart("sw")}
          />
          <div
            className={`${cornerHandleClass} bottom-0 right-0 w-5 h-5 cursor-se-resize rounded-br-xl`}
            onMouseDown={handleResizeStart("se")}
          />
        </>
      )}
    </div>
  );

  // Full-screen overlay during drag/resize so the cursor is tracked outside the window
  const overlayActive = isDragging || isResizing;
  const overlayCursor = isDragging
    ? "grabbing"
    : isResizing
      ? resizeCursors[isResizing] || "default"
      : "default";

  return createPortal(
    <>
      {overlayActive && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            cursor: overlayCursor,
          }}
        />
      )}
      {windowContent}
    </>,
    document.body,
  );
}
