"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Image as ImageIcon,
  QrCode,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { RegistrationFormData } from "./RegisterPage";

interface PaymentSectionProps {
  register: UseFormRegister<RegistrationFormData>;
  errors: FieldErrors<RegistrationFormData>;
  screenshotFile: File | null;
  onScreenshotChange: (file: File | null) => void;
  isMobile: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export function PaymentSection({
  register,
  errors,
  screenshotFile,
  onScreenshotChange,
  isMobile,
}: PaymentSectionProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] rounded focus:outline-none focus:border-[var(--accent-color)] transition-colors placeholder:text-[var(--text-muted)]";

  const handleFile = useCallback(
    (file: File | null) => {
      setFileError(null);

      if (!file) {
        onScreenshotChange(null);
        setPreview(null);
        return;
      }

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError("Only JPG, JPEG or PNG files are accepted");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError("File must be under 5MB");
        return;
      }

      onScreenshotChange(file);

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onScreenshotChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0] || null;
      handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleRemove = useCallback(() => {
    onScreenshotChange(null);
    setPreview(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onScreenshotChange]);

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-[var(--border-color)]">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          💳 Payment
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
          Scan the QR code, pay, and upload the screenshot
        </p>
      </div>

      {/* QR Code Placeholder */}
      <div className="flex flex-col items-center p-6 rounded border-2 border-dashed border-[var(--border-color)] bg-[var(--surface-secondary)]">
        <div className="w-48 h-48 rounded-lg border-2 border-[var(--border-color)] bg-[var(--surface-primary)] flex flex-col items-center justify-center gap-3">
          <QrCode size={48} className="text-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-muted)] font-medium text-center px-4">
            Payment QR will be displayed here
          </span>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-3">
          Scan and pay the exact amount shown in the summary
        </p>
      </div>

      {/* Transaction ID */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">
          <CreditCard size={12} className="inline mr-1.5" />
          Transaction ID / UTR
        </label>
        <input
          {...register("transactionId")}
          placeholder="Enter your transaction ID"
          className={inputClass}
        />
        {errors.transactionId && (
          <p className="text-[11px] text-red-400 font-medium">
            {errors.transactionId.message}
          </p>
        )}
      </div>

      {/* Screenshot Upload */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wide">
          <ImageIcon size={12} className="inline mr-1.5" />
          Payment Screenshot
        </label>

        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-6 rounded border-2 border-dashed cursor-pointer transition-colors ${
              isDragOver
                ? "border-[var(--accent-color)] bg-[var(--accent-color)]/5"
                : "border-[var(--border-color)] bg-[var(--surface-secondary)] hover:border-[var(--text-muted)]"
            }`}
          >
            <Upload
              size={24}
              className={
                isDragOver
                  ? "text-[var(--accent-color)]"
                  : "text-[var(--text-muted)]"
              }
            />
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {isDragOver
                ? "Drop your screenshot here"
                : "Click or drag to upload screenshot"}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-1">
              JPG, JPEG, PNG • Max 5MB
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] p-2"
          >
            <div className="flex items-start gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Payment screenshot preview"
                className="w-20 h-20 object-cover rounded border border-[var(--border-color)]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                  <CheckCircle size={12} />
                  <span>Screenshot uploaded</span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 truncate">
                  {screenshotFile?.name}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">
                  {screenshotFile
                    ? `${(screenshotFile.size / 1024).toFixed(1)} KB`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 rounded hover:bg-red-500/10 text-red-400 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="hidden"
        />

        {/* File error */}
        <AnimatePresence>
          {(fileError || errors.screenshot) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-1.5 text-[11px] text-red-400 font-medium"
            >
              <AlertCircle size={11} />
              <span>{fileError || (errors.screenshot?.message as string)}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
