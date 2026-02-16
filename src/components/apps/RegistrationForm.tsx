"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import type { Event } from "../../data/events";
import type { Pass } from "../../data/eventValidation";
import { useIsMobile } from "../../hooks/useIsMobile";

interface RegistrationData {
  tier: Pass;
  events: Event[];
}

interface FormFields {
  name: string;
  email: string;
  mobile: string;
  college: string;
  year: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  mobile?: string;
  college?: string;
  year?: string;
  screenshot?: string;
}

const YEAR_OPTIONS = [
  { value: "", label: "Select Year" },
  { value: "1st Year", label: "1st Year" },
  { value: "2nd Year", label: "2nd Year" },
  { value: "3rd Year", label: "3rd Year" },
  { value: "4th Year", label: "4th Year" },
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile: string): boolean {
  return /^\d{10}$/.test(mobile);
}

export function RegistrationForm({ data }: { data?: unknown }) {
  const { isMobile } = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const regData = data as RegistrationData | undefined;
  const tier = regData?.tier;
  const events = useMemo(() => regData?.events ?? [], [regData]);

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    mobile: "",
    college: "",
    year: "",
  });

  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null,
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = useCallback((field: keyof FormFields, value: string) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleBlur = useCallback((field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          screenshot: "Only image files are allowed",
        }));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          screenshot: "File size must be under 2MB",
        }));
        return;
      }

      setScreenshot(file);
      setErrors((prev) => ({ ...prev, screenshot: undefined }));
      setTouched((prev) => ({ ...prev, screenshot: true }));

      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshotPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Re-request fullscreen after file picker closes (browsers exit
      // fullscreen when a file dialog opens — this is a security policy).
      setTimeout(() => {
        const el = document.documentElement;
        if (!document.fullscreenElement && el.requestFullscreen) {
          el.requestFullscreen().catch(() => { });
        }
      }, 100);
    },
    [],
  );

  // Compute validation
  const currentErrors = useMemo((): FormErrors => {
    const e: FormErrors = {};
    if (!fields.name.trim()) e.name = "Name is required";
    if (!fields.email.trim()) e.email = "Email is required";
    else if (!validateEmail(fields.email)) e.email = "Invalid email format";
    if (!fields.mobile.trim()) e.mobile = "Mobile number is required";
    else if (!validateMobile(fields.mobile))
      e.mobile = "Must be exactly 10 digits";
    if (!fields.college.trim()) e.college = "College name is required";
    if (!fields.year) e.year = "Year of study is required";
    if (!screenshot) e.screenshot = "Payment screenshot is required";
    return e;
  }, [fields, screenshot]);

  const isValid = Object.keys(currentErrors).length === 0;

  // Show error only if touched
  const getError = (field: string): string | undefined => {
    if (!touched[field]) return undefined;
    return currentErrors[field as keyof FormErrors];
  };

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      mobile: true,
      college: true,
      year: true,
      screenshot: true,
    });

    setErrors(currentErrors);
    if (!isValid || !tier) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const formData = new FormData();
      formData.append("name", fields.name.trim());
      formData.append("email", fields.email.trim());
      formData.append("mobile", fields.mobile.trim());
      formData.append("college", fields.college.trim());
      formData.append("year", fields.year);
      formData.append("tier", tier.name);
      formData.append("selectedEvents", events.map((e) => e.title).join(", "));
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      const response = await fetch("/api/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setSubmitMessage("Registration successful! 🎉");
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          result.error || "Something went wrong. Please try again.",
        );
      }
    } catch {
      setSubmitStatus("error");
      setSubmitMessage(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [currentErrors, isValid, fields, tier, events, screenshot]);

  // If no data provided
  if (!tier) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-4xl mb-3">🎟️</div>
          <p className="text-[var(--text-primary)] font-bold mb-1">
            No Tier Selected
          </p>
          <p className="text-[var(--text-muted)] text-sm">
            Please go to Events and select a tier with events first.
          </p>
        </div>
      </div>
    );
  }

  // Success screen
  if (submitStatus === "success") {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
            Registration Complete!
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-4">
            {submitMessage}
          </p>
          <div
            className="bg-[var(--surface-secondary)] border-2 border-[var(--border-color)] p-4 text-left"
            style={{ borderRadius: "6px" }}
          >
            <p className="text-xs text-[var(--text-muted)] uppercase font-bold mb-2">
              Summary
            </p>
            <p className="text-sm text-[var(--text-primary)]">
              <strong>{fields.name}</strong>
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              {tier.name} — ₹{tier.price}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {events.map((e) => e.title).join(" • ")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] focus:border-[#F54E00] focus:outline-none transition-colors placeholder:text-[var(--text-muted)]";
  const labelClass =
    "block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5";
  const errorClass = "text-[11px] text-red-400 mt-1";

  return (
    <div className="h-full overflow-y-auto">
      <div className={`mx-auto ${isMobile ? "p-4" : "p-6 max-w-2xl"}`}>
        {/* Registration Header */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            Register — GUSTO&apos;26
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="inline-block px-2.5 py-1 text-xs font-bold bg-[#F54E00]/15 text-[#F54E00] border border-[#F54E00]/30"
              style={{ borderRadius: "4px" }}
            >
              {tier.name} — ₹{tier.price}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {events.length} event{events.length !== 1 ? "s" : ""} selected
            </span>
          </div>
          {/* Selected events */}
          <div className="flex gap-1.5 flex-wrap mt-2">
            {events.map((e) => (
              <span
                key={e.id}
                className="inline-block px-2 py-0.5 text-[10px] font-bold bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                style={{ borderRadius: "3px" }}
              >
                {e.title}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div
          className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {/* Name */}
          <div>
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={fields.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="Enter your full name"
              className={inputClass}
              style={{ borderRadius: "4px" }}
            />
            {getError("name") && (
              <p className={errorClass}>{getError("name")}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={fields.email}
              onChange={(e) => handleChange("email", e.target.value)}
              onBlur={() => handleBlur("email")}
              placeholder="you@example.com"
              className={inputClass}
              style={{ borderRadius: "4px" }}
            />
            {getError("email") && (
              <p className={errorClass}>{getError("email")}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className={labelClass}>Mobile Number</label>
            <input
              type="tel"
              value={fields.mobile}
              onChange={(e) =>
                handleChange(
                  "mobile",
                  e.target.value.replace(/\D/g, "").slice(0, 10),
                )
              }
              onBlur={() => handleBlur("mobile")}
              placeholder="10-digit mobile number"
              className={inputClass}
              style={{ borderRadius: "4px" }}
            />
            {getError("mobile") && (
              <p className={errorClass}>{getError("mobile")}</p>
            )}
          </div>

          {/* College */}
          <div>
            <label className={labelClass}>College Name</label>
            <input
              type="text"
              value={fields.college}
              onChange={(e) => handleChange("college", e.target.value)}
              onBlur={() => handleBlur("college")}
              placeholder="Your college name"
              className={inputClass}
              style={{ borderRadius: "4px" }}
            />
            {getError("college") && (
              <p className={errorClass}>{getError("college")}</p>
            )}
          </div>

          {/* Year */}
          <div className={isMobile ? "" : "col-span-2"}>
            <label className={labelClass}>Year of Study</label>
            <select
              value={fields.year}
              onChange={(e) => handleChange("year", e.target.value)}
              onBlur={() => handleBlur("year")}
              className={`${inputClass} cursor-pointer`}
              style={{ borderRadius: "4px" }}
            >
              {YEAR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {getError("year") && (
              <p className={errorClass}>{getError("year")}</p>
            )}
          </div>
        </div>

        {/* QR Payment Section */}
        <div className="mt-6 border-t-2 border-[var(--border-color)] pt-6">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
            💳 Payment
          </h3>

          <div className={`${isMobile ? "" : "flex gap-6"}`}>
            {/* QR Code Image */}
            <div
              className={`flex-shrink-0 ${isMobile ? "mb-4 flex justify-center" : ""}`}
            >
              <Image
                src="/placeholder/payment_qrcode.jpeg"
                alt={`Scan QR to pay ₹${tier.price}`}
                width={176}
                height={176}
                className="w-44 h-44 object-cover border-2 border-[var(--border-color)] bg-white"
                style={{ borderRadius: "6px" }}
              />
            </div>

            {/* Upload Section */}
            <div className="flex-1">
              <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                Pay{" "}
                <strong className="text-[var(--text-primary)]">
                  ₹{tier.price}
                </strong>{" "}
                via UPI by scanning the QR code. After payment, upload a
                screenshot of the payment confirmation below.
              </p>

              <label className={labelClass}>Payment Screenshot</label>

              {/* File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-full px-3 py-3 text-xs font-bold border-2 border-dashed transition-colors ${screenshot
                    ? "border-[#F54E00] bg-[#F54E00]/5 text-[#F54E00]"
                    : "border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-muted)] hover:border-[var(--text-muted)]"
                  }`}
                style={{ borderRadius: "4px" }}
              >
                {screenshot
                  ? `✓ ${screenshot.name}`
                  : "📷 Click to upload screenshot"}
              </button>
              {getError("screenshot") && (
                <p className={errorClass}>{getError("screenshot")}</p>
              )}

              {/* Screenshot Preview */}
              {screenshotPreview && (
                <div className="mt-3 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    className="w-full max-h-48 object-contain border-2 border-[var(--border-color)] bg-[var(--surface-secondary)]"
                    style={{ borderRadius: "4px" }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setScreenshot(null);
                      setScreenshotPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs flex items-center justify-center hover:bg-red-500"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 pb-6">
          {submitStatus === "error" && (
            <div
              className="mb-3 px-3 py-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20"
              style={{ borderRadius: "4px" }}
            >
              ⚠ {submitMessage}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`w-full px-4 py-3 text-sm font-bold border-2 transition-all duration-200 active:translate-y-[1px] ${isSubmitting
                ? "bg-[var(--surface-secondary)] text-[var(--text-muted)] border-[var(--border-color)] cursor-wait"
                : "bg-[#F54E00] text-white border-[#F54E00] hover:bg-[#D64000] hover:border-[#D64000]"
              }`}
            style={{ borderRadius: "4px" }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              "Submit Registration"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
