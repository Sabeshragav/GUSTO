"use client";

import { useState, useRef, useCallback } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { Upload, X, Image as ImageIcon, AlertCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";
import type { RegistrationFormData } from "./RegisterPage";
import { REGISTRATION_PRICE, type Event } from "../../../data/events";

interface PaymentSectionProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  screenshotFile: File | null;
  onScreenshotChange: (file: File | null) => void;
  isMobile: boolean;
  hasAbstractEvents: boolean;
  hasSubmissionEvents: boolean;
  abstractEvents: Event[];
  submissionEvents: Event[];
}

export function PaymentSection({
  register,
  errors,
  screenshotFile,
  onScreenshotChange,
  isMobile,
  hasAbstractEvents,
  hasSubmissionEvents,
  abstractEvents,
  submissionEvents,
}: PaymentSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onScreenshotChange(file);
      }
    },
    [onScreenshotChange],
  );

  return (
    <div className="space-y-4">
      {/* Deadline notice for abstract/submission events */}
      {(hasAbstractEvents || hasSubmissionEvents) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
        >
          <div className="flex items-start gap-2">
            <AlertCircle
              size={14}
              className="text-amber-400 flex-shrink-0 mt-0.5"
            />
            <div>
              <p className="text-[11px] font-bold text-amber-400">
                ⚠️ Submission Deadline: March 2, 2026 EOD
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1">
                Please send your works for the following events to the
                respective emails:
              </p>
              <div className="mt-2 space-y-1.5">
                {abstractEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-1.5 text-[10px]"
                  >
                    <Mail size={10} className="text-purple-400" />
                    <span className="text-[var(--text-primary)] font-semibold">
                      {e.title}
                    </span>
                    <span className="text-[var(--text-muted)]">→</span>
                    <a
                      href={`mailto:${e.submissionEmail}`}
                      className="text-[var(--accent-color)] underline"
                    >
                      {e.submissionEmail}
                    </a>
                  </div>
                ))}
                {submissionEvents.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center gap-1.5 text-[10px]"
                  >
                    <Mail size={10} className="text-green-400" />
                    <span className="text-[var(--text-primary)] font-semibold">
                      {e.title}
                    </span>
                    <span className="text-[var(--text-muted)]">→</span>
                    <a
                      href={`mailto:${e.submissionEmail}`}
                      className="text-[var(--accent-color)] underline"
                    >
                      {e.submissionEmail}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Amount display */}
      <div className="p-3 rounded-lg bg-[var(--accent-color)]/5 border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--accent-color)]">
            Registration Fee
          </span>
          <span className="text-[16px] font-bold text-[var(--accent-color)]">
            ₹{REGISTRATION_PRICE}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-2 py-2">
        <img
          src="/placeholder/payment_qrcode.jpeg"
          alt={`Scan QR to pay ₹${REGISTRATION_PRICE}`}
          width={200}
          height={200}
          className="rounded-lg border-2 border-[var(--border-color)] bg-white"
        />
        <p className="text-[10px] text-[var(--text-muted)] text-center">
          Scan the QR code above to pay{" "}
          <strong className="text-[var(--text-primary)]">
            ₹{REGISTRATION_PRICE}
          </strong>{" "}
          via UPI
        </p>
      </div>

      {/* Transaction ID */}
      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-primary)] mb-1">
          Transaction / UTR ID
        </label>
        <input
          type="text"
          {...register("transactionId")}
          placeholder="Enter your UPI transaction ID"
          className="w-full text-[12px] px-3 py-2.5 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-color)] focus:outline-none transition-colors"
        />
        {errors.transactionId && (
          <p className="text-[10px] text-red-400 mt-1">
            {errors.transactionId.message}
          </p>
        )}
      </div>

      {/* Screenshot upload */}
      <div>
        <label className="block text-[11px] font-semibold text-[var(--text-primary)] mb-1">
          Payment Screenshot
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onScreenshotChange(file);
          }}
        />

        {screenshotFile ? (
          <div className="relative p-3 rounded-lg border-2 border-[var(--border-color)] bg-[var(--accent-color)]/5">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-[var(--accent-color)]" />
              <span className="text-[11px] text-[var(--text-primary)] truncate flex-1">
                {screenshotFile.name}
              </span>
              <button
                type="button"
                onClick={() => onScreenshotChange(null)}
                className="p-1 rounded hover:bg-red-500/10 transition-colors"
              >
                <X size={12} className="text-red-400" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`cursor-pointer p-6 rounded-lg border-2 border-dashed text-center transition-colors ${
              dragOver
                ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                : "border-[var(--border-color)] hover:border-[var(--text-muted)]"
            }`}
          >
            <Upload
              size={20}
              className="mx-auto text-[var(--text-muted)] mb-2"
            />
            <p className="text-[11px] text-[var(--text-muted)]">
              Click or drop payment screenshot here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
