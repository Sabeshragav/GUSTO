import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { LucideIcon } from 'lucide-react';

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
  submenu?: ContextMenuItem[];
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Adjust position to keep menu on screen
  const menuWidth = 200;
  const menuHeight = items.length * 32; // Approx height
  const adjustedX = x + menuWidth > window.innerWidth ? x - menuWidth : x;
  const adjustedY = y + menuHeight > window.innerHeight ? y - menuHeight : y;

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 min-w-[180px] bg-[var(--surface-elevated)]/90 backdrop-blur-md border border-[var(--border-color)] rounded-lg shadow-xl py-1"
        style={{ left: adjustedX, top: adjustedY }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {items.map((item, index) => {
          if (item.separator) {
            return <div key={index} className="h-[1px] bg-[var(--border-color)] my-1" />;
          }

          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 transition-colors
                ${item.danger 
                  ? 'text-red-400 hover:bg-red-500/10' 
                  : 'text-[var(--text-primary)] hover:bg-white/10'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              onClick={() => {
                if (!item.disabled && item.action) {
                  item.action();
                  onClose();
                }
              }}
              disabled={item.disabled}
            >
              {Icon && <Icon size={14} />}
              <span>{item.label}</span>
            </button>
          );
        })}
      </motion.div>
    </AnimatePresence>
  );
}
