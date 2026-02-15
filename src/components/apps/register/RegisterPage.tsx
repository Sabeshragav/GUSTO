"use client";

import { useState, useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";

import { useIsMobile } from "@/hooks/useIsMobile";
import { useEventValidation } from "../../../hooks/useEventValidation";
import { EVENTS, REGISTRATION_PRICE, type Event } from "../../../data/events";
import {
  getAbstractEvents,
  getSubmissionEvents,
} from "../../../data/eventValidation";

import { StepIndicator } from "./StepIndicator";
import { TeamLeaderForm } from "./TeamLeaderForm";
import { EventSelectorStep } from "./EventSelectorStep";
import { FallbackStep } from "./FallbackStep";
import { PaymentSection } from "./PaymentSection";
import { SummaryCard } from "./SummaryCard";
import { SuccessScreen } from "./SuccessScreen";

/* ─── Zod Schema ─── */
const teammateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  mobile: z
    .string()
    .min(1, "Mobile is required")
    .regex(/^\d{10}$/, "Must be 10 digits"),
  college: z.string().min(1, "College is required"),
  year: z.string().min(1, "Year is required"),
});

const registrationSchema = z.object({
  // Step 1: Details
  leaderName: z.string().min(1, "Name is required").min(2, "Min 2 characters"),
  leaderEmail: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  leaderMobile: z
    .string()
    .min(1, "Mobile is required")
    .regex(/^\d{10}$/, "Must be 10 digits"),
  leaderCollege: z.string().min(1, "College is required"),
  leaderYear: z.string().min(1, "Select a year"),

  // Step 4: Payment
  transactionId: z
    .string()
    .min(1, "Transaction ID is required")
    .min(4, "Enter a valid transaction ID"),
    
  // Food Preference
  foodPreference: z.enum(["VEG", "NON_VEG"], {
    message: "Please choose Veg or Non-Veg properly",
  }),

  // Teammates (dynamic)
  teammates: z.array(teammateSchema),

  // Virtual fields
  screenshot: z.any().optional(),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;

/* ─── Step config (4 steps) ─── */
const STEP_LABELS = ["Details", "Events", "Fallbacks", "Payment"];
const TOTAL_STEPS = 4;

interface RegisterPageProps {
  data?: unknown;
}

import { useSEO } from "@/hooks/useSEO";

export function RegisterPage({ data }: RegisterPageProps) {
  useSEO("register");
  const { isMobile } = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ─── Multi-step state ─── */
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationId, setRegistrationId] = useState("");

  /* ─── Event state ─── */
  const [selectedEvents, setSelectedEvents] = useState<Event[]>(() => {
    const d = data as { events?: Event[] } | undefined;
    return d?.events || [];
  });

  /* ─── Fallback selections for ABSTRACT events ─── */
  const [fallbackSelections, setFallbackSelections] = useState<
    Record<string, string>
  >({});

  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  /* ─── Validation hook ─── */
  const {
    counts,
    validateEvent,
    isComplete: eventsComplete,
  } = useEventValidation(selectedEvents);

  // Abstract events that need fallbacks
  const abstractEvents = getAbstractEvents(selectedEvents);

  // Submission events that need reminders
  const submissionEvents = getSubmissionEvents(selectedEvents);

  /* ─── React Hook Form ─── */
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
    mode: "onTouched",
    defaultValues: {
      leaderName: "",
      leaderEmail: "",
      leaderMobile: "",
      leaderCollege: "",
      leaderYear: "",
      transactionId: "",
      // foodPreference: "VEG", // Removed to force selection
      teammates: [],
    },
  });

  /* ─── Event toggle handler ─── */
  const handleToggleEvent = useCallback(
    (event: Event) => {
      setSelectedEvents((prev) => {
        const exists = prev.some((e) => e.id === event.id);
        if (exists) {
          // Remove fallback for this event if it was abstract
          setFallbackSelections((fb) => {
            const copy = { ...fb };
            delete copy[event.id];
            return copy;
          });
          return prev.filter((e) => e.id !== event.id);
        }
        // Validate before adding
        const validation = validateEvent(event);
        if (!validation.canSelect) return prev;
        return [...prev, event];
      });
    },
    [validateEvent],
  );

  /* ─── Fallback handler ─── */
  const handleFallbackChange = useCallback(
    (abstractEventId: string, fallbackEventId: string) => {
      setFallbackSelections((prev) => ({
        ...prev,
        [abstractEventId]: fallbackEventId,
      }));
    },
    [],
  );

  /* ─── Step navigation ─── */
  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canGoNext = useCallback(async (): Promise<boolean> => {
    switch (currentStep) {
      case 1: {
        const valid = await trigger([
          "leaderName",
          "leaderEmail",
          "leaderMobile",
          "leaderCollege",
          "leaderYear",
        ]);
        return valid;
      }
      case 2: {
        if (!eventsComplete) return false;
        return true;
      }
      case 3: {
        // Check fallbacks for abstract events
        for (const ae of abstractEvents) {
          if (!fallbackSelections[ae.id]) return false;
        }
        return true;
      }
      case 4:
        return true;
      default:
        return false;
    }
  }, [
    currentStep,
    trigger,
    eventsComplete,
    abstractEvents,
    fallbackSelections,
  ]);

  const goNext = useCallback(async () => {
    const valid = await canGoNext();
    if (!valid) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  }, [canGoNext, currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      scrollToTop();
    }
  }, [currentStep]);

  /* ─── Submit ─── */
  const onSubmit = useCallback(
    async (formData: RegistrationFormData) => {
      if (selectedEvents.length === 0) {
        setSubmitError("Events are required");
        return;
      }

      if (!screenshotFile) {
        setSubmitError("Payment screenshot is required");
        return;
      }

      const txId = formData.transactionId.trim();
      if (!txId) {
        setSubmitError("Transaction ID is required");
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const fd = new FormData();
        fd.append("name", formData.leaderName.trim());
        fd.append("email", formData.leaderEmail.trim());
        fd.append("mobile", formData.leaderMobile.trim());
        fd.append("college", formData.leaderCollege.trim());
        fd.append("year", formData.leaderYear);
        fd.append(
          "selectedEventIds",
          JSON.stringify(selectedEvents.map((e) => e.id)),
        );
        fd.append("fallbackSelections", JSON.stringify(fallbackSelections));
        fd.append("transactionId", txId);
        fd.append("foodPreference", formData.foodPreference);
        fd.append("screenshot", screenshotFile);

        // Append teammate data as JSON
        if (formData.teammates.length > 0) {
          fd.append("teammates", JSON.stringify(formData.teammates));
        }

        const response = await fetch("/api/register", {
          method: "POST",
          body: fd,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          const msg = result.detail
            ? `${result.error} ${result.detail}`
            : result.error || "Registration failed. Please try again.";
          throw new Error(msg);
        }

        setRegistrationId(result.uniqueCode || "SUBMITTED");
        setIsSuccess(true);

        window.dispatchEvent(
          new CustomEvent("gusto-achievement", {
            detail: { id: "registered-for-gusto-26" },
          }),
        );
      } catch (err) {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedEvents, screenshotFile, fallbackSelections],
  );

  const handleFormSubmit = handleSubmit(onSubmit);

  /* ─── Success screen ─── */
  if (isSuccess) {
    return (
      <SuccessScreen registrationId={registrationId} isMobile={isMobile} />
    );
  }

  /* ─── Render ─── */
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--surface-primary)]">
      {/* Step Indicator */}
      <div className="flex-shrink-0 border-b border-[var(--border-color)] bg-[var(--surface-primary)]">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
          isMobile={isMobile}
        />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === TOTAL_STEPS) {
              handleFormSubmit();
            }
          }}
          className={`p-4 space-y-4 ${
            isMobile ? "max-w-full" : "max-w-2xl mx-auto"
          }`}
        >
          {/* Submit error (shown at top) */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 px-3 py-2.5 rounded bg-red-500/10 border border-red-500/20"
              >
                <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                <p className="text-[11px] text-red-400 font-medium">
                  {submitError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary card (persistent after step 1) */}
          {currentStep >= 2 && (
            <SummaryCard selectedEvents={selectedEvents} isMobile={isMobile} />
          )}

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <TeamLeaderForm
                  register={register}
                  errors={errors}
                  isMobile={isMobile}
                />
              )}

              {currentStep === 2 && (
                <EventSelectorStep
                  selectedEvents={selectedEvents}
                  onToggleEvent={handleToggleEvent}
                  validateEvent={validateEvent}
                  counts={counts}
                  isMobile={isMobile}
                  fallbackSelections={fallbackSelections}
                  onFallbackChange={handleFallbackChange}
                  allEvents={EVENTS}
                />
              )}

              {currentStep === 3 && (
                <FallbackStep
                  abstractEvents={abstractEvents}
                  selectedEvents={selectedEvents}
                  allEvents={EVENTS}
                  fallbackSelections={fallbackSelections}
                  onFallbackChange={handleFallbackChange}
                  isMobile={isMobile}
                />
              )}

              {currentStep === 4 && (
                <PaymentSection
                  register={register}
                  errors={errors}
                  screenshotFile={screenshotFile}
                  onScreenshotChange={setScreenshotFile}
                  isMobile={isMobile}
                  hasAbstractEvents={abstractEvents.length > 0}
                  hasSubmissionEvents={submissionEvents.length > 0}
                  abstractEvents={abstractEvents}
                  submissionEvents={submissionEvents}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </form>
      </div>

      {/* Navigation buttons */}
      <div className="flex-shrink-0 border-t border-[var(--border-color)] bg-[var(--surface-primary)] px-4 py-3">
        <div
          className={`flex items-center ${
            currentStep === 1 ? "justify-end" : "justify-between"
          } ${isMobile ? "" : "max-w-2xl mx-auto"}`}
        >
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goPrev}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] text-[var(--text-primary)] rounded hover:border-[var(--text-muted)] transition-colors"
            >
              <ChevronLeft size={14} />
              Back
            </button>
          )}

          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white rounded hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleFormSubmit()}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-6 py-2 text-xs font-bold border-2 border-[var(--accent-color)] bg-[var(--accent-color)] text-white rounded hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Registration"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
