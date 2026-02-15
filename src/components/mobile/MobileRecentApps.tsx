"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
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
  renderApp: (appId: string) => React.ReactNode;
}

function RecentCard({
  app,
  index,
  onOpen,
  onClose,
  onRemove,
  renderApp,
}: {
  app: MobileApp;
  index: number;
  onOpen: (id: string) => void;
  onClose: () => void;
  onRemove: (id: string) => void;
  renderApp: (appId: string) => React.ReactNode;
}) {
  const iconUrl = getIOSIcon(app.id);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, y: -200, scale: 0.5 }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.7, bottom: 0.1 }}
      onDragEnd={(_, info) => {
        if (info.offset.y < -100) onRemove(app.id);
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: index * 0.05,
      }}
      className="shrink-0 w-[260px] snap-center"
    >
      <div className="relative bg-[#1c1c2e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/40">
        {/* Dismiss button */}
        <button
          onClick={() => onRemove(app.id)}
          className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/70 active:text-white transition-colors"
        >
          <X size={12} />
        </button>

        {/* Card body — tap to reopen */}
        <div
          onClick={() => {
            onOpen(app.id);
            onClose();
          }}
          className="w-full block cursor-pointer"
          role="button"
          tabIndex={0}
        >
          {/* Live mini-preview of the app */}
          <div className="relative w-full h-[280px] overflow-hidden bg-[var(--surface-bg)]">
            {/* 
              Render the actual app at full size inside a container,
              then scale it down with CSS transform.
              pointer-events: none ensures it's non-interactive. 
            */}
            <div
              className="absolute top-0 left-0 origin-top-left pointer-events-none select-none"
              style={{
                width: "375px",
                height: "800px",
                transform: "scale(0.693)" /* 260px / 375px ≈ 0.693 */,
              }}
            >
              <div className="w-full h-full overflow-hidden">
                {renderApp(app.id)}
              </div>
            </div>
          </div>

          {/* App label bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#1c1c2e] border-t border-white/5">
            <div className="w-7 h-7 rounded-[22%] overflow-hidden shrink-0 relative">
              {iconUrl ? (
                <Image
                  src={iconUrl}
                  alt=""
                  width={28}
                  height={28}
                  className="object-cover w-full h-full"
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
            <span className="text-white/80 text-sm font-semibold">
              {app.name}
            </span>
          </div>
        </div>
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
  renderApp,
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
          <div
            className="absolute inset-x-0 top-12 bottom-10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {apps.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-white/40 text-sm font-medium">
                  No recent apps
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center">
                  <div className="w-full overflow-x-auto overflow-y-hidden px-8 py-4 flex gap-5 snap-x snap-mandatory scrollbar-hide">
                    {apps.map((app, i) => (
                      <RecentCard
                        key={app.id}
                        app={app}
                        index={i}
                        onOpen={onAppOpen}
                        onClose={onClose}
                        onRemove={onRemoveRecent}
                        renderApp={renderApp}
                      />
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="flex justify-center pb-4 pt-2"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearAll();
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-full bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white/90 active:bg-white/20 transition-colors"
                  >
                    Clear All
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
