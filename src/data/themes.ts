import type { Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'ph-light',
    name: '  Light',
    description: 'Engineering-focused retro light theme',
    iconConfig: {
      library: 'phosphor',
      strokeWidth: 2,
      filled: true,
    },
    recommendedWallpaper: 'white',
  },
  {
    id: 'ph-dark',
    name: '  Dark',
    description: 'Engineering-focused retro dark theme',
    iconConfig: {
      library: 'phosphor',
      strokeWidth: 2,
      filled: true,
    },
    recommendedWallpaper: 'charcoal',
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((t) => t.id === id) || themes[0];
}
