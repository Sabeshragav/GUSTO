import type { Event } from './events';

export interface Pass {
    id: string;
    name: string;
    description: string;
    maxTotal: number;
    maxTech: number;
    maxNonTech: number;
    /** If true, only non-tech events are allowed */
    nonTechOnly?: boolean;
    /** For Tier 2: allow flexible combos */
    flexCombos?: { maxTech: number; maxNonTech: number }[];
}

/**
 * Tier 4 rules are isolated here for easy future modification.
 */
const TIER_4_RULES = {
    maxTotal: 5,
    maxTech: 3,
    maxNonTech: 2,
};

export const PASSES: Pass[] = [
    {
        id: 'tier-1',
        name: 'Tier 1',
        description: 'Up to 2 Non-Technical events',
        maxTotal: 2,
        maxTech: 0,
        maxNonTech: 2,
        nonTechOnly: true,
    },
    {
        id: 'tier-2',
        name: 'Tier 2',
        description: '3 events — mix of Tech & Non-Tech',
        maxTotal: 3,
        maxTech: 2,
        maxNonTech: 2,
        flexCombos: [
            { maxTech: 2, maxNonTech: 1 }, // Option A
            { maxTech: 1, maxNonTech: 2 }, // Option B
        ],
    },
    {
        id: 'tier-3',
        name: 'Tier 3',
        description: '2 Technical + 2 Non-Technical',
        maxTotal: 4,
        maxTech: 2,
        maxNonTech: 2,
    },
    {
        id: 'tier-4',
        name: 'Tier 4',
        description: `${TIER_4_RULES.maxTech} Technical + ${TIER_4_RULES.maxNonTech} Non-Technical`,
        maxTotal: TIER_4_RULES.maxTotal,
        maxTech: TIER_4_RULES.maxTech,
        maxNonTech: TIER_4_RULES.maxNonTech,
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

    // 4. Non-tech only check (Tier 1)
    if (pass.nonTechOnly && newEvent.type === 'Technical') {
        return {
            isValid: false,
            message: `${pass.name} only allows Non-Technical events`,
        };
    }

    const { tech, nonTech } = countByType(selectedEvents);
    const newTech = newEvent.type === 'Technical' ? tech + 1 : tech;
    const newNonTech = newEvent.type !== 'Technical' ? nonTech + 1 : nonTech;

    // 5. Tier 2 flex combo check
    if (pass.flexCombos) {
        const fitsAnyCombo = pass.flexCombos.some(
            combo => newTech <= combo.maxTech && newNonTech <= combo.maxNonTech
        );
        if (!fitsAnyCombo) {
            return {
                isValid: false,
                message: `${pass.name} allows 2 Tech + 1 Non-Tech, or 1 Tech + 2 Non-Tech`,
            };
        }
        return { isValid: true, message: null };
    }

    // 6. Standard tech/non-tech limits
    if (newTech > pass.maxTech) {
        return {
            isValid: false,
            message: `Maximum ${pass.maxTech} Technical events allowed for ${pass.name}`,
        };
    }
    if (newNonTech > pass.maxNonTech) {
        return {
            isValid: false,
            message: `Maximum ${pass.maxNonTech} Non-Technical events allowed for ${pass.name}`,
        };
    }

    return { isValid: true, message: null };
}

/**
 * Get current selection counts for display.
 */
export function getSelectionCounts(selectedEvents: Event[], pass: Pass) {
    const { tech, nonTech } = countByType(selectedEvents);

    // For Tier 2 with flex combos, dynamically determine effective max
    let effectiveMaxTech = pass.maxTech;
    let effectiveMaxNonTech = pass.maxNonTech;

    if (pass.flexCombos) {
        // Find the best matching combo based on current selection
        for (const combo of pass.flexCombos) {
            if (tech <= combo.maxTech && nonTech <= combo.maxNonTech) {
                effectiveMaxTech = combo.maxTech;
                effectiveMaxNonTech = combo.maxNonTech;
                break;
            }
        }
    }

    return {
        tech,
        nonTech,
        total: tech + nonTech,
        maxTech: effectiveMaxTech,
        maxNonTech: effectiveMaxNonTech,
        maxTotal: pass.maxTotal,
    };
}
