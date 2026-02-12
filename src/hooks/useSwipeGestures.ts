'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface SwipeGestureHandlers {
    /** Swipe up from bottom edge → go Home */
    onSwipeUpHome?: () => void;
    /** Swipe up from bottom + hold → show Recents */
    onSwipeUpRecents?: () => void;
    /** Swipe right from left edge → go Back */
    onSwipeBack?: () => void;
}

interface GestureState {
    startX: number;
    startY: number;
    startTime: number;
    isBottomEdge: boolean;
    isLeftEdge: boolean;
    didTrigger: boolean;
    isActive: boolean;
}

const BOTTOM_EDGE_THRESHOLD = 60;   // px from bottom to count as edge swipe
const LEFT_EDGE_THRESHOLD = 35;     // px from left to count as edge swipe
const SWIPE_MIN_DISTANCE = 50;      // min px to count as a swipe
const SWIPE_MAX_TIME = 800;         // max ms for a fast swipe
const HOLD_DURATION = 400;          // ms pause to trigger recents instead of home

/**
 * iOS-style swipe gestures using pointer events (works with both touch AND mouse).
 * - Swipe up from bottom edge → Home
 * - Swipe up from bottom edge + pause → Recents
 * - Swipe right from left edge → Back
 */
export function useSwipeGestures(
    containerRef: React.RefObject<HTMLElement | null>,
    handlers: SwipeGestureHandlers,
    enabled: boolean = true,
) {
    const gestureState = useRef<GestureState | null>(null);

    const handlePointerDown = useCallback((e: PointerEvent) => {
        if (!enabled) return;
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const relativeX = e.clientX - rect.left;
        const isBottomEdge = relativeY > rect.height - BOTTOM_EDGE_THRESHOLD;
        const isLeftEdge = relativeX < LEFT_EDGE_THRESHOLD;

        if (!isBottomEdge && !isLeftEdge) return;

        // Capture pointer for drag tracking even outside the element
        container.setPointerCapture(e.pointerId);

        gestureState.current = {
            startX: e.clientX,
            startY: e.clientY,
            startTime: Date.now(),
            isBottomEdge,
            isLeftEdge,
            didTrigger: false,
            isActive: true,
        };
    }, [containerRef, enabled]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        const state = gestureState.current;
        if (!state || state.didTrigger || !state.isActive) return;

        const deltaX = e.clientX - state.startX;
        const deltaY = state.startY - e.clientY; // positive = upward
        const elapsed = Date.now() - state.startTime;

        // Bottom edge: swipe up
        if (state.isBottomEdge && deltaY > SWIPE_MIN_DISTANCE) {
            if (elapsed > HOLD_DURATION && handlers.onSwipeUpRecents) {
                state.didTrigger = true;
                handlers.onSwipeUpRecents();
                return;
            }
        }

        // Left edge: swipe right → back
        if (state.isLeftEdge && deltaX > SWIPE_MIN_DISTANCE && elapsed < SWIPE_MAX_TIME) {
            state.didTrigger = true;
            handlers.onSwipeBack?.();
        }
    }, [handlers]);

    const handlePointerUp = useCallback((e: PointerEvent) => {
        const state = gestureState.current;
        if (!state) return;

        const container = containerRef.current;
        if (container) {
            try { container.releasePointerCapture(e.pointerId); } catch { }
        }

        if (!state.didTrigger && state.isBottomEdge) {
            const deltaY = state.startY - e.clientY;
            const elapsed = Date.now() - state.startTime;
            // Quick swipe up from bottom = go home
            if (deltaY > SWIPE_MIN_DISTANCE && elapsed < SWIPE_MAX_TIME) {
                handlers.onSwipeUpHome?.();
            }
        }

        gestureState.current = null;
    }, [containerRef, handlers]);

    const handlePointerCancel = useCallback(() => {
        gestureState.current = null;
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !enabled) return;

        container.addEventListener('pointerdown', handlePointerDown);
        container.addEventListener('pointermove', handlePointerMove);
        container.addEventListener('pointerup', handlePointerUp);
        container.addEventListener('pointercancel', handlePointerCancel);

        return () => {
            container.removeEventListener('pointerdown', handlePointerDown);
            container.removeEventListener('pointermove', handlePointerMove);
            container.removeEventListener('pointerup', handlePointerUp);
            container.removeEventListener('pointercancel', handlePointerCancel);
        };
    }, [containerRef, enabled, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel]);
}
