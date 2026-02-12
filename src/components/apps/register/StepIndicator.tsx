"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    labels: string[];
    isMobile: boolean;
}

export function StepIndicator({
    currentStep,
    totalSteps,
    labels,
    isMobile,
}: StepIndicatorProps) {
    return (
        <div className="flex items-center justify-center w-full px-2 py-3">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div key={step} className="flex items-center">
                        {/* Step circle */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={false}
                                animate={{
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isCompleted
                                        ? "var(--accent-color)"
                                        : isActive
                                            ? "var(--accent-color)"
                                            : "var(--surface-secondary)",
                                    borderColor: isCompleted || isActive
                                        ? "var(--accent-color)"
                                        : "var(--border-color)",
                                }}
                                transition={{ duration: 0.2 }}
                                className={`flex items-center justify-center border-2 ${isMobile ? "w-7 h-7 text-[10px]" : "w-8 h-8 text-xs"
                                    } rounded-full font-bold`}
                            >
                                {isCompleted ? (
                                    <Check
                                        size={isMobile ? 12 : 14}
                                        className="text-white"
                                        strokeWidth={3}
                                    />
                                ) : (
                                    <span
                                        className={
                                            isActive
                                                ? "text-white"
                                                : "text-[var(--text-muted)]"
                                        }
                                    >
                                        {step}
                                    </span>
                                )}
                            </motion.div>
                            {!isMobile && (
                                <span
                                    className={`mt-1 text-[10px] font-medium whitespace-nowrap ${isActive
                                            ? "text-[var(--accent-color)]"
                                            : isCompleted
                                                ? "text-[var(--text-secondary)]"
                                                : "text-[var(--text-muted)]"
                                        }`}
                                >
                                    {labels[i]}
                                </span>
                            )}
                        </div>

                        {/* Connector line */}
                        {step < totalSteps && (
                            <div
                                className={`${isMobile ? "w-4 mx-0.5" : "w-8 mx-1"} h-0.5 rounded-full`}
                                style={{
                                    backgroundColor: isCompleted
                                        ? "var(--accent-color)"
                                        : "var(--border-color)",
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
