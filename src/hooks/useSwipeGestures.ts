'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface SwipeGestureHandlers {
    /** Swipe up from bottom edge → go Home */
    onSwipeUpHome?: () => void;
    /** Swipe up from bottom + hold → show Recents */
    onSwipeUpRecents?: () => void;
    /** Swipe right from left edge → go Back */
    onSwipeBack?: () => void;
    /** Swipe left on the screen → next page / open drawer */
    onSwipeLeft?: () => void;
    /** Swipe right on the screen → previous page */
    onSwipeRight?: () => void;
}

interface GestureState {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    startTime: number;
    didTrigger: boolean;
}

const BOTTOM_EDGE_THRESHOLD = 70;   // px from bottom to count as bottom-edge swipe
const SWIPE_MIN_DISTANCE = 40;      // min px to count as a swipe
const HORIZONTAL_MIN_DISTANCE = 60; // min px for horizontal page swipe
const SWIPE_MAX_TIME = 600;         // max ms for a fast swipe
const HOLD_DURATION = 350;          // ms to trigger recents vs home

/**
 * Mobile-first swipe gestures using touch events + mouse fallback for desktop.
 *
 * Touch events are used on mobile (most reliable), mouse events for desktop testing.
 */
export function useSwipeGestures(
    containerRef: React.RefObject<HTMLElement | null>,
    handlers: SwipeGestureHandlers,
    enabled: boolean = true,
) {
    const gestureState = useRef<GestureState | null>(null);

    // ─── Touch Events (mobile) ───────────────────────────────

    const onTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled) return;
        const touch = e.touches[0];
        gestureState.current = {
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY,
            startTime: Date.now(),
            didTrigger: false,
        };
    }, [enabled]);

    const onTouchMove = useCallback((e: TouchEvent) => {
        const state = gestureState.current;
        if (!state || state.didTrigger) return;
        const touch = e.touches[0];
        state.currentX = touch.clientX;
        state.currentY = touch.clientY;

        const deltaX = touch.clientX - state.startX;
        const deltaY = state.startY - touch.clientY; // positive = upward
        const elapsed = Date.now() - state.startTime;
        const container = containerRef.current;

        // Bottom edge swipe up → recents (if held long enough while swiping)
        if (container) {
            const rect = container.getBoundingClientRect();
            const startRelY = state.startY - rect.top;
            const isFromBottom = startRelY > rect.height - BOTTOM_EDGE_THRESHOLD;

            if (isFromBottom && deltaY > SWIPE_MIN_DISTANCE && elapsed > HOLD_DURATION) {
                state.didTrigger = true;
                handlers.onSwipeUpRecents?.();
                return;
            }
        }
    }, [containerRef, handlers]);

    const onTouchEnd = useCallback((e: TouchEvent) => {
        const state = gestureState.current;
        if (!state) return;
        gestureState.current = null;
        if (state.didTrigger) return;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - state.startX;
        const deltaY = state.startY - touch.clientY; // positive = upward
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const elapsed = Date.now() - state.startTime;
        const container = containerRef.current;

        // Check if started from bottom edge
        let isFromBottom = false;
        if (container) {
            const rect = container.getBoundingClientRect();
            const startRelY = state.startY - rect.top;
            isFromBottom = startRelY > rect.height - BOTTOM_EDGE_THRESHOLD;
        }

        // Bottom edge swipe up → Home (quick swipe)
        if (isFromBottom && deltaY > SWIPE_MIN_DISTANCE && elapsed < SWIPE_MAX_TIME) {
            handlers.onSwipeUpHome?.();
            return;
        }

        // Horizontal swipe detection (must be more horizontal than vertical)
        if (absDeltaX > HORIZONTAL_MIN_DISTANCE && absDeltaX > absDeltaY * 1.2 && elapsed < SWIPE_MAX_TIME) {
            if (deltaX < 0) {
                // Swiped left → next page / open drawer
                handlers.onSwipeLeft?.();
            } else {
                // Swiped right → go back / previous page
                handlers.onSwipeRight?.();
            }
            return;
        }
    }, [containerRef, handlers]);

    // ─── Mouse Events (desktop fallback) ─────────────────────

    const onMouseDown = useCallback((e: MouseEvent) => {
        if (!enabled) return;
        // Only left mouse button
        if (e.button !== 0) return;
        gestureState.current = {
            startX: e.clientX,
            startY: e.clientY,
            currentX: e.clientX,
            currentY: e.clientY,
            startTime: Date.now(),
            didTrigger: false,
        };
    }, [enabled]);

    const onMouseMove = useCallback((e: MouseEvent) => {
        const state = gestureState.current;
        if (!state || state.didTrigger) return;
        state.currentX = e.clientX;
        state.currentY = e.clientY;
    }, []);

    const onMouseUp = useCallback((e: MouseEvent) => {
        const state = gestureState.current;
        if (!state) return;
        gestureState.current = null;
        if (state.didTrigger) return;

        const deltaX = e.clientX - state.startX;
        const deltaY = state.startY - e.clientY;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);
        const elapsed = Date.now() - state.startTime;
        const container = containerRef.current;

        let isFromBottom = false;
        if (container) {
            const rect = container.getBoundingClientRect();
            const startRelY = state.startY - rect.top;
            isFromBottom = startRelY > rect.height - BOTTOM_EDGE_THRESHOLD;
        }

        if (isFromBottom && deltaY > SWIPE_MIN_DISTANCE && elapsed < SWIPE_MAX_TIME) {
            handlers.onSwipeUpHome?.();
            return;
        }

        if (absDeltaX > HORIZONTAL_MIN_DISTANCE && absDeltaX > absDeltaY * 1.2 && elapsed < SWIPE_MAX_TIME) {
            if (deltaX < 0) {
                handlers.onSwipeLeft?.();
            } else {
                handlers.onSwipeRight?.();
            }
            return;
        }
    }, [containerRef, handlers]);

    // ─── Attach listeners ────────────────────────────────────

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        // Touch events for mobile (passive: true so we don't block scrolling inside apps)
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        container.addEventListener('touchmove', onTouchMove, { passive: true });
        container.addEventListener('touchend', onTouchEnd, { passive: true });

        // Mouse events for desktop
        container.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseup', onMouseUp);

        return () => {
            container.removeEventListener('touchstart', onTouchStart);
            container.removeEventListener('touchmove', onTouchMove);
            container.removeEventListener('touchend', onTouchEnd);
            container.removeEventListener('mousedown', onMouseDown);
            container.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseup', onMouseUp);
        };
    }, [containerRef, enabled, onTouchStart, onTouchMove, onTouchEnd, onMouseDown, onMouseMove, onMouseUp]);
}
