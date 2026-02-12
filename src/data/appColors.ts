/**
 * Per-app icon colors — gives each app a unique, recognizable color
 * similar to how real Android / macOS apps have distinct icon colors.
 */

export interface AppColor {
    /** Primary icon color (hex) */
    color: string;
    /** Background tint for icon containers (with alpha) */
    bg: string;
}

const appColors: Record<string, AppColor> = {
    // ── GUSTO apps ──
    events: { color: '#FF6B35', bg: 'rgba(255,107,53,0.15)' },   // warm orange
    rules: { color: '#4A90D9', bg: 'rgba(74,144,217,0.15)' },   // blue
    contact: { color: '#34C759', bg: 'rgba(52,199,89,0.15)' },    // green
    transport: { color: '#AF52DE', bg: 'rgba(175,82,222,0.15)' },   // purple

    // ── Games ──
    snake: { color: '#30D158', bg: 'rgba(48,209,88,0.15)' },    // vivid green
    minesweeper: { color: '#FF3B30', bg: 'rgba(255,59,48,0.15)' },    // red

    // ── Utilities ──
    terminal: { color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },  // gray
    calendar: { color: '#FF2D55', bg: 'rgba(255,45,85,0.15)' },    // red-pink
    systemPreferences: { color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },  // gray
    achievements: { color: '#FFD60A', bg: 'rgba(255,214,10,0.15)' },   // gold
    spotify: { color: '#1DB954', bg: 'rgba(29,185,84,0.15)' },    // spotify green
    email: { color: '#5AC8FA', bg: 'rgba(90,200,250,0.15)' },   // light blue

    // ── System ──
    finder: { color: '#5AC8FA', bg: 'rgba(90,200,250,0.15)' },   // blue
    trash: { color: '#8E8E93', bg: 'rgba(142,142,147,0.15)' },  // gray
};

/** Fallback for unknown app IDs */
const DEFAULT_COLOR: AppColor = { color: '#FF6B35', bg: 'rgba(255,107,53,0.15)' };

export function getAppColor(appId: string): AppColor {
    return appColors[appId] ?? DEFAULT_COLOR;
}
