/**
 * Mapping from app IDs to iOS/macOS-style SVG icon filenames
 * in the /mac_os_icons/ directory under public.
 *
 * Mobile-only: reuses macOS SVG icons which share Apple's design language.
 */

const iosIconMap: Record<string, string> = {
    // ── GUSTO Apps ──
    events: "Books.svg",
    rules: "Notes.svg",
    contact: "Contacts.svg",
    transport: "Maps.svg",
    register: "Freeform.svg",
    browser: "Safari.svg",

    // ── Utilities ──
    terminal: "Terminal.svg",
    calendar: "Calendar.svg",
    email: "Mail.svg",
    systemPreferences: "Settings.svg",
    achievements: "Reminders.svg",
    spotify: "Music.svg",

    // ── Games ──
    minesweeper: "Chess.svg",
    snake: "Swift Playgrounds.svg",
};

/**
 * Get the public URL path to an iOS-style icon for a given app ID.
 * Returns null if no mapping exists.
 */
export function getIOSIcon(appId: string): string | null {
    const filename = iosIconMap[appId];
    return filename ? `/mac_os_icons/${filename}` : null;
}
