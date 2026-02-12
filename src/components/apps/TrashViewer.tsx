'use client';

import { Trash2, RotateCcw, FileText, X } from 'lucide-react';
import { useState } from 'react';
import { useDesktop, protectedTrashFiles } from '../../contexts/DesktopContext';
import { useAchievements } from '../../contexts/AchievementsContext';

export function TrashViewer() {
  const { state, restoreFromTrash } = useDesktop();
  const { markTrashFileClicked } = useAchievements();
  const [denyMessage, setDenyMessage] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    const message = protectedTrashFiles[itemId];
    if (message) {
      setDenyMessage(message);
      markTrashFileClicked(itemId);
    }
  };

  const isProtected = (itemId: string) => itemId in protectedTrashFiles;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center px-4 py-2 border-b border-warm-800/30 bg-desktop-surface/50">
        <span className="text-sm text-warm-400">
          {state.trashedItems.length} {state.trashedItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {state.trashedItems.length > 0 ? (
          <div className="grid grid-cols-4 gap-4">
            {state.trashedItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center p-3 rounded-lg hover:bg-warm-700/20 group cursor-pointer"
                onDoubleClick={() => handleItemClick(item.id)}
              >
                <div className="relative">
                  <FileText size={48} className="text-warm-500" strokeWidth={1.5} />
                  {!isProtected(item.id) && (
                    <button
                      className="absolute -top-1 -right-1 p-1 bg-warm-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => restoreFromTrash(item.id)}
                      title="Restore"
                    >
                      <RotateCcw size={12} className="text-warm-300" />
                    </button>
                  )}
                </div>
                <span className="text-xs text-warm-400 mt-2 text-center leading-tight break-words">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-warm-500">
            <Trash2 size={64} strokeWidth={1} />
            <p className="mt-4 text-sm">Trash is empty</p>
          </div>
        )}
      </div>

      {denyMessage && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-desktop-surface rounded-xl p-5 max-w-sm mx-4 shadow-2xl border border-warm-700/50">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-warm-700/50 flex items-center justify-center flex-shrink-0">
                <X size={18} className="text-warm-400" />
              </div>
            </div>
            <p className="text-warm-300 text-sm leading-relaxed">{denyMessage}</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-sm bg-warm-700 hover:bg-warm-600 text-warm-200 rounded transition-colors"
                onClick={() => setDenyMessage(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
