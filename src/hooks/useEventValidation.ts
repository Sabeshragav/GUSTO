"use client";

import { useCallback, useMemo } from "react";
import type { Event } from "../data/events";
import { canSelectEvent, getSelectionCounts } from "../data/eventValidation";

export interface SelectionCounts {
    tech: number;
    nonTech: number;
    total: number;
}

export interface EventValidation {
    canSelect: boolean;
    reason: string | null;
}

export function useEventValidation(selectedEvents: Event[]) {
    const counts = useMemo<SelectionCounts>(() => {
        return getSelectionCounts(selectedEvents);
    }, [selectedEvents]);

    const validateEvent = useCallback(
        (event: Event): EventValidation => {
            return canSelectEvent(event, selectedEvents);
        },
        [selectedEvents]
    );

    const isComplete = useMemo(() => {
        return selectedEvents.length >= 1;
    }, [selectedEvents]);

    return { counts, validateEvent, isComplete };
}
