'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, File, Folder, AppWindow } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktop } from '../../contexts/DesktopContext';
import { fileSystem } from '../../data/filesystem';

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { openApp, openFile } = useDesktop();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
    }
  }, [isOpen]);

  const apps = [
    { id: 'finder', name: 'Finder', icon: Folder, type: 'app' },
    { id: 'calendar', name: 'Calendar', icon: AppWindow, type: 'app' },
    { id: 'systemPreferences', name: 'System Preferences', icon: AppWindow, type: 'app' },
    { id: 'terminal', name: 'Terminal', icon: AppWindow, type: 'app' },
  ];

  const filteredItems = query 
    ? [...apps.filter(app => app.name.toLowerCase().includes(query.toLowerCase()))]
    : [];

  const handleResultClick = (item: any) => {
    if (item.type === 'app') {
       openApp(item.id);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[10000]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[10001] px-4"
          >
            <div className="bg-[var(--surface-primary)] border-2 border-[var(--border-color)] rounded-xl shadow-[0px_20px_40px_rgba(0,0,0,0.3)] overflow-hidden">
               <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
                  <Search size={20} className="text-[var(--text-secondary)]" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Spotlight Search"
                    className="flex-1 bg-transparent border-none outline-none text-xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
                  />
               </div>
               
               {query && filteredItems.length > 0 && (
                 <div className="max-h-[300px] overflow-y-auto py-2">
                    {filteredItems.map((item) => (
                       <button
                         key={item.id}
                         onClick={() => handleResultClick(item)}
                         className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[var(--ph-orange)] hover:text-white transition-colors text-[var(--text-primary)] text-left group"
                       >
                          <item.icon size={16} />
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-xs ml-auto opacity-50 group-hover:text-white">Application</span>
                       </button>
                    ))}
                 </div>
               )}

               {query && filteredItems.length === 0 && (
                  <div className="px-4 py-8 text-center text-[var(--text-secondary)] text-sm">
                     No results found for &quot;{query}&quot;
                  </div>
               )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
