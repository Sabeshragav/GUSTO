/**
 * Mapping from app IDs to macOS-style SVG icon filenames
 * in the /mac os icons/ directory under public (pubilc).
 *
 * Desktop-only: mobile view continues to use ThemedIcon (Material Design).
 */

const macIconMap: Record<string, string> = {
    // ── GUSTO Apps ──
    events: "Calendar.svg",
    rules: "Notes.svg",
    contact: "Contacts.svg",
    transport: "Maps.svg",
    register: "Freeform.svg",

    // ── Utilities ──
    finder: "Finder.svg",
    terminal: "Terminal.svg",
    calendar: "Calendar.svg",
    email: "Mail.svg",
    systemPreferences: "Settings.svg",
    achievements: "Reminders.svg",
    spotify: "Music.svg",

    // ── Games ──
    minesweeper: "Chess.svg",
    snake: "Swift Playgrounds.svg",

    // ── System ──
    trash: "Trash Empty.svg",
    trashFull: "Trash Full.svg",
};

/**
 * Get the public URL path to a macOS icon for a given app ID.
 * Returns null if no mapping exists.
 */
export function getMacIcon(appId: string, trashHasItems?: boolean): string | null {
    if (appId === "trash" && trashHasItems) {
        return `/mac_os_icons/${macIconMap["trashFull"]}`;
    }
    const filename = macIconMap[appId];
    return filename ? `/mac_os_icons/${filename}` : null;
}

/**
 * Get the macOS folder icon URL.
 */
export function getMacFolderIcon(): string {
    return `/mac_os_icons/Folder.svg`;
}
