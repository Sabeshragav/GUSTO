"use client";

/**
 * iOS-style home indicator bar — a thin pill at the bottom of the screen.
 * Purely visual; actual interaction is handled by useSwipeGestures.
 */
export function IOSHomeIndicator() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[300] flex items-center justify-center h-8 pointer-events-none">
            <div className="w-[134px] h-[5px] rounded-full bg-white/40" />
        </div>
    );
}
