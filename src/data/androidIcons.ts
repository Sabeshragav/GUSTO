/**
 * Mapping from app IDs to Android-style SVG icon filenames
 * in the /Android os icons/ directory under public.
 *
 * Mobile-only: desktop view continues to use macOS SVG icons.
 */

const androidIconMap: Record<string, string> = {
    // ── GUSTO Apps ──
    events: "Icon=Calendar.svg",
    rules: "Icon=Docs.svg",
    contact: "Icon=Contacts.svg",
    transport: "Icon=Google.svg",

    // ── Utilities ──
    terminal: "Icon=Chrome.svg",
    calendar: "Icon=Calendar.svg",
    email: "Icon=Gmail.svg",
    systemPreferences: "Icon=Settings.svg",
    achievements: "Icon=Gallery.svg",
    spotify: "Icon=Play Store.svg",

    // ── Games ──
    minesweeper: "Icon=Play Games.svg",
    snake: "Icon=Play Games.svg",
};

/**
 * Get the public URL path to an Android icon for a given app ID.
 * Returns null if no mapping exists.
 */
export function getAndroidIcon(appId: string): string | null {
    const filename = androidIconMap[appId];
    return filename ? `/android_os_icons/${filename}` : null;
}
