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
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md"
          onClick={onClose}
        >
          {/* Content area */}
          <div
            className="absolute inset-x-0 top-10 bottom-12 flex flex-col"
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
                {/* Scrollable stacked cards */}
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-4 flex flex-col items-center gap-4">
                  {apps.map((app, index) => (
                    <motion.div
                      key={app.id}
                      initial={{ opacity: 0, y: 40, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -200 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                      className="w-full max-w-[320px] shrink-0"
                    >
                      <div className="relative bg-[#1a1a2e]/90 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                        {/* Dismiss button */}
                        <button
                          onClick={() => onRemoveRecent(app.id)}
                          className="absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/50 active:text-white active:bg-white/20 transition-colors"
                        >
                          <X size={12} />
                        </button>

                        {/* Card preview — tap to reopen */}
                        <button
                          onClick={() => {
                            onAppOpen(app.id);
                            onClose();
                          }}
                          className="w-full active:bg-white/5 transition-colors"
                        >
                          {/* Fake app content preview area */}
                          <div className="h-36 bg-[var(--surface-bg)]/40 flex items-center justify-center border-b border-white/5">
                            <ThemedIcon
                              name={app.icon}
                              className="w-12 h-12 text-[var(--ph-orange)]/40"
                            />
                          </div>

                          {/* App label */}
                          <div className="flex items-center gap-3 px-4 py-3">
                            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                              <ThemedIcon
                                name={app.icon}
                                className="w-4 h-4 text-[var(--ph-orange)]"
                              />
                            </div>
                            <span className="text-white/80 text-sm font-medium">
                              {app.name}
                            </span>
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Clear All button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex justify-center pb-3 pt-2"
                >
                  <button
                    onClick={() => {
                      onClearAll();
                      onClose();
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 active:bg-white/20 transition-colors"
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
