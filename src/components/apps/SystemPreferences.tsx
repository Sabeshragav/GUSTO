'use client';

import { useState, useEffect } from 'react';
import { Monitor, Palette, Check, Moon, Sun, Smartphone } from 'lucide-react';
import { useDesktop, wallpapers, themes } from '../../contexts/DesktopContext';
import type { Wallpaper, Theme } from '../../types';

type Tab = 'appearance' | 'wallpaper';

const themeColors: Record<string, { primary: string; accent: string; bg: string }> = {
  'ph-light': { primary: '#EEEFE9', accent: '#F54E00', bg: '#FDFDFD' },
  'ph-dark': { primary: '#151515', accent: '#F54E00', bg: '#1d1d1d' },
};

function ThemePreviewChip({ themeId }: { themeId: string }) {
  const colors = themeColors[themeId] || themeColors['ph-light'];
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: colors.bg, border: `1px solid ${colors.primary}30` }}
      />
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="w-4 h-4 rounded"
        style={{ backgroundColor: colors.accent }}
      />
    </div>
  );
}

export function SystemPreferences() {
  const { state, setWallpaper, setTheme } = useDesktop();
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const [applyRecommendedWallpaper, setApplyRecommendedWallpaper] = useState(true);
  const [isAuto, setIsAuto] = useState(false);

  // Filter out any potential leftover themes, only allow ph-light and ph-dark
  const availableThemes = themes.filter(t => t.id === 'ph-light' || t.id === 'ph-dark');
  
  const solidWallpapers = wallpapers.filter(w => w.type === 'solid');
  const gradientWallpapers = wallpapers.filter(w => w.type === 'gradient');
  const imageWallpapers = wallpapers.filter(w => w.type === 'image');

  const handleAutoTheme = () => {
    setIsAuto(true);
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const newTheme = themes.find(t => t.id === (isDark ? 'ph-dark' : 'ph-light'));
    if (newTheme) {
      setTheme(newTheme, applyRecommendedWallpaper);
    }
  };

  const handleManualTheme = (theme: Theme) => {
    setIsAuto(false);
    setTheme(theme, applyRecommendedWallpaper);
  };

  useEffect(() => {
    if (isAuto) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = themes.find(t => t.id === (e.matches ? 'ph-dark' : 'ph-light'));
        if (newTheme) {
          setTheme(newTheme, applyRecommendedWallpaper);
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [isAuto, setTheme, applyRecommendedWallpaper]);

  const renderWallpaperOption = (wp: Wallpaper) => {
    const isSelected = state.wallpaper.id === wp.id;
    const style: React.CSSProperties = wp.type === 'image'
      ? { backgroundImage: `url(${wp.thumbnail || wp.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : wp.type === 'gradient'
        ? { background: wp.value }
        : { backgroundColor: wp.value };

    return (
      <button
        key={wp.id}
        onClick={() => setWallpaper(wp)}
        className={`relative w-20 h-14 rounded overflow-hidden transition-all ${
          isSelected ? 'ring-2 ring-[var(--ph-orange)] ring-offset-2 ring-offset-[var(--surface-bg)]' : 'hover:ring-1 hover:ring-[var(--border-color)]'
        }`}
        style={style}
      >
        {isSelected && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Check size={16} className="text-white" />
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col text-[var(--text-primary)] bg-[var(--surface-bg)]">
      <div className="flex border-b border-[var(--border-color)] bg-[var(--surface-primary)]">
        <button
          onClick={() => setActiveTab('appearance')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${
            activeTab === 'appearance'
              ? 'text-[var(--ph-orange)] border-b-2 border-[var(--ph-orange)] -mb-px'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Palette size={16} />
          Appearance
        </button>
        <button
          onClick={() => setActiveTab('wallpaper')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors ${
            activeTab === 'wallpaper'
              ? 'text-[var(--ph-orange)] border-b-2 border-[var(--ph-orange)] -mb-px'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Monitor size={16} />
          Wallpaper
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 bg-[var(--surface-bg)]">
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-4">Theme Mode</h3>
              <div className="p-4 rounded bg-[var(--surface-secondary)] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-[var(--surface-primary)]">
                    <Moon size={20} className="text-[var(--text-primary)]" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">Dark Mode Active</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">Gusto OS is optimized for dark mode.</div>
                  </div>
                  <div className="ml-auto w-5 h-5 rounded-full bg-[var(--ph-orange)] flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-primary)]">Apply Recommended Wallpaper</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Automatically set wallpaper when changing themes</p>
              </div>
              <button
                onClick={() => setApplyRecommendedWallpaper(!applyRecommendedWallpaper)}
                className={`relative w-11 h-6 rounded-full transition-colors border-2 border-[var(--ph-black)] ${
                  applyRecommendedWallpaper ? 'bg-[var(--ph-orange)]' : 'bg-[var(--surface-secondary)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
                    applyRecommendedWallpaper ? 'translate-x-5 shadow-sm' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'wallpaper' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Solid Colors</h3>
              <div className="flex gap-3 flex-wrap">
                {solidWallpapers.map(renderWallpaperOption)}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Gradients</h3>
              <div className="flex gap-3 flex-wrap">
                {gradientWallpapers.map(renderWallpaperOption)}
              </div>
            </div>

            <div>
               <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Images</h3>
              <div className="flex gap-3 flex-wrap">
                {imageWallpapers.map(renderWallpaperOption)}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-3">Preview</h3>
              <div
                className="w-full h-40 rounded overflow-hidden border-2 border-[var(--border-color)] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                style={
                  state.wallpaper.type === 'image'
                    ? { backgroundImage: `url(${state.wallpaper.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : state.wallpaper.type === 'gradient'
                      ? { background: state.wallpaper.value }
                      : { backgroundColor: state.wallpaper.value }
                }
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded text-sm text-white font-bold">
                    {state.wallpaper.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
