"use client";

import React, { useState, useRef } from "react";

// Events available for on-spot registration
const TECH_EVENTS = [
  { id: "think-like-a-compiler", title: "Think Like a Compiler" },
  { id: "code-chaos", title: "Code Chaos" },
  { id: "promptx", title: "PROMPTX" },
  { id: "paper-presentation", title: "Paper Presentation" },
  { id: "project-presentation", title: "Project Presentation" },
];
const NON_TECH_EVENTS = [{ id: "icon-iq", title: "Icon IQ" }];
const MAX_EVENTS = 2;

const YEAR_OPTIONS = ["I", "II", "III", "IV", "V"];

// ─── Styles (consistent with admin page) ───
const s = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modal: {
    background: "#1a1b23",
    border: "1px solid #2a2b35",
    borderRadius: "14px",
    padding: "28px",
    maxWidth: "580px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    animation: "fadeIn 0.2s ease-out",
  },
  header: {
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#e4e4e7",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
  },
  label: {
    display: "block" as const,
    fontSize: "11px",
    color: "#71717a",
    marginBottom: "5px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#15161d",
    border: "2px solid #2a2b35",
    borderRadius: "8px",
    color: "#e4e4e7",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
    transition: "border-color 0.15s",
  },
  row: {
    display: "grid" as const,
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  field: {
    marginBottom: "14px",
  },
  btn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s",
  },
  toggle: {
    display: "flex" as const,
    borderRadius: "8px",
    overflow: "hidden" as const,
    border: "2px solid #2a2b35",
  },
  toggleBtn: (active: boolean) => ({
    flex: 1,
    padding: "10px 16px",
    border: "none",
    background: active ? "#F54E00" : "#15161d",
    color: active ? "#fff" : "#71717a",
    fontWeight: active ? 700 : 500,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.15s",
  }),
  checkbox: {
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    padding: "8px 12px",
    background: "#15161d",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#d4d4d8",
    transition: "all 0.15s",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
  },
  checkboxActive: {
    borderColor: "#F54E00",
    background: "#F54E0010",
  },
  toast: (type: "success" | "error") => ({
    padding: "10px 16px",
    borderRadius: "8px",
    background: type === "success" ? "#22c55e" : "#ef4444",
    color: "#fff",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "16px",
    display: "flex" as const,
    alignItems: "center" as const,
    gap: "8px",
    animation: "fadeIn 0.3s ease-out",
  }),
};

