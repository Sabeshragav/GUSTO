"use client";

import { motion } from "framer-motion";
import { CheckCircle, Copy, Clock, PartyPopper } from "lucide-react";
import { useState } from "react";

interface SuccessScreenProps {
    registrationId: string;
    isMobile: boolean;
}

export function SuccessScreen({
    registrationId,
    isMobile,
}: SuccessScreenProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(registrationId).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="h-full flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center max-w-sm"
            >
                {/* Animated Checkmark */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                    className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-4"
                >
                    <CheckCircle size={40} className="text-green-500" />
                </motion.div>

                {/* Party icon */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <PartyPopper
                        size={28}
                        className="text-[var(--accent-color)] mb-2"
                    />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg font-bold text-[var(--text-primary)] mb-1"
                >
                    Registration Successful!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-[var(--text-muted)] mb-6"
                >
                    Your registration for GUSTO &apos;26 has been submitted
                </motion.p>

                {/* Registration ID */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="w-full p-4 rounded border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] mb-4"
                >
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-bold mb-1">
                        Registration Code
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <code className="text-sm font-bold text-[var(--accent-color)] font-mono tracking-wider">
                            {registrationId}
                        </code>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="p-1.5 rounded hover:bg-[var(--surface-primary)] transition-colors"
                            title="Copy ID"
                        >
                            <Copy
                                size={14}
                                className={
                                    copied
                                        ? "text-green-500"
                                        : "text-[var(--text-muted)]"
                                }
                            />
                        </button>
                    </div>
                    {copied && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] text-green-400 mt-1"
                        >
                            Copied to clipboard!
                        </motion.p>
                    )}
                </motion.div>

                {/* Verification pending */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded bg-amber-500/10 border border-amber-500/20"
                >
                    <Clock size={14} className="text-amber-400 flex-shrink-0" />
                    <p className="text-[11px] text-amber-400 text-left">
                        Payment verification is pending. You will receive a confirmation
                        email once verified.
                    </p>
                </motion.div>

                {/* Contact */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-[10px] text-[var(--text-muted)] mt-4"
                >
                    Need help? Contact{" "}
                    <span className="text-[var(--accent-color)]">
                        gustogcee@gmail.com
                    </span>
                </motion.p>
            </motion.div>
        </div>
    );
}
