"use client";

import { useCallback, useMemo } from "react";
import type { Event } from "../data/events";
import type { Pass } from "../data/eventValidation";

export interface SelectionCounts {
    tech: number;
    nonTech: number;
    total: number;
    maxTech: number;
    maxNonTech: number;
    maxTotal: number;
}

export interface EventValidation {
    canSelect: boolean;
    reason: string | null;
}

function countByType(events: Event[]): { tech: number; nonTech: number } {
    let tech = 0;
    let nonTech = 0;
    for (const e of events) {
        if (e.type === "Technical") tech++;
        else nonTech++;
    }
    return { tech, nonTech };
}

export function usePassValidation(
    selectedPass: Pass | null,
    selectedEvents: Event[]
) {
    const counts = useMemo<SelectionCounts | null>(() => {
        if (!selectedPass) return null;
        const { tech, nonTech } = countByType(selectedEvents);
        return {
            tech,
            nonTech,
            total: tech + nonTech,
            maxTech: selectedPass.maxTech,
            maxNonTech: selectedPass.maxNonTech,
            maxTotal: selectedPass.maxTotal,
        };
    }, [selectedPass, selectedEvents]);

    const validateEvent = useCallback(
        (event: Event): EventValidation => {
            if (!selectedPass) {
                return { canSelect: false, reason: "Select a pass first" };
            }

            // Already selected → allow toggle off (handled upstream)
            if (selectedEvents.some((e) => e.id === event.id)) {
                return { canSelect: true, reason: null };
            }

            // Track conflict
            const trackConflict = selectedEvents.find(
                (e) =>
                    e.track === event.track &&
                    e.timeSlot === event.timeSlot &&
                    e.timeSlot !== "ONLINE"
            );
            if (trackConflict) {
                return {
                    canSelect: false,
                    reason: `Time conflict with "${trackConflict.title}"`,
                };
            }

            // Total limit
            if (selectedEvents.length >= selectedPass.maxTotal) {
                return {
                    canSelect: false,
                    reason: `Max ${selectedPass.maxTotal} events for ${selectedPass.name}`,
                };
            }

            const { tech, nonTech } = countByType(selectedEvents);

            // Tech limit
            if (event.type === "Technical" && tech >= selectedPass.maxTech) {
                return {
                    canSelect: false,
                    reason: `Max ${selectedPass.maxTech} Technical event${selectedPass.maxTech !== 1 ? "s" : ""}`,
                };
            }

            // Non-tech limit
            if (event.type !== "Technical" && nonTech >= selectedPass.maxNonTech) {
                return {
                    canSelect: false,
                    reason: `Max ${selectedPass.maxNonTech} Non-Technical event${selectedPass.maxNonTech !== 1 ? "s" : ""}`,
                };
            }

            return { canSelect: true, reason: null };
        },
        [selectedPass, selectedEvents]
    );

    const isComplete = useMemo(() => {
        if (!selectedPass || selectedEvents.length === 0) return false;
        return true;
    }, [selectedPass, selectedEvents]);

    return { counts, validateEvent, isComplete };
}
