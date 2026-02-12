"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ThemedIcon } from "../ui/ThemedIcon";
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
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex flex-col"
          onClick={onClose}
        >
          {/* Content area */}
          <div
            className="flex-1 flex flex-col justify-center overflow-hidden py-10"
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
                {/* Horizontal Scrollable Stack */}
                <div className="flex-1 w-full overflow-x-auto overflow-y-hidden flex items-center px-8 gap-4 snap-x snap-mandatory scrollbar-none">
                  {/* Padding to center first item */}
                  <div className="w-4 shrink-0" />

                  {apps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, scale: 0.8, y: 50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 50 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="w-[70vw] max-w-[280px] aspect-[9/16] shrink-0 snap-center relative flex flex-col"
                    >
                      <div className="relative flex-1 bg-[#1a1a2e] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                        {/* Header Bar */}
                        <div className="px-4 py-3 flex items-center justify-between border-b border-white/5 bg-white/5">
                          <div className="flex items-center gap-2">
                            <ThemedIcon name={app.icon} className="w-5 h-5 text-white/80" />
                            <span className="text-xs font-bold text-white/90">{app.name}</span>
                          </div>
                          {/* Close Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveRecent(app.id);
                            }}
                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 active:scale-90 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>

                        {/* App Preview Body (Click to Open) */}
                        <button
                          onClick={() => {
                            onAppOpen(app.id);
                            onClose();
                          }}
                          className="flex-1 w-full bg-[var(--surface-bg)]/80 flex flex-col items-center justify-center hover:bg-[var(--surface-bg)] transition-colors group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-4 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-shadow duration-500"
                          >
                            <ThemedIcon
                              name={app.icon}
                              className="w-10 h-10 text-[var(--accent-color)] opacity-80"
                            />
                          </motion.div>
                          <span className="text-xs text-white/40 font-medium tracking-wider uppercase">Tap to Resume</span>
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  {/* Padding to center last item */}
                  <div className="w-4 shrink-0" />
                </div>

                {/* Clear All button - Floating at bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute bottom-20 left-0 right-0 flex justify-center pointer-events-none"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAll();
                      onClose();
                    }}
                    className="pointer-events-auto flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all shadow-lg"
                  >
                    <span className="text-white/90 text-xs font-bold uppercase tracking-wider">
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
