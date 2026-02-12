import type { Event } from './events';

export interface Pass {
    id: string;
    name: string;
    description: string;
    price: number;
    maxTotal: number;
    maxTech: number;
    maxNonTech: number;
}

export const PASSES: Pass[] = [
    {
        id: 'silver',
        name: 'Silver',
        description: '1 event — any Tech or Non-Tech',
        price: 180,
        maxTotal: 1,
        maxTech: 1,
        maxNonTech: 1,
    },
    {
        id: 'gold',
        name: 'Gold',
        description: '2 events — any mix of Tech & Non-Tech',
        price: 200,
        maxTotal: 2,
        maxTech: 2,
        maxNonTech: 2,
    },
    {
        id: 'diamond',
        name: 'Diamond',
        description: '2 Technical + 1 Non-Technical',
        price: 250,
        maxTotal: 3,
        maxTech: 2,
        maxNonTech: 1,
    },
    {
        id: 'platinum',
        name: 'Platinum',
        description: '2 Technical + 2 Non-Technical',
        price: 300,
        maxTotal: 4,
        maxTech: 2,
        maxNonTech: 2,
    },
];

export interface ValidationResult {
    isValid: boolean;
    message: string | null;
}

/**
 * Count technical and non-technical events in a selection.
 */
function countByType(events: Event[]): { tech: number; nonTech: number } {
    let tech = 0;
    let nonTech = 0;
    for (const e of events) {
        if (e.type === 'Technical') tech++;
        else nonTech++;
    }
    return { tech, nonTech };
}

/**
 * Validate whether a new event can be added to the current selection
 * given the selected pass constraints.
 */
export function validateSelection(
    selectedEvents: Event[],
    pass: Pass,
    newEvent: Event
): ValidationResult {
    // 1. Check if already selected
    if (selectedEvents.some(e => e.id === newEvent.id)) {
        return { isValid: false, message: 'Event already selected' };
    }

    // 2. Track conflict check
    const trackConflict = selectedEvents.find(
        e => e.track === newEvent.track && e.timeSlot === newEvent.timeSlot && e.timeSlot !== 'Online'
    );
    if (trackConflict) {
        return {
            isValid: false,
            message: `Track conflict — "${trackConflict.title}" occurs at the same time on Track ${newEvent.track}`,
        };
    }

    // 3. Total limit
    if (selectedEvents.length >= pass.maxTotal) {
        return {
            isValid: false,
            message: `Maximum ${pass.maxTotal} events allowed for ${pass.name}`,
        };
    }

    const { tech, nonTech } = countByType(selectedEvents);
    const newTech = newEvent.type === 'Technical' ? tech + 1 : tech;
    const newNonTech = newEvent.type !== 'Technical' ? nonTech + 1 : nonTech;

    // 4. Tech limit
    if (newTech > pass.maxTech) {
        return {
            isValid: false,
            message: `Maximum ${pass.maxTech} Technical event${pass.maxTech !== 1 ? 's' : ''} allowed for ${pass.name}`,
        };
    }

    // 5. Non-tech limit
    if (newNonTech > pass.maxNonTech) {
        return {
            isValid: false,
            message: `Maximum ${pass.maxNonTech} Non-Technical event${pass.maxNonTech !== 1 ? 's' : ''} allowed for ${pass.name}`,
        };
    }

    return { isValid: true, message: null };
}

/**
 * Get current selection counts for display.
 */
export function getSelectionCounts(selectedEvents: Event[], pass: Pass) {
    const { tech, nonTech } = countByType(selectedEvents);

    return {
        tech,
        nonTech,
        total: tech + nonTech,
        maxTech: pass.maxTech,
        maxNonTech: pass.maxNonTech,
        maxTotal: pass.maxTotal,
    };
}
