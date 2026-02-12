"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Ticket, Users, Tag, Calculator } from "lucide-react";
import type { Pass } from "../../../data/eventValidation";
import type { Event } from "../../../data/events";

interface SummaryCardProps {
    selectedPass: Pass | null;
    selectedEvents: Event[];
    teamSize: number;
    isMobile: boolean;
}

export function SummaryCard({
    selectedPass,
    selectedEvents,
    teamSize,
    isMobile,
}: SummaryCardProps) {
    const totalAmount = useMemo(() => {
        if (!selectedPass) return 0;
        return selectedPass.price * teamSize;
    }, [selectedPass, teamSize]);

    if (!selectedPass) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] overflow-hidden"
        >
            {/* Header */}
            <div className="px-3 py-2 bg-[var(--accent-color)]/10 border-b border-[var(--border-color)]">
                <h4 className="text-xs font-bold text-[var(--accent-color)] flex items-center gap-1.5">
                    <Calculator size={12} />
                    Registration Summary
                </h4>
            </div>

            <div className="p-3 space-y-2.5">
                {/* Pass */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                        <Ticket size={11} />
                        Pass
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-primary)]">
                        {selectedPass.name} — ₹{selectedPass.price}
                    </span>
                </div>

                {/* Events */}
                {selectedEvents.length > 0 && (
                    <div>
                        <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mb-1">
                            <Tag size={11} />
                            Events ({selectedEvents.length})
                        </span>
                        <div className="space-y-1 ml-5">
                            {selectedEvents.map((ev) => (
                                <div
                                    key={ev.id}
                                    className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1"
                                >
                                    <span
                                        className={`w-1.5 h-1.5 rounded-full ${ev.type === "Technical" ? "bg-blue-400" : "bg-green-400"
                                            }`}
                                    />
                                    {ev.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Team Size */}
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                        <Users size={11} />
                        Team Size
                    </span>
                    <span className="text-[11px] font-bold text-[var(--text-primary)]">
                        {teamSize} {teamSize === 1 ? "member" : "members"}
                    </span>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--border-color)] pt-2 mt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                            Total
                        </span>
                        <span className="text-sm font-black text-[var(--accent-color)]">
                            ₹{selectedPass.price} × {teamSize} = ₹{totalAmount}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
