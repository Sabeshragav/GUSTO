"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { RegistrationFormData } from "./RegisterPage";

interface TeamLeaderFormProps {
    register: UseFormRegister<RegistrationFormData>;
    errors: FieldErrors<RegistrationFormData>;
    isMobile: boolean;
}

const YEAR_OPTIONS = [
    { value: "", label: "Select Year" },
    { value: "1st Year", label: "1st Year" },
    { value: "2nd Year", label: "2nd Year" },
    { value: "3rd Year", label: "3rd Year" },
    { value: "4th Year", label: "4th Year" },
    { value: "5th Year", label: "5th Year" },
];

function FormField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">
                {label}
            </label>
            {children}
            {error && (
                <p className="text-[11px] text-red-400 font-medium mt-0.5">{error}</p>
            )}
        </div>
    );
}

export function TeamLeaderForm({
    register,
    errors,
    isMobile,
}: TeamLeaderFormProps) {
    const inputClass =
        "w-full px-3 py-2.5 text-sm bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-[var(--text-muted)]";

    return (
        <div className="space-y-4">
            <div className="pb-2 border-b border-[var(--border-color)]">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    👤 Team Leader Details
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Fill in the primary registrant&apos;s details
                </p>
            </div>

            <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
                <FormField label="Full Name" error={errors.leaderName?.message}>
                    <input
                        {...register("leaderName")}
                        placeholder="Enter your full name"
                        className={inputClass}
                        autoComplete="name"
                    />
                </FormField>

                <FormField label="Email Address" error={errors.leaderEmail?.message}>
                    <input
                        {...register("leaderEmail")}
                        type="email"
                        placeholder="you@example.com"
                        className={inputClass}
                        autoComplete="email"
                    />
                </FormField>

                <FormField label="Mobile Number" error={errors.leaderMobile?.message}>
                    <input
                        {...register("leaderMobile")}
                        type="tel"
                        placeholder="10-digit mobile number"
                        className={inputClass}
                        autoComplete="tel"
                        maxLength={10}
                    />
                </FormField>

                <FormField label="College Name" error={errors.leaderCollege?.message}>
                    <input
                        {...register("leaderCollege")}
                        placeholder="Your college name"
                        className={inputClass}
                        autoComplete="organization"
                    />
                </FormField>

                <FormField label="Year of Study" error={errors.leaderYear?.message}>
                    <select
                        {...register("leaderYear")}
                        className={inputClass}
                    >
                        {YEAR_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>
        </div>
    );
}
