"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    useFieldArray,
    type Control,
    type UseFormRegister,
    type FieldErrors,
} from "react-hook-form";
import { Plus, Minus, UserPlus, Users } from "lucide-react";
import type { RegistrationFormData } from "./RegisterPage";

interface TeamSectionProps {
    control: Control<RegistrationFormData>;
    register: UseFormRegister<RegistrationFormData>;
    errors: FieldErrors<RegistrationFormData>;
    teamSize: number;
    onTeamSizeChange: (size: number) => void;
    isMobile: boolean;
    hasTeamEvents: boolean;
}

const YEAR_OPTIONS = [
    { value: "", label: "Select Year" },
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" },
];

export function TeamSection({
    control,
    register,
    errors,
    teamSize,
    onTeamSizeChange,
    isMobile,
    hasTeamEvents,
}: TeamSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "teammates",
    });

    const inputClass =
        "w-full px-3 py-2 text-base bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-[var(--text-muted)]";

    const handleIncrease = () => {
        if (teamSize >= 4) return;
        const newSize = teamSize + 1;
        onTeamSizeChange(newSize);
        // Add a teammate entry
        append(
            { name: "", email: "", mobile: "", college: "", year: "" },
            { shouldFocus: false }
        );
    };

    const handleDecrease = () => {
        if (teamSize <= 1) return;
        const newSize = teamSize - 1;
        onTeamSizeChange(newSize);
        // Remove last teammate entry
        if (fields.length > 0) {
            remove(fields.length - 1);
        }
    };

    return (
        <div className="space-y-4">
            <div className="pb-2 border-b border-[var(--border-color)]">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                    👥 Team Details
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {hasTeamEvents
                        ? "Set your team size for Paper / Project Presentation (1–4 members)"
                        : "Team members only apply to Paper & Project Presentation"}
                </p>
            </div>

            {!hasTeamEvents && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded bg-blue-500/10 border border-blue-500/20">
                    <UserPlus size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-blue-400">
                        None of your selected events require teams. You&apos;re registered as an individual participant.
                    </span>
                </div>
            )}

            {hasTeamEvents && (
                <>
                    {/* Team Size Selector */}
                    <div className="flex items-center justify-between p-3 rounded border-2 border-[var(--border-color)] bg-[var(--surface-secondary)]">
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-[var(--accent-color)]" />
                            <span className="text-base font-bold text-[var(--text-primary)]">
                                Team Size
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleDecrease}
                                disabled={teamSize <= 1}
                                className="w-9 h-9 flex items-center justify-center rounded border-2 border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:border-[var(--accent-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="text-xl font-bold text-[var(--text-primary)] w-8 text-center tabular-nums">
                                {teamSize}
                            </span>
                            <button
                                type="button"
                                onClick={handleIncrease}
                                disabled={teamSize >= 4}
                                className="w-9 h-9 flex items-center justify-center rounded border-2 border-[var(--border-color)] bg-[var(--surface-primary)] text-[var(--text-primary)] hover:border-[var(--accent-color)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    {teamSize === 1 && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded bg-[var(--surface-secondary)] border border-[var(--border-color)]">
                            <UserPlus size={16} className="text-[var(--text-muted)]" />
                            <span className="text-xs text-[var(--text-muted)]">
                                Solo participation — no teammate details needed
                            </span>
                        </div>
                    )}

                    {/* Teammate Forms */}
                    <AnimatePresence mode="popLayout">
                        {fields.map((field, index) => (
                            <motion.div
                                key={field.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="p-4 rounded border-2 border-[var(--border-color)] bg-[var(--surface-primary)]"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-[var(--accent-color)] uppercase tracking-wide">
                                        Teammate {index + 1}
                                    </h4>
                                    <span className="text-xs text-[var(--text-muted)] font-medium">
                                        Member {index + 2} of {teamSize}
                                    </span>
                                </div>

                                <div
                                    className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"
                                        }`}
                                >
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                                            Name
                                        </label>
                                        <input
                                            {...register(`teammates.${index}.name`)}
                                            placeholder="Full name"
                                            className={inputClass}
                                        />
                                        {errors.teammates?.[index]?.name && (
                                            <p className="text-xs text-red-400">
                                                {errors.teammates[index]?.name?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                                            Email
                                        </label>
                                        <input
                                            {...register(`teammates.${index}.email`)}
                                            type="email"
                                            placeholder="email@example.com"
                                            className={inputClass}
                                        />
                                        {errors.teammates?.[index]?.email && (
                                            <p className="text-xs text-red-400">
                                                {errors.teammates[index]?.email?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                                            Mobile
                                        </label>
                                        <input
                                            {...register(`teammates.${index}.mobile`)}
                                            type="tel"
                                            placeholder="10-digit number"
                                            className={inputClass}
                                            maxLength={10}
                                        />
                                        {errors.teammates?.[index]?.mobile && (
                                            <p className="text-xs text-red-400">
                                                {errors.teammates[index]?.mobile?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                                            College
                                        </label>
                                        <input
                                            {...register(`teammates.${index}.college`)}
                                            placeholder="College name"
                                            className={inputClass}
                                        />
                                        {errors.teammates?.[index]?.college && (
                                            <p className="text-xs text-red-400">
                                                {errors.teammates[index]?.college?.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-[var(--text-muted)] uppercase">
                                            Year
                                        </label>
                                        <select
                                            {...register(`teammates.${index}.year`)}
                                            className={inputClass}
                                        >
                                            {YEAR_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.teammates?.[index]?.year && (
                                            <p className="text-xs text-red-400">
                                                {errors.teammates[index]?.year?.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
}
