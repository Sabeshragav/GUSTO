"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { PASSES, type Pass } from "../../../data/eventValidation";

interface PassSelectorStepProps {
    selectedPassId: string | null;
    onSelectPass: (pass: Pass) => void;
    isMobile: boolean;
}

const PASS_EMOJI: Record<string, string> = {
    silver: "🥈",
    gold: "🥇",
    diamond: "💎",
    platinum: "👑",
};

const PASS_COLORS: Record<string, { border: string; bg: string; glow: string }> = {
    silver: {
        border: "border-gray-400",
        bg: "bg-gradient-to-br from-gray-100/10 to-gray-300/5",
        glow: "shadow-[0_0_12px_rgba(156,163,175,0.15)]",
    },
    gold: {
        border: "border-yellow-500",
        bg: "bg-gradient-to-br from-yellow-100/10 to-amber-300/5",
        glow: "shadow-[0_0_12px_rgba(234,179,8,0.15)]",
    },
    diamond: {
        border: "border-cyan-400",
        bg: "bg-gradient-to-br from-cyan-100/10 to-blue-300/5",
        glow: "shadow-[0_0_12px_rgba(34,211,238,0.15)]",
    },
    platinum: {
        border: "border-purple-400",
        bg: "bg-gradient-to-br from-purple-100/10 to-violet-300/5",
        glow: "shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    },
};

export function PassSelectorStep({
    selectedPassId,
    onSelectPass,
    isMobile,
}: PassSelectorStepProps) {
    return (
        <div className="space-y-4">
            <div className="pb-2 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    🎟️ Select Your Pass
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Choose a tier based on how many events you want to attend
                </p>
            </div>

            <div
                className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"
                    }`}
            >
                {PASSES.map((pass) => {
                    const isSelected = selectedPassId === pass.id;
                    const colors = PASS_COLORS[pass.id] || PASS_COLORS.silver;

                    return (
                        <motion.button
                            key={pass.id}
                            type="button"
                            onClick={() => onSelectPass(pass)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative p-4 rounded border-2 text-left transition-all duration-200 ${colors.bg
                                } ${isSelected
                                    ? `${colors.border} ${colors.glow}`
                                    : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
                                }`}
                        >
                            {/* Selected badge */}
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent-color)] flex items-center justify-center"
                                >
                                    <Check size={12} className="text-white" strokeWidth={3} />
                                </motion.div>
                            )}

                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{PASS_EMOJI[pass.id] || "🎫"}</span>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-[var(--text-primary)]">
                                            {pass.name}
                                        </h4>
                                        <span className="text-xs font-bold text-[var(--accent-color)]">
                                            ₹{pass.price}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                                        {pass.description}
                                    </p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-muted)] font-medium border border-[var(--border-color)]">
                                            Max {pass.maxTech} Tech
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-muted)] font-medium border border-[var(--border-color)]">
                                            Max {pass.maxNonTech} Non-Tech
                                        </span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-secondary)] text-[var(--text-muted)] font-medium border border-[var(--border-color)]">
                                            {pass.maxTotal} Total
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            {!selectedPassId && (
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--surface-secondary)] border border-[var(--border-color)]">
                    <Sparkles size={14} className="text-[var(--accent-color)]" />
                    <span className="text-[11px] text-[var(--text-muted)]">
                        Select a pass to continue to event selection
                    </span>
                </div>
            )}
        </div>
    );
}
