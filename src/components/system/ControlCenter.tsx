'use client';

import { useState } from 'react';
import { 
  Wifi, Bluetooth, Signal, Moon, 
  Sun, Volume2, Music, Monitor, MonitorSmartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<HTMLButtonElement>;
}

export function ControlCenter({ isOpen, onClose, toggleRef }: ControlCenterProps) {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airdrop, setAirdrop] = useState(true);
  const [dnd, setDnd] = useState(false);
  
  const [brightness, setBrightness] = useState(80);
  const [volume, setVolume] = useState(65);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-9 right-2 md:right-4 w-80 bg-[var(--surface-primary)] border-2 border-[var(--border-color)] rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] p-3 z-[9999] text-[var(--text-primary)]"
          >
            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Connectivity Block */}
              <div className="bg-[var(--surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] flex flex-col justify-between gap-2">
                <div className="flex flex-col gap-3">
                   <ControlToggle 
                      icon={Wifi} 
                      label="Wi-Fi" 
                      active={wifi} 
                      onClick={() => setWifi(!wifi)} 
                      subLabel={wifi ? "Gusto Network" : "Off"}
                   />
                   <ControlToggle 
                      icon={Bluetooth} 
                      label="Bluetooth" 
                      active={bluetooth} 
                      onClick={() => setBluetooth(!bluetooth)}
                      subLabel={bluetooth ? "On" : "Off"}
                   />
                   <ControlToggle 
                      icon={Signal} 
                      label="AirDrop" 
                      active={airdrop} 
                      onClick={() => setAirdrop(!airdrop)}
                      subLabel={airdrop ? "Contacts Only" : "Off"}
                   />
                </div>
              </div>

              {/* DND & Other Toggles */}
              <div className="grid grid-rows-2 gap-3">
                <div className="bg-[var(--surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] flex items-center gap-3" onClick={() => setDnd(!dnd)}>
                   <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${dnd ? 'bg-[#5e5ce6] text-white' : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'}`}>
                      <Moon size={16} fill={dnd ? "currentColor" : "none"} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-semibold">Do Not Disturb</span>
                      <span className="text-[10px] text-[var(--text-secondary)]">{dnd ? "On" : "Off"}</span>
                   </div>
                </div>

                <div className="bg-[var(--surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center">
                      <MonitorSmartphone size={16} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-xs font-semibold">Screen Mirroring</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="bg-[var(--surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] mb-3 flex flex-col gap-4">
               <div className="relative h-6 w-full group">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                     <Sun size={14} className="text-[var(--text-secondary)]" />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value))}
                    className="w-full h-full appearance-none bg-[var(--surface-tertiary)] rounded-full overflow-hidden cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0"
                    style={{
                       backgroundImage: `linear-gradient(to right, white ${brightness}%, var(--surface-tertiary) ${brightness}%)`
                    }}
                  />
               </div>

               <div className="relative h-6 w-full group">
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                     <Volume2 size={14} className="text-[var(--text-secondary)]" />
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-full appearance-none bg-[var(--surface-tertiary)] rounded-full overflow-hidden cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:h-0"
                    style={{
                       backgroundImage: `linear-gradient(to right, white ${volume}%, var(--surface-tertiary) ${volume}%)`
                    }}
                  />
               </div>
            </div>

            {/* Media */}
            <div className="bg-[var(--surface-secondary)] rounded-lg p-3 border border-[var(--border-color)] flex items-center gap-3">
               <div className="w-10 h-10 bg-[var(--ph-orange)] rounded flex items-center justify-center flex-shrink-0">
                  <Music size={20} className="text-white" />
               </div>
               <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold truncate">Gusto FM</span>
                  <span className="text-[10px] text-[var(--text-secondary)] truncate">Not Playing</span>
               </div>
               <div className="ml-auto">
                  <Monitor size={16} className="text-[var(--text-secondary)]" />
               </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ControlToggle({ icon: Icon, label, active, onClick, subLabel }: any) {
   return (
      <div className="flex items-center gap-3 cursor-pointer group" onClick={onClick}>
         <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-[#007AFF] text-white' : 'bg-[var(--surface-tertiary)] text-[var(--text-primary)]'}`}>
            <Icon size={14} />
         </div>
         <div className="flex flex-col">
            <span className="text-xs font-semibold">{label}</span>
            {subLabel && <span className="text-[9px] text-[var(--text-secondary)]">{subLabel}</span>}
         </div>
      </div>
   );
}