interface AddRegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddRegistrationModal({
  open,
  onClose,
  onSuccess,
}: AddRegistrationModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    college: "",
    year: "",
    foodPreference: "VEG",
  });
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI">("CASH");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Show feedback and scroll modal to top so it's visible
  const showFeedback = (fb: { type: "success" | "error"; message: string }) => {
    setFeedback(fb);
    modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!open) return null;

  const handleField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEvent = (eventId: string) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        return prev.filter((id) => id !== eventId);
      }
      if (prev.length >= MAX_EVENTS) return prev;
      return [...prev, eventId];
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      mobile: "",
      college: "",
      year: "",
      foodPreference: "VEG",
    });
    setSelectedEvents([]);
    setPaymentMethod("CASH");
    setTransactionId("");
    setFeedback(null);
  };

  const handleSubmit = async () => {
    // Client-side validation
    if (
      !form.name ||
      !form.email ||
      !form.mobile ||
      !form.college ||
      !form.year
    ) {
      showFeedback({
        type: "error",
        message: "All personal details are required.",
      });
      return;
    }
    if (selectedEvents.length === 0) {
      showFeedback({
        type: "error",
        message: "Please select at least one event.",
      });
      return;
    }
    if (paymentMethod === "UPI" && !transactionId.trim()) {
      showFeedback({
        type: "error",
        message: "Transaction ID is required for UPI.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/onspot-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          events: selectedEvents,
          paymentMethod,
          transactionId: paymentMethod === "UPI" ? transactionId : undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        showFeedback({
          type: "error",
          message: data.error || "Registration failed.",
        });
        return;
      }

      showFeedback({
        type: "success",
        message: `✓ Registered! Code: ${data.uniqueCode}`,
      });

      // Auto-close after short delay
      setTimeout(() => {
        resetForm();
        onSuccess();
        onClose();
      }, 1800);
    } catch {
      showFeedback({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={s.overlay} onClick={onClose}>
      <div ref={modalRef} style={s.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={s.header}>
          <h2 style={s.title}>On-Spot Registration</h2>
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            style={{
              ...s.btn,
              background: "#2a2b35",
              color: "#71717a",
              padding: "6px 10px",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div style={s.toast(feedback.type)}>
            <span>{feedback.type === "success" ? "✓" : "✕"}</span>
            {feedback.message}
          </div>
        )}

        {/* Personal Details */}
        <div style={s.field}>
          <label style={s.label}>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleField("name", e.target.value)}
            placeholder="Enter full name"
            style={s.input}
          />
        </div>

        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleField("email", e.target.value)}
              placeholder="email@example.com"
              style={s.input}
            />
          </div>
          <div style={s.field}>
            <label style={s.label}>Mobile</label>
            <input
              type="text"
              value={form.mobile}
              onChange={(e) => handleField("mobile", e.target.value)}
              placeholder="10-digit number"
              maxLength={10}
              style={s.input}
            />
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>College</label>
          <input
            type="text"
            value={form.college}
            onChange={(e) => handleField("college", e.target.value)}
            placeholder="College name"
            style={s.input}
          />
        </div>

        <div style={s.row}>
          <div style={s.field}>
            <label style={s.label}>Year of Study</label>
            <select
              value={form.year}
              onChange={(e) => handleField("year", e.target.value)}
              style={s.input}
            >
              <option value="">Select year</option>
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y} Year
                </option>
              ))}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Food Preference</label>
            <div style={s.toggle}>
              <button
                type="button"
                style={s.toggleBtn(form.foodPreference === "VEG")}
                onClick={() => handleField("foodPreference", "VEG")}
              >
                🥬 Veg
              </button>
              <button
                type="button"
                style={s.toggleBtn(form.foodPreference === "NON_VEG")}
                onClick={() => handleField("foodPreference", "NON_VEG")}
              >
                🍗 Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* Events */}
        <div style={s.field}>
          <label style={s.label}>
            Events ({selectedEvents.length} selected — max {MAX_EVENTS})
          </label>

          {/* Technical Events */}
          <div
            style={{
              fontSize: "10px",
              color: "#71717a",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Technical
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
              marginBottom: "10px",
            }}
          >
            {TECH_EVENTS.map((ev) => {
              const active = selectedEvents.includes(ev.id);
              const isDisabled = !active && selectedEvents.length >= MAX_EVENTS;
              return (
                <div
                  key={ev.id}
                  style={{
                    ...s.checkbox,
                    ...(active ? s.checkboxActive : {}),
                    ...(isDisabled
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : {}),
                  }}
                  onClick={() => !isDisabled && toggleEvent(ev.id)}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      border: active
                        ? "2px solid #F54E00"
                        : "2px solid #3f3f46",
                      background: active ? "#F54E00" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {active ? "✓" : ""}
                  </span>
                  {ev.title}
                </div>
              );
            })}
          </div>

          {/* Non-Technical Events */}
          <div
            style={{
              fontSize: "10px",
              color: "#71717a",
              fontWeight: 600,
              marginBottom: "6px",
            }}
          >
            Non-Technical
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}
          >
            {NON_TECH_EVENTS.map((ev) => {
              const active = selectedEvents.includes(ev.id);
              const isDisabled = !active && selectedEvents.length >= MAX_EVENTS;
              return (
                <div
                  key={ev.id}
                  style={{
                    ...s.checkbox,
                    ...(active ? s.checkboxActive : {}),
                    ...(isDisabled
                      ? { opacity: 0.4, cursor: "not-allowed" }
                      : {}),
                  }}
                  onClick={() => !isDisabled && toggleEvent(ev.id)}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      border: active
                        ? "2px solid #F54E00"
                        : "2px solid #3f3f46",
                      background: active ? "#F54E00" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {active ? "✓" : ""}
                  </span>
                  {ev.title}
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment */}
        <div
          style={{
            marginBottom: "20px",
            padding: "16px",
            background: "#15161d",
            borderRadius: "10px",
            border: "1px solid #2a2b35",
          }}
        >
          <label style={{ ...s.label, marginBottom: "10px" }}>
            Payment Method
          </label>
          <div
            style={{
              ...s.toggle,
              marginBottom: paymentMethod === "UPI" ? "12px" : "0",
            }}
          >
            <button
              type="button"
              style={s.toggleBtn(paymentMethod === "CASH")}
              onClick={() => setPaymentMethod("CASH")}
            >
              💵 Cash
            </button>
            <button
              type="button"
              style={s.toggleBtn(paymentMethod === "UPI")}
              onClick={() => setPaymentMethod("UPI")}
            >
              📱 UPI
            </button>
          </div>

          {paymentMethod === "UPI" && (
            <div>
              <label style={s.label}>Transaction ID</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter UPI transaction ID"
                style={s.input}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
        >
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            style={{
              ...s.btn,
              background: "#2a2b35",
              color: "#e4e4e7",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              ...s.btn,
              background: "#F54E00",
              color: "#fff",
              opacity: submitting ? 0.6 : 1,
              minWidth: "140px",
            }}
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
