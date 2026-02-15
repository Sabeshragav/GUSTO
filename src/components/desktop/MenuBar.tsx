import { useState, useEffect, useRef } from 'react';
import { Wifi, BatteryMedium, Moon, Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useDesktop } from '../../contexts/DesktopContext';
import { useAchievements } from '../../contexts/AchievementsContext';
import { useIsMobile } from '../../hooks/useIsMobile';
import { ControlCenter } from '../system/ControlCenter';
import { Spotlight } from '../system/Spotlight';

export function MenuBar() {
  const { getActiveWindow, openApp } = useDesktop();
  const { resetAchievements } = useAchievements();
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());
  
  // Menu States
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showWifiMenu, setShowWifiMenu] = useState(false);
  const [showBatteryMenu, setShowBatteryMenu] = useState(false);
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  
  const [, setLogoClickCount] = useState(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);
  const controlCenterRef = useRef<HTMLButtonElement>(null);

  // Fix hydration mismatch for time/date
  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowAppleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cmd+K for Spotlight
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setShowSpotlight(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogoClick = () => {
    setShowAppleMenu((prev) => !prev);
  };

  const activeWindow = getActiveWindow();
  const activeAppName = activeWindow?.title || 'Finder';

  const formatDateTime = (date: Date) => {
    // Format: Thu 12 Feb 1:34 AM
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dayName} ${dayNum} ${month} ${timeStr}`;
  };

  return (
    <>
      <div className="menu-bar fixed top-0 left-0 right-0 h-7 flex items-center justify-between z-[9999] px-2 md:px-4 text-xs md:text-sm select-none">
        <div className="flex items-center gap-2 md:gap-5" ref={menuRef}>
          <div className="relative">
            <button
              className="font-semibold transition-colors hover:text-[var(--ph-orange)]"
              style={{ color: 'var(--text-primary)' }}
              onClick={handleLogoClick}
            >
              <span className="md:hidden">Gusto</span>
              <span className="hidden md:inline">Gusto OS</span>
            </button>
            
            {/* Apple Menu Dropdown */}
            {showAppleMenu && (
              <div className="absolute top-full left-0 mt-1 w-56 rounded border-2 border-[var(--border-color)] bg-[var(--surface-primary)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden animate-slide-down">
                <div className="py-1">
                  <button className="w-full px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--ph-orange)] hover:text-white transition-colors">
                    About Gusto OS
                  </button>
                  <div className="h-0.5 bg-[var(--border-color)] my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--ph-orange)] hover:text-white transition-colors"
                    onClick={() => {
                      openApp('systemPreferences');
                      setShowAppleMenu(false);
                    }}
                  >
                    System Preferences...
                  </button>
                  <div className="h-0.5 bg-[var(--border-color)] my-1" />
                  <button
                    className="w-full px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--ph-orange)] hover:text-white transition-colors"
                    onClick={() => {
                      setShowRestartConfirm(true);
                      setShowAppleMenu(false);
                    }}
                  >
                    Restart...
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="font-bold hidden md:inline-block" style={{ color: 'var(--text-primary)' }}>
            {activeAppName}
          </span>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3 md:gap-4 text-[var(--text-primary)]">
          {/* Do Not Disturb (Moon) - Placeholder for now, maybe toggle DND state later */}
          <button className="hover:bg-white/10 p-0.5 rounded">
             <Moon size={16} strokeWidth={2} />
          </button>
          
          {/* Wifi */}
          <div className="relative">
             <button 
               className={`hover:bg-white/10 p-0.5 rounded ${showWifiMenu ? 'bg-white/10' : ''}`}
               onClick={() => {
                 setShowWifiMenu(!showWifiMenu);
                 setShowBatteryMenu(false);
                 setShowControlCenter(false);
               }}
             >
                <Wifi size={16} strokeWidth={2} />
             </button>
             {/* Simple Wifi Dropdown */}
             {showWifiMenu && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--surface-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-xl p-2 z-[10000]">
                  <div className="text-xs font-bold text-[var(--text-secondary)] px-2 mb-1">Wi-Fi</div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[var(--ph-orange)] hover:text-white cursor-pointer bg-[var(--surface-secondary)]">
                     <Wifi size={14} />
                     <span className="font-medium">Gusto Network</span>
                     <span className="ml-auto text-[10px] opacity-70">Connected</span>
                  </div>
                  <div className="h-px bg-[var(--border-color)] my-1" />
                  <div className="text-[10px] px-2 text-[var(--text-tertiary)]">Wi-Fi Settings...</div>
               </div>
             )}
          </div>

          {/* Battery */}
          <div className="relative">
             <button 
                className={`hover:bg-white/10 p-0.5 rounded ${showBatteryMenu ? 'bg-white/10' : ''}`}
                onClick={() => {
                   setShowBatteryMenu(!showBatteryMenu);
                   setShowWifiMenu(false);
                   setShowControlCenter(false);
                }}
             >
                <BatteryMedium size={18} strokeWidth={2} className="opacity-90" />
             </button>
             {/* Simple Battery Dropdown */}
             {showBatteryMenu && (
               <div className="absolute top-full right-0 mt-2 w-48 bg-[var(--surface-primary)] border-2 border-[var(--border-color)] rounded-lg shadow-xl p-2 z-[10000]">
                  <div className="text-xs font-bold text-[var(--text-secondary)] px-2 mb-1">Battery</div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-primary)]">
                     <span className="font-medium">Power Source: Battery</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded text-[var(--text-primary)]">
                     <span className="font-medium">Level: 100%</span>
                  </div>
               </div>
             )}
          </div>

          {/* Search */}
          <button 
            className="hover:bg-white/10 p-0.5 rounded hidden sm:block"
            onClick={() => setShowSpotlight(true)}
          >
             <Search size={15} strokeWidth={2.5} />
          </button>

          {/* Control Center (Toggles) */}
          <button 
             ref={controlCenterRef}
             className={`hover:bg-white/10 p-0.5 rounded ${showControlCenter ? 'bg-white/10' : ''}`}
             onClick={() => {
                setShowControlCenter(!showControlCenter);
                setShowWifiMenu(false);
                setShowBatteryMenu(false);
             }}
          >
             <SlidersHorizontal size={15} strokeWidth={2.5} />
          </button>

          {/* Date & Time */}
          <div className="font-medium min-w-[140px] text-right">
            {mounted ? formatDateTime(time) : ''}
          </div>
        </div>

        {/* Restart Confirm Modal */}
        {showRestartConfirm && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[10000] backdrop-blur-sm">
            <div className="bg-[var(--surface-bg)] rounded p-5 max-w-sm mx-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-2 border-[var(--border-color)]">
               <div className="flex items-start gap-3 mb-3">
                 <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
                   <RotateCcw size={24} className="text-[var(--ph-orange)]" />
                 </div>
                 <div>
                   <h3 className="text-[var(--text-primary)] font-bold text-lg">Restart Gusto OS?</h3>
                   <p className="text-[var(--text-secondary)] text-sm mt-1">All achievements and progress will be reset.</p>
                 </div>
               </div>
               <div className="flex justify-end gap-2 mt-6">
                 <button
                   className="px-4 py-2 text-sm text-[var(--text-primary)] font-bold border-2 border-transparent hover:border-[var(--border-color)] hover:bg-[var(--surface-secondary)] transition-all"
                   onClick={() => setShowRestartConfirm(false)}
                 >
                   Cancel
                 </button>
                 <button
                   className="px-4 py-2 text-sm bg-[var(--ph-orange)] text-white font-bold border-2 border-[var(--ph-black)] hover:bg-[var(--ph-orange)]/90 shadow-[2px_2px_0px_0px_var(--ph-black)] active:translate-y-[1px] active:shadow-none transition-all"
                   onClick={() => {
                     resetAchievements();
                     setShowRestartConfirm(false);
                   }}
                 >
                   Restart
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>

      <ControlCenter 
         isOpen={showControlCenter} 
         onClose={() => setShowControlCenter(false)} 
         toggleRef={controlCenterRef}
      />

      <Spotlight
         isOpen={showSpotlight}
         onClose={() => setShowSpotlight(false)}
      />
    </>
  );
}
