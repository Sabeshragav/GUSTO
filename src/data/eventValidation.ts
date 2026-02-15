import type { Event } from './events';

export const REGISTRATION_PRICE = 250;

export interface Pass {
    id: string;
    name: string;
    price: number;
    description: string;
    maxTech: number;
    maxNonTech: number;
    maxTotal: number;
}

export const PASSES: Pass[] = [
    {
        id: 'general',
        name: 'General Pass',
        price: 250,
        description: 'Participate in up to 3 events (Max 2 Technical + Max 2 Non-Technical).',
        maxTech: 2,
        maxNonTech: 2,
        maxTotal: 3
    }
];

/**
 * Validate event selection: exactly 3 events, 2T+1N or 1T+2N, no duplicate time slots.
 */
export function validateEventSelection(
    events: Event[]
): { valid: boolean; error?: string } {
    if (events.length === 0) {
        return { valid: false, error: 'Select at least 1 event' };
    }
    if (events.length > 3) {
        return { valid: false, error: `Maximum 3 events allowed (currently ${events.length})` };
    }

    const tech = events.filter((e) => e.type === 'Technical').length;
    const nonTech = events.filter((e) => e.type === 'Non-Technical').length;

    if (tech > 2) {
        return { valid: false, error: 'Maximum 2 Technical events allowed' };
    }
    if (nonTech > 2) {
        return { valid: false, error: 'Maximum 2 Non-Technical events allowed' };
    }

    // Check time slot conflicts (ONLINE events never conflict)
    const slotted = events.filter((e) => e.timeSlot !== 'ONLINE');
    const seenSlots = new Set<string>();
    for (const e of slotted) {
        if (seenSlots.has(e.timeSlot)) {
            return {
                valid: false,
                error: `Time slot conflict: multiple events in ${e.timeSlot === 'SLOT_1015' ? '10:15 AM' : '11:00 AM'} slot`,
            };
        }
        seenSlots.add(e.timeSlot);
    }

    return { valid: true };
}

/**
 * Get count breakdown of selected events.
 */
export function getSelectionCounts(events: Event[]): { tech: number; nonTech: number; total: number };
export function getSelectionCounts(events: Event[], pass: Pass): { tech: number; nonTech: number; total: number; maxTech: number; maxNonTech: number; maxTotal: number };
export function getSelectionCounts(events: Event[], pass?: Pass) {
    const tech = events.filter((e) => e.type === 'Technical').length;
    const nonTech = events.filter((e) => e.type === 'Non-Technical').length;
    
    if (pass) {
        return {
            tech,
            nonTech,
            total: events.length,
            maxTech: pass.maxTech,
            maxNonTech: pass.maxNonTech,
            maxTotal: pass.maxTotal,
        };
    }

    return {
        tech,
        nonTech,
        total: events.length,
    };
}

/**
 * Return selected events that are ABSTRACT type.
 */
export function getAbstractEvents(events: Event[]): Event[] {
    return events.filter((e) => e.eventType === 'ABSTRACT');
}

/**
 * Return selected events that are SUBMISSION type.
 */
export function getSubmissionEvents(events: Event[]): Event[] {
    return events.filter((e) => e.eventType === 'SUBMISSION');
}

/**
 * Check if a candidate event can be selected given current selection.
 */
export function canSelectEvent(
    candidate: Event,
    currentSelection: Event[]
): { canSelect: boolean; reason: string | null } {
    // Already selected → toggle off is always fine
    if (currentSelection.some((e) => e.id === candidate.id)) {
        return { canSelect: true, reason: null };
    }

    // Max 3
    if (currentSelection.length >= 3) {
        return { canSelect: false, reason: 'Maximum 3 events reached' };
    }

    const tech = currentSelection.filter((e) => e.type === 'Technical').length;
    const nonTech = currentSelection.filter((e) => e.type === 'Non-Technical').length;

    // Check category limits (max 2 of either type)
    if (candidate.type === 'Technical' && tech >= 2) {
        return { canSelect: false, reason: 'Max 2 Technical events' };
    }
    if (candidate.type === 'Non-Technical' && nonTech >= 2) {
        return { canSelect: false, reason: 'Max 2 Non-Technical events' };
    }

    // Time slot conflict (ONLINE never conflicts)
    if (candidate.timeSlot !== 'ONLINE') {
        const conflict = currentSelection.find(
            (e) => e.timeSlot !== 'ONLINE' && e.timeSlot === candidate.timeSlot
        );
        if (conflict) {
            return {
                canSelect: false,
                reason: `Time conflict with "${conflict.title}"`,
            };
        }
    }

    return { canSelect: true, reason: null };
}

/**
 * Get valid fallback events for an ABSTRACT event.
 * Fallback must be: non-ABSTRACT, different time slot, not already selected.
 */
export function getValidFallbacks(
    selectedEvents: Event[],
    abstractEvent: Event,
    allEvents: Event[]
): Event[] {
    const selectedIds = new Set(selectedEvents.map((e) => e.id));

    // Fallback events that should NOT appear (submission-only events)
    const EXCLUDED_FALLBACK_IDS = new Set(['photography', 'meme-contest', 'short-film']);

    return allEvents.filter((e) => {
        if (e.id === abstractEvent.id) return false;
        if (selectedIds.has(e.id)) return false;
        if (e.eventType === 'ABSTRACT') return false;
        if (EXCLUDED_FALLBACK_IDS.has(e.id)) return false;
        // Must not conflict with other selected non-online events (excluding the abstract being replaced)
        if (e.timeSlot !== 'ONLINE') {
            const otherSelected = selectedEvents.filter(
                (s) => s.id !== abstractEvent.id && s.timeSlot !== 'ONLINE'
            );
            if (otherSelected.some((s) => s.timeSlot === e.timeSlot)) return false;
        }
        return true;
    });
}
