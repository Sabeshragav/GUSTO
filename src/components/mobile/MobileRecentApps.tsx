"use client";

import { X } from "lucide-react";
import type { MobileApp } from "./MobileAppDrawer";

interface MobileRecentAppsProps {
  isOpen: boolean;
  onClose: () => void;
  recentApps: string[];
  allApps: MobileApp[];
  onAppOpen: (appId: string) => void;
  onRemoveRecent: (appId: string) => void;
}

export function MobileRecentApps({
  isOpen,
  onClose,
  recentApps,
  allApps,
  onAppOpen,
  onRemoveRecent,
}: MobileRecentAppsProps) {
  if (!isOpen) return null;

  const apps = recentApps
    .map((id) => allApps.find((a) => a.id === id))
    .filter(Boolean) as MobileApp[];

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="absolute inset-x-0 bottom-14 top-12 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {apps.length === 0 ? (
          <p className="text-white/40 text-sm font-medium">No recent apps</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x snap-mandatory w-full justify-center">
            {apps.map((app) => (
              <div key={app.id} className="flex-shrink-0 w-52 snap-center">
                <div className="relative bg-[#1a1a2e]/90 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecent(app.id);
                    }}
                    className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                  >
                    <X size={12} />
                  </button>

                  {/* Card body */}
                  <button
                    onClick={() => {
                      onAppOpen(app.id);
                      onClose();
                    }}
                    className="w-full p-6 flex flex-col items-center gap-3 active:bg-white/5 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
                      <span className="text-[var(--ph-orange)] text-2xl font-bold">
                        {app.name.charAt(0)}
                      </span>
                    </div>
                    <span className="text-white/80 text-sm font-medium">
                      {app.name}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
