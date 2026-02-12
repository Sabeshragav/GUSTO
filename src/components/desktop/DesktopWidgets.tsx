'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesktop } from '../../contexts/DesktopContext';
import { useIsMobile } from '../../hooks/useIsMobile';

export function DesktopWidgets() {
  const { state } = useDesktop();
  const { isMobile } = useIsMobile();
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  // Determine text color based on wallpaper/theme
  const isDarkWallpaper = state.theme.id.includes('dark') || state.wallpaper.id.includes('midnight') || state.wallpaper.id.includes('slate');
  const textColor = isDarkWallpaper ? 'text-white/80' : 'text-black/60';
  const shadowClass = isDarkWallpaper ? 'drop-shadow-md' : 'drop-shadow-sm';

  if (!mounted || !time) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden z-0`}>
      {/* Clock Widget - Top Right or Top Center-ish */}
      <div className={`absolute ${isMobile ? 'top-12 right-4' : 'top-16 right-8'} flex flex-col items-end ${textColor} ${shadowClass} z-10`}>
        <motion.h1 
          className={`font-mono font-bold leading-none tracking-tight ${isMobile ? 'text-3xl' : 'text-7xl'}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {formatTime(time)}
        </motion.h1>
        <motion.p 
          className={`font-medium mt-1 ${isMobile ? 'text-xs' : 'text-xl'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {formatDate(time)}
        </motion.p>
      </div>

      {/* Brand Widget - Massive, Center/Background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-70"> {/* Low opacity so icons are readable */}
         <div className="flex overflow-hidden">
            {Array.from("GUSTO").map((letter, index) => (
              <motion.span
                key={index}
                className={`font-black tracking-tighter ${textColor}`}
                style={{ 
                  fontSize: isMobile ? '5rem' : '18rem',
                  lineHeight: 0.8,
                  opacity: 0.1 // Very subtle watermark effect
                }}
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 0.1 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
                whileHover={{ 
                    y: -20, 
                    opacity: 0.3,
                    transition: { duration: 0.3 }
                }}
              >
                {letter}
              </motion.span>
            ))}
         </div>
         <motion.div
            className={`text-xl font-bold tracking-[0.5em] mt-4 uppercase ${textColor}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ delay: 1.5, duration: 2 }}
         >
            2026
         </motion.div>
      </div>
    </div>
  );
}
