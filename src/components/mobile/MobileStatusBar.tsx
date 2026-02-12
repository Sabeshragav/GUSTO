"use client";

import { useState, useEffect } from "react";
import { Wifi, BatteryFull, Signal } from "lucide-react";

export function MobileStatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 z-[100] flex items-center justify-between px-4 bg-black/30 backdrop-blur-md text-white text-xs font-medium">
      <span className="tracking-wide">{time}</span>
      <div className="flex items-center gap-1.5">
        <Signal size={13} strokeWidth={2.5} />
        <Wifi size={13} strokeWidth={2.5} />
        <BatteryFull size={15} strokeWidth={2} />
      </div>
    </div>
  );
}
