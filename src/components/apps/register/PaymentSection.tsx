"use client";

import { useState, useRef, useCallback } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import {
  Upload,
  X,
  Image as ImageIcon,
  //  AlertCircle,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { RegistrationFormData } from "./RegisterPage";
import { REGISTRATION_PRICE, type Event } from "../../../data/events";

const MAX_SCREENSHOT_SIZE = 2 * 1024 * 1024; // 2 MB

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
  const [fileError, setFileError] = useState<string | null>(null);

  const validateAndSetFile = useCallback(
    (file: File) => {
      setFileError(null);
      if (!file.type.startsWith("image/")) {
        setFileError("Only image files are allowed");
        return;
      }
      if (file.size > MAX_SCREENSHOT_SIZE) {
        setFileError("File size must be under 2 MB");
        return;
      }
      onScreenshotChange(file);
    },
    [onScreenshotChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile],
  );

  return (
    <div className="space-y-4">
      {/* Deadline notice for abstract events (Paper/Project) */}
      {hasAbstractEvents && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
        >
          <div className="flex items-start gap-2">
            {/* <AlertCircle
              size={14}
              className="text-green-400 flex-shrink-0 mt-0.5"
            /> */}
            <div>
              <p className="text-xs font-bold text-green-400">
                Submission Deadline: March 3rd, 2026 EOD
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Please complete your payment before sending your works to the
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
                      className="text-blue-400 underline"
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

      {/* Deadline notice for submission events (Online) */}
      {hasSubmissionEvents && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-green-500/10 border border-green-500/30"
        >
          <div className="flex items-start gap-2">
            {/* <AlertCircle
              size={14}
              className="text-green-400 flex-shrink-0 mt-0.5"
            /> */}
            <div>
              <p className="text-xs font-bold text-green-400">
                Submission Deadline: March 5th, 2026 - 3.00PM
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Please complete your payment before sending your works to the
                respective emails:
              </p>
              <div className="mt-2 space-y-1.5">
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
                      className="text-blue-400 underline"
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

      {/* Food Preference */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
          Food Preference (For Lunch) <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <select
            {...register("foodPreference")}
            className="w-full text-base px-3 py-2.5 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none transition-colors appearance-none cursor-pointer"
            defaultValue=""
          >
            <option value="" disabled>
              Select Food Preference
            </option>
            <option value="VEG">Veg</option>
            <option value="NON_VEG">Non-Veg</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]">
            ▼
          </div>
        </div>
        {errors.foodPreference && (
          <p className="text-xs text-red-400 mt-1">
            {errors.foodPreference.message}
          </p>
        )}
      </div>

      {/* Amount display */}
      <div className="p-3 rounded-lg bg-[var(--accent-color)]/5 border border-[var(--border-color)]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--accent-color)]">
            Registration Fee
          </span>
          <span className="text-lg font-bold text-[var(--accent-color)]">
            ₹{REGISTRATION_PRICE}
          </span>
        </div>
      </div>

      {/* QR Code */}
      <div className="flex flex-col items-center gap-2 py-2">
        <Image
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
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
          Transaction / UTR ID
        </label>
        <input
          type="text"
          {...register("transactionId")}
          placeholder="Enter your UPI transaction ID"
          className="w-full text-base px-3 py-2.5 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-color)] focus:outline-none transition-colors"
        />
        {errors.transactionId && (
          <p className="text-xs text-red-400 mt-1">
            {errors.transactionId.message}
          </p>
        )}
      </div>

      {/* Screenshot upload */}
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">
          Payment Screenshot
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) validateAndSetFile(file);
          }}
        />

        {screenshotFile ? (
          <div className="relative p-3 rounded-lg border-2 border-[var(--border-color)] bg-[var(--accent-color)]/5">
            <div className="flex items-center gap-2">
              <ImageIcon size={16} className="text-[var(--accent-color)]" />
              <span className="text-sm text-[var(--text-primary)] truncate flex-1">
                {screenshotFile.name}
              </span>
              <button
                type="button"
                onClick={() => onScreenshotChange(null)}
                className="p-1 rounded hover:bg-red-500/10 transition-colors"
              >
                <X size={14} className="text-red-400" />
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
              size={24}
              className="mx-auto text-[var(--text-muted)] mb-2"
            />
            <p className="text-xs text-[var(--text-muted)]">
              Click or drop payment screenshot here
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">
              Max file size: 2 MB
            </p>
          </div>
        )}
        {fileError && <p className="text-xs text-red-400 mt-1">{fileError}</p>}
      </div>

      {/* Contact for queries */}
      <p className="text-[10px] text-[var(--text-muted)] text-center pt-2">
        For any queries related to registration & submission, contact{" "}
        <span className="text-[var(--text-primary)] font-medium">
          Santhoshkumar K
        </span>
        {" — "}
        <a href="tel:+918344790660" className="text-blue-400 hover:underline">
          8344790660
        </a>
      </p>
    </div>
  );
}
