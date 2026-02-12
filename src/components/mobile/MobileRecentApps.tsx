"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getIOSIcon } from "../../data/iosIcons";
import type { MobileApp } from "./MobileAppDrawer";

interface MobileRecentAppsProps {
  isOpen: boolean;
  onClose: () => void;
  recentApps: string[];
  allApps: MobileApp[];
  onAppOpen: (appId: string) => void;
  onRemoveRecent: (appId: string) => void;
  onClearAll: () => void;
}

/** Individual recent app card with swipe-up-to-dismiss */
function RecentCard({
  app,
  index,
  onOpen,
  onClose,
  onRemove,
}: {
  app: MobileApp;
  index: number;
  onOpen: (id: string) => void;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const touchStartY = useRef(0);
  const iconUrl = getIOSIcon(app.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: -200, scale: 0.6 }}
      transition={{
        type: "spring",
        stiffness: 350,
        damping: 30,
        delay: index * 0.05,
      }}
      className="shrink-0 w-[260px] snap-center"
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchEnd={(e) => {
        const deltaY = touchStartY.current - e.changedTouches[0].clientY;
        if (deltaY > 80) {
          onRemove(app.id);
        }
      }}
    >
      <div className="relative bg-[#1c1c2e]/90 rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
        {/* Dismiss button */}
        <button
          onClick={() => onRemove(app.id)}
          className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white/60 active:text-white active:bg-white/20 transition-colors"
        >
          <X size={12} />
        </button>

        {/* Card preview — tap to reopen */}
        <button
          onClick={() => {
            onOpen(app.id);
            onClose();
          }}
          className="w-full active:bg-white/5 transition-colors"
        >
          {/* Fake app content preview area */}
          <div className="h-40 bg-[var(--surface-bg)]/30 flex items-center justify-center">
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={app.name}
                className="w-16 h-16 rounded-[22%] opacity-60"
                draggable={false}
              />
            ) : (
              <div className="w-16 h-16 rounded-[22%] bg-white/10 flex items-center justify-center">
                <span className="text-white/40 text-2xl font-bold">
                  {app.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* App label */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-[22%] overflow-hidden shrink-0">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center">
                  <span className="text-white/60 text-xs font-bold">
                    {app.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-white/80 text-sm font-medium">
              {app.name}
            </span>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

export function MobileRecentApps({
  isOpen,
  onClose,
  recentApps,
  allApps,
  onAppOpen,
  onRemoveRecent,
  onClearAll,
}: MobileRecentAppsProps) {
  const apps = recentApps
    .map((id) => allApps.find((a) => a.id === id))
    .filter(Boolean) as MobileApp[];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Content area */}
          <div
            className="absolute inset-x-0 top-12 bottom-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {apps.length === 0 ? (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <p className="text-white/40 text-sm font-medium">
                  No recent apps
                </p>
              </div>
            ) : (
              <>
                {/* Horizontally scrolling card stack — iOS style */}
                <div className="flex-1 flex items-center">
                  <div className="w-full overflow-x-auto overflow-y-hidden px-8 py-4 flex gap-5 snap-x snap-mandatory scrollbar-hide">
                    {apps.map((app, index) => (
                      <RecentCard
                        key={app.id}
                        app={app}
                        index={index}
                        onOpen={onAppOpen}
                        onClose={onClose}
                        onRemove={onRemoveRecent}
                      />
                    ))}
                  </div>
                </div>

                {/* Clear All button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex justify-center pb-4 pt-2"
                >
                  <button
                    onClick={() => {
                      onClearAll();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 active:bg-white/20 transition-colors"
                  >
                    <X size={14} className="text-white/60" />
                    <span className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                      Clear All
                    </span>
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
