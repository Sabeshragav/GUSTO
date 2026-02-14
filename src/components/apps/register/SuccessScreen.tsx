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
          <PartyPopper size={28} className="text-[var(--accent-color)] mb-2" />
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
                  copied ? "text-green-500" : "text-[var(--text-muted)]"
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

        {/* WhatsApp Group Link */}
        <motion.a
          href="https://chat.whatsapp.com/PLACEHOLDER_GROUP_LINK"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-green-600/10 border border-green-600/20 hover:bg-green-600/20 transition-colors mb-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-green-500 flex-shrink-0"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.935 11.935 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.313 0-4.46-.744-6.206-2.006l-.44-.327-3.074 1.03 1.03-3.074-.327-.44A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          <span className="text-[11px] font-semibold text-green-500">
            Join the GUSTO &apos;26 WhatsApp Group
          </span>
        </motion.a>

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
