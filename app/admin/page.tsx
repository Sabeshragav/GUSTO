"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import * as XLSX from "xlsx";

// ─── Types ───
interface EventRegistration {
  event_id: string;
  event_title: string;
  fallback_event_id: string | null;
  fallback_event_title: string | null;
  status: string; // CONFIRMED | APPROVED | REJECTED
  attendance_status: string; // PENDING | PRESENT | ABSENT | NOT_REQUIRED
}

interface Payment {
  screenshot_url: string;
  transaction_id: string | null;
  status: string; // PENDING | VERIFIED | REJECTED
  amount: number;
}

interface Registration {
  id: string;
  name: string;
  email: string;
  mobile: string;
  college: string;
  year: string;
  unique_code: string;
  checked_in: boolean;
  check_in_time: string | null;
  created_at: string;
  food_preference?: "VEG" | "NON_VEG";
  events: EventRegistration[];
  payment: Payment[] | null;
}

interface Stats {
  total: number;
  checked_in: number;
  payment_verified: number;
  veg_count: number;
  non_veg_count: number;
  abstracts_pending: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const EVENT_NAMES: Record<string, string> = {
  "paper-presentation": "Paper Presentation",
  "project-presentation": "Project Presentation",
  "think-like-a-compiler": "Think Like a Compiler",
  "code-chaos": "Code Chaos",
  promptx: "PROMPTX",
  photography: "Photography",
  "meme-contest": "Meme Contest",
  "short-film": "Short Film",
  "icon-iq": "Icon IQ",
};

// ─── Hooks ───
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// ─── Styles ───
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f1117",
    color: "#e4e4e7",
    fontFamily: "'Inter', -apple-system, sans-serif",
  } as React.CSSProperties,
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  } as React.CSSProperties,
  card: {
    background: "#1a1b23",
    borderRadius: "10px",
    border: "1px solid #2a2b35",
    padding: "20px",
    marginBottom: "16px",
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: "10px 14px",
    background: "#1a1b23",
    border: "2px solid #2a2b35",
    borderRadius: "8px",
    color: "#e4e4e7",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box" as const,
  } as React.CSSProperties,
  btn: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s",
  } as React.CSSProperties,
  btnPrimary: { background: "#F54E00", color: "#fff" } as React.CSSProperties,
  btnSecondary: {
    background: "#2a2b35",
    color: "#e4e4e7",
  } as React.CSSProperties,
  btnSuccess: { background: "#22c55e", color: "#fff" } as React.CSSProperties,
  btnDanger: { background: "#ef4444", color: "#fff" } as React.CSSProperties,
  badge: {
    display: "inline-block",
    padding: "3px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 700,
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "13px",
  } as React.CSSProperties,
  th: {
    textAlign: "left" as const,
    padding: "10px 12px",
    borderBottom: "2px solid #2a2b35",
    color: "#9ca3af",
    fontWeight: 600,
    fontSize: "11px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid #1f2028",
    color: "#d4d4d8",
    verticalAlign: "top" as const,
  } as React.CSSProperties,
};

// ─── Toast Notification ───
interface ToastMsg {
  id: string;
  type: "success" | "error";
  message: string;
}

function Toast({ toast, onClose }: { toast: ToastMsg; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      style={{
        background: toast.type === "success" ? "#22c55e" : "#ef4444",
        color: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
        marginBottom: "10px",
        fontSize: "13px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <span>{toast.type === "success" ? "✓" : "✕"}</span>
      {toast.message}
    </div>
  );
}

// ─── Login Screen ───
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only auto-fill for convenience, but authentic source of truth is the cookie
    const saved = localStorage.getItem("admin_passkey");
    if (saved) {
      setPasskey(saved);
    }
  }, []);

  const handleLogin = async () => {
    if (!passkey.trim()) {
      setError("Please enter the admin passkey");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("admin_passkey", passkey);
        onLogin();
      } else {
        setError(data.message || "Invalid passkey");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...styles.card,
          width: "100%",
          maxWidth: "380px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔐</div>
        <h1 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700 }}>
          GUSTO&apos;26 Admin
        </h1>
        <p style={{ margin: "0 0 20px", color: "#71717a", fontSize: "13px" }}>
          Enter the admin passkey to continue
        </p>
        <input
          type="password"
          value={passkey}
          onChange={(e) => setPasskey(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          placeholder="Admin passkey"
          style={{ ...styles.input, marginBottom: "12px" }}
          autoFocus
        />
        {error && (
          <p
            style={{
              margin: "0 0 12px",
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {error}
          </p>
        )}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...styles.btn,
            ...styles.btnPrimary,
            width: "100%",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Verifying..." : "Login"}
        </button>
      </div>
    </div>
  );
}

// ─── Pagination Component ───
function Pagination({
  pagination,
  onPageChange,
}: {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const { page, totalPages, total, limit } = pagination;
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "36px",
    height: "36px",
    padding: "0 10px",
    borderRadius: "8px",
    border: "1px solid #2a2b35",
    background: "transparent",
    color: "#a1a1aa",
    fontSize: "13px",
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.15s",
  };

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        marginTop: "20px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{
            ...btnBase,
            padding: "0 14px",
            opacity: page === 1 ? 0.35 : 1,
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          ← Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              style={{
                ...btnBase,
                border: "none",
                cursor: "default",
                color: "#52525b",
              }}
            >
              ···
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                ...btnBase,
                background: p === page ? "#F54E00" : "transparent",
                color: p === page ? "#fff" : "#a1a1aa",
                borderColor: p === page ? "#F54E00" : "#2a2b35",
                fontWeight: p === page ? 700 : 500,
              }}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          style={{
            ...btnBase,
            padding: "0 14px",
            opacity: page >= totalPages ? 0.35 : 1,
            cursor: page >= totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next →
        </button>
      </div>

      <div style={{ fontSize: "12px", color: "#52525b" }}>
        Showing {from}–{to} of {total}
      </div>
    </div>
  );
}

// ─── Stats Bar ───
function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {[
        { label: "Total Registrations", value: stats.total, color: "#fff" },
        { label: "Checked In", value: stats.checked_in, color: "#22c55e" },
        {
          label: "Payments Verified",
          value: stats.payment_verified,
          color: "#a855f7",
        },
        {
          label: "Veg Count 🥬",
          value: stats.veg_count || 0,
          color: "#22c55e",
        },
        {
          label: "Non-Veg Count 🍗",
          value: stats.non_veg_count || 0,
          color: "#ef4444",
        },
      ].map((item) => (
        <div key={item.label} style={styles.card}>
          <div
            style={{
              fontSize: "24px",
              fontWeight: 800,
              color: item.color,
              marginBottom: "2px",
            }}
          >
            {item.value}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "#71717a",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={styles.card}>
          <div
            style={{
              width: "48px",
              height: "28px",
              background: "#2a2b35",
              borderRadius: "6px",
              marginBottom: "6px",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <div
            style={{
              width: "80px",
              height: "12px",
              background: "#2a2b35",
              borderRadius: "4px",
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: "0.2s",
            }}
          />
        </div>
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

// ─── Registration Detail Modal ───
function RegistrationDetail({
  reg,
  onClose,
  onRefresh,
}: {
  reg: Registration;
  onClose: () => void;
  onRefresh: () => Promise<void>;
}) {
  const [updating, setUpdating] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const addToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCheckin = async () => {
    setUpdating("checkin");
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: reg.unique_code,
          action: "checkin",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Check-in failed");

      addToast("success", "User checked in successfully");
      await onRefresh();
    } catch (err: any) {
      addToast("error", err.message || "Failed to check in");
    } finally {
      setUpdating(null);
    }
  };

  const handleEventAttendance = async (eventId: string, status: string) => {
    setUpdating(eventId);
    try {
      const res = await fetch("/api/admin/event-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: reg.id,
          eventId,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      addToast("success", "Attendance updated");
      await onRefresh();
    } catch (err: any) {
      addToast("error", err.message || "Failed to update attendance");
    } finally {
      setUpdating(null);
    }
  };

  const handleAbstractReview = async (
    eventId: string,
    action: "APPROVED" | "REJECTED",
  ) => {
    setUpdating(`abstract-${eventId}`);
    try {
      const res = await fetch("/api/admin/abstract-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: reg.id,
          eventId,
          action,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Review failed");

      addToast("success", `Abstract ${action.toLowerCase()}`);
      await onRefresh();
    } catch (err: any) {
      addToast("error", err.message || "Failed to review abstract");
    } finally {
      setUpdating(null);
    }
  };

  const handlePaymentStatus = async (status: "VERIFIED" | "REJECTED") => {
    setUpdating("payment");
    try {
      const res = await fetch("/api/admin/payment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: reg.id,
          status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment update failed");

      addToast("success", `Payment ${status.toLowerCase()}`);
      await onRefresh();
    } catch (err: any) {
      addToast("error", err.message || "Failed to update payment");
    } finally {
      setUpdating(null);
    }
  };

  const payment = reg.payment?.[0];
  const abstractEvents = reg.events.filter((e) =>
    ["paper-presentation", "project-presentation"].includes(e.event_id),
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.card,
          maxWidth: "650px",
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          margin: 0,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toast Container */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            left: "20px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2
              style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}
            >
              {reg.name}
            </h2>
            <div style={{ color: "#a1a1aa", fontSize: "13px" }}>
              {reg.email} · {reg.mobile}
            </div>
            <div
              style={{ color: "#71717a", fontSize: "12px", marginTop: "2px" }}
            >
              {reg.college} · {reg.year}
            </div>
            {reg.food_preference && (
              <div
                style={{
                  marginTop: "6px",
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "11px",
                  fontWeight: 600,
                  backgroundColor:
                    reg.food_preference === "VEG" ? "#22c55e20" : "#ef444420",
                  color: reg.food_preference === "VEG" ? "#22c55e" : "#ef4444",
                  border: `1px solid ${reg.food_preference === "VEG" ? "#22c55e40" : "#ef444440"}`,
                }}
              >
                Food: {reg.food_preference === "VEG" ? "Veg 🥬" : "Non-Veg 🍗"}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#fff",
                letterSpacing: "1px",
              }}
            >
              {reg.unique_code}
            </div>
            <div style={{ fontSize: "11px", color: "#71717a" }}>
              Registered on {new Date(reg.created_at).toLocaleDateString()}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              padding: "6px 12px",
              fontSize: "12px",
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          {[
            { label: "Email", value: reg.email },
            { label: "Mobile", value: reg.mobile },
            { label: "College", value: reg.college },
            { label: "Year", value: reg.year },
            { label: "Fee", value: "₹250" },
            {
              label: "Registered",
              value: new Date(reg.created_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  fontSize: "10px",
                  color: "#71717a",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "13px", color: "#d4d4d8" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Check-in */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
            padding: "12px",
            background: reg.checked_in ? "#22c55e15" : "#F54E0015",
            borderRadius: "8px",
            border: `1px solid ${reg.checked_in ? "#22c55e30" : "#F54E0030"}`,
          }}
        >
          <span
            style={{
              ...styles.badge,
              background: reg.checked_in ? "#22c55e20" : "#ef444420",
              color: reg.checked_in ? "#22c55e" : "#ef4444",
              fontSize: "12px",
              padding: "4px 10px",
            }}
          >
            {reg.checked_in ? "✓ Checked In" : "Not Checked In"}
          </span>
          {reg.check_in_time && (
            <span style={{ fontSize: "11px", color: "#71717a" }}>
              {new Date(reg.check_in_time).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          {!reg.checked_in && (
            <button
              onClick={handleCheckin}
              disabled={updating === "checkin"}
              style={{
                ...styles.btn,
                ...styles.btnSuccess,
                padding: "6px 14px",
                fontSize: "12px",
                opacity: updating === "checkin" ? 0.6 : 1,
              }}
            >
              {updating === "checkin" ? "..." : "Check In Now"}
            </button>
          )}
        </div>

        {payment && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#71717a",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "6px",
              }}
            >
              Payment (₹{payment.amount})
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  ...styles.badge,
                  background:
                    payment.status === "VERIFIED"
                      ? "#22c55e20"
                      : payment.status === "REJECTED"
                        ? "#ef444420"
                        : "#fbbf2420",
                  color:
                    payment.status === "VERIFIED"
                      ? "#22c55e"
                      : payment.status === "REJECTED"
                        ? "#ef4444"
                        : "#fbbf24",
                }}
              >
                {payment.status}
              </span>
              {payment.transaction_id && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#9ca3af",
                    fontFamily: "monospace",
                  }}
                >
                  TxnID: {payment.transaction_id}
                </span>
              )}
              {payment.screenshot_url && (
                <a
                  href={payment.screenshot_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#60a5fa",
                    fontSize: "12px",
                    textDecoration: "underline",
                  }}
                >
                  View Screenshot ↗
                </a>
              )}
            </div>

            {/* Payment Actions */}
            {payment.status !== "VERIFIED" && (
              <div style={{ display: "flex", gap: "8px" }}>
                {payment.status !== "VERIFIED" && (
                  <button
                    onClick={() => handlePaymentStatus("VERIFIED")}
                    disabled={updating === "payment"}
                    style={{
                      ...styles.btn,
                      ...styles.btnSuccess,
                      padding: "4px 12px",
                      fontSize: "11px",
                      opacity: updating === "payment" ? 0.6 : 1,
                    }}
                  >
                    {updating === "payment" ? "..." : "Verify Payment"}
                  </button>
                )}
                {payment.status !== "REJECTED" && (
                  <button
                    onClick={() => handlePaymentStatus("REJECTED")}
                    disabled={updating === "payment"}
                    style={{
                      ...styles.btn,
                      ...styles.btnDanger,
                      padding: "4px 12px",
                      fontSize: "11px",
                      opacity: updating === "payment" ? 0.6 : 1,
                    }}
                  >
                    {updating === "payment" ? "..." : "Reject Payment"}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Abstract Review */}
        {abstractEvents.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                fontSize: "10px",
                color: "#71717a",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "8px",
              }}
            >
              Abstract Review
            </div>
            {abstractEvents.map((ae) => (
              <div
                key={ae.event_id}
                style={{
                  padding: "10px 12px",
                  background: "#15161d",
                  borderRadius: "6px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>
                    {ae.event_title}
                  </span>
                  <span
                    style={{
                      ...styles.badge,
                      background:
                        ae.status === "APPROVED"
                          ? "#22c55e20"
                          : ae.status === "REJECTED"
                            ? "#ef444420"
                            : "#fbbf2420",
                      color:
                        ae.status === "APPROVED"
                          ? "#22c55e"
                          : ae.status === "REJECTED"
                            ? "#ef4444"
                            : "#fbbf24",
                    }}
                  >
                    {ae.status}
                  </span>
                </div>
                {ae.fallback_event_title && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#71717a",
                      marginBottom: "6px",
                    }}
                  >
                    Fallback: {ae.fallback_event_title}
                  </div>
                )}
                {ae.status === "CONFIRMED" && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      onClick={() =>
                        handleAbstractReview(ae.event_id, "APPROVED")
                      }
                      disabled={updating === `abstract-${ae.event_id}`}
                      style={{
                        ...styles.btn,
                        ...styles.btnSuccess,
                        padding: "4px 12px",
                        fontSize: "11px",
                        opacity:
                          updating === `abstract-${ae.event_id}` ? 0.6 : 1,
                      }}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleAbstractReview(ae.event_id, "REJECTED")
                      }
                      disabled={updating === `abstract-${ae.event_id}`}
                      style={{
                        ...styles.btn,
                        ...styles.btnDanger,
                        padding: "4px 12px",
                        fontSize: "11px",
                        opacity:
                          updating === `abstract-${ae.event_id}` ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Event Attendance */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontSize: "10px",
              color: "#71717a",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Event Attendance
          </div>
          {reg.events.map((ev) => (
            <div
              key={ev.event_id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                background: "#15161d",
                borderRadius: "6px",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 500 }}>
                {ev.event_title}
              </span>
              <div style={{ display: "flex", gap: "6px" }}>
                {(["PENDING", "PRESENT", "ABSENT"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleEventAttendance(ev.event_id, status)}
                    disabled={updating === ev.event_id}
                    style={{
                      ...styles.btn,
                      padding: "3px 10px",
                      fontSize: "11px",
                      background:
                        ev.attendance_status === status
                          ? status === "PRESENT"
                            ? "#22c55e"
                            : status === "ABSENT"
                              ? "#ef4444"
                              : "#3b82f6"
                          : "#2a2b35",
                      color:
                        ev.attendance_status === status ? "#fff" : "#9ca3af",
                      opacity: updating === ev.event_id ? 0.6 : 1,
                    }}
                  >
                    {status.charAt(0) + status.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ───
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions] = useState<Registration[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Search Effect
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `/api/admin/search?q=${encodeURIComponent(debouncedSearch)}`,
        );
        const data = await res.json();
        if (data.results) {
          setSuggestions(data.results);
          setShowSuggestions(true);
        }
      } catch {
        // ignore
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  const selectUser = async (uniqueCode: string) => {
    setShowSuggestions(false);
    setSearchQuery("");
    try {
      const res = await fetch(
        `/api/admin/search?code=${encodeURIComponent(uniqueCode)}`,
      );
      const data = await res.json();
      if (data.user) {
        const merged = mergeSearchResult(data);
        setSelectedReg(merged);
      }
    } catch {
      // err
    }
  };

  // Initialize filter, page, and limit from URL params
  const [filter, setFilter] = useState({
    event: searchParams.get("event") || "",
    paymentStatus: searchParams.get("paymentStatus") || "",
    checkedIn: searchParams.get("checkedIn") || "",
    abstractStatus: searchParams.get("abstractStatus") || "",
  });
  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    return isNaN(p) || p < 1 ? 1 : p;
  });
  const [limit, setLimit] = useState(() => {
    const l = parseInt(searchParams.get("limit") || "10", 10);
    return [10, 15, 20, 50].includes(l) ? l : 10;
  });

  // Sync URL without a separate effect (avoids double-render from router.replace)
  const syncUrl = useCallback(
    (f: typeof filter, p: number, l: number) => {
      const params = new URLSearchParams();
      if (f.event) params.set("event", f.event);
      if (f.paymentStatus) params.set("paymentStatus", f.paymentStatus);
      if (f.checkedIn) params.set("checkedIn", f.checkedIn);
      if (f.abstractStatus) params.set("abstractStatus", f.abstractStatus);
      if (p > 1) params.set("page", String(p));
      if (l !== 10) params.set("limit", String(l));
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router],
  );

  // Fetch stats separately (only on mount / manual refresh)
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.stats) setStats(data.stats);
    } catch {
      // ignore
    }
  }, []);

  const fetchRegistrations = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.event) params.set("event", filter.event);
      if (filter.paymentStatus)
        params.set("paymentStatus", filter.paymentStatus);
      if (filter.checkedIn) params.set("checkedIn", filter.checkedIn);
      if (filter.abstractStatus)
        params.set("abstractStatus", filter.abstractStatus);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/admin/registrations?${params}`);
      const data = await res.json();

      if (data.registrations) {
        setRegistrations(data.registrations);
        setPaginationMeta(data.pagination);
        return data.registrations as Registration[];
      }
      return [];
    } catch {
      // ignore
      return [];
    } finally {
      setLoading(false);
    }
  }, [
    filter.event,
    filter.paymentStatus,
    filter.checkedIn,
    filter.abstractStatus,
    page,
    limit,
  ]);

  const handleExport = async () => {
    setExportDialogOpen(false);
    setExporting(true);
    try {
      // Fetch ALL registrations from the database (no pagination)
      const res = await fetch(`/api/admin/registrations?page=1&limit=10000`);
      const result = await res.json();
      const allRegs: Registration[] = result.registrations || [];

      if (allRegs.length === 0) return;

      const data = allRegs.map((reg) => {
        const payment = reg.payment?.[0];
        const eventNames = reg.events.map((e) => e.event_title).join(", ");

        return {
          "Unique Code": reg.unique_code,
          Name: reg.name,
          Email: reg.email,
          Mobile: reg.mobile,
          College: reg.college,
          Year: reg.year,
          "Food Preference":
            reg.food_preference === "VEG"
              ? "Veg"
              : reg.food_preference === "NON_VEG"
                ? "Non-Veg"
                : "",
          "Checked In": reg.checked_in ? "Yes" : "No",
          "Check In Time": reg.check_in_time
            ? new Date(reg.check_in_time).toLocaleString()
            : "",
          "Payment Status": payment?.status || "N/A",
          Amount: payment?.amount || 0,
          "Transaction ID": payment?.transaction_id || "",
          Events: eventNames,
          "Registered At": new Date(reg.created_at).toLocaleString(),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

      const now = new Date();
      const timestamp = now
        .toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/[\/\,\s\:]/g, "-")
        .replace(/--/g, "_");

      XLSX.writeFile(workbook, `GUSTO26_Registrations_${timestamp}.xlsx`);
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  // Fetch stats once on mount
  const statsFetched = useRef(false);
  useEffect(() => {
    if (!statsFetched.current) {
      statsFetched.current = true;
      fetchStats();
    }
  }, [fetchStats]);

  // Fetch registrations and sync URL when deps change
  // Track the callback reference so StrictMode's duplicate mount-effect is skipped
  const isInitialMount = useRef(true);
  const prevFetchRef = useRef<typeof fetchRegistrations | null>(null);
  useEffect(() => {
    // Skip if same reference (StrictMode re-run on mount)
    if (prevFetchRef.current === fetchRegistrations) return;
    prevFetchRef.current = fetchRegistrations;

    fetchRegistrations();

    // Sync URL (skip on initial mount to avoid double-render)
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      syncUrl(filter, page, limit);
    }
  }, [fetchRegistrations]); // eslint-disable-line react-hooks/exhaustive-deps

  const mergeSearchResult = (data: {
    user: Record<string, unknown>;
    events: EventRegistration[];
    payment: Payment | null;
  }): Registration =>
    ({
      ...data.user,
      events: data.events || [],
      payment: data.payment ? [data.payment] : null,
    }) as unknown as Registration;

  const handleRefresh = async () => {
    // 1. Re-fetch stats and table
    fetchStats();
    const newRegs = await fetchRegistrations();

    // 2. If we have a selected registration, we must update it
    if (selectedReg) {
      // Try to find it in the new list first (saves a network call)
      const found = newRegs?.find((r) => r.id === selectedReg.id);

      if (found) {
        setSelectedReg(found);
      } else {
        // If not found (maybe pagination?), re-fetch individual
        try {
          const r = await fetch(
            `/api/admin/search?code=${encodeURIComponent(selectedReg.unique_code)}`,
          );
          const data = await r.json();
          if (data.user) {
            const merged = mergeSearchResult(data);
            setSelectedReg(merged);
          }
        } catch {
          // ignore
        }
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>
          Admin Dashboard
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleRefresh}
            style={{ ...styles.btn, ...styles.btnSecondary }}
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setExportDialogOpen(true)}
            disabled={exporting}
            style={{
              ...styles.btn,
              background: "#22c55e",
              color: "white",
              opacity: exporting ? 0.6 : 1,
            }}
          >
            {exporting ? "⏳ Exporting..." : "↓ Export Excel"}
          </button>
          <button
            onClick={onLogout}
            style={{ ...styles.btn, ...styles.btnDanger }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Export Confirmation Dialog */}
      {exportDialogOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setExportDialogOpen(false)}
        >
          <div
            style={{
              background: "#1a1b23",
              border: "1px solid #2a2b35",
              borderRadius: "12px",
              padding: "24px",
              maxWidth: "420px",
              width: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{ margin: "0 0 8px", fontSize: "16px", fontWeight: 600 }}
            >
              Export All Registrations
            </h3>
            <p
              style={{
                margin: "0 0 20px",
                fontSize: "13px",
                color: "#9ca3af",
                lineHeight: 1.5,
              }}
            >
              This will fetch{" "}
              <strong style={{ color: "#e5e7eb" }}>all registrations</strong>{" "}
              from the database and download them as an Excel file. This may
              take a moment.
            </p>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setExportDialogOpen(false)}
                style={{ ...styles.btn, ...styles.btnSecondary }}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                style={{ ...styles.btn, background: "#22c55e", color: "white" }}
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Stats */}
      {stats ? <StatsBar stats={stats} /> : <StatsSkeleton />}

      <div
        style={{
          ...styles.card,
          position: "relative",
          zIndex: 50,
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <div style={{ fontSize: "18px" }}>🔍</div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, mobile or code..."
            style={{
              ...styles.input,
              border: "none",
              padding: "8px 0",
              fontSize: "15px",
              flex: 1,
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#1f2028",
              border: "1px solid #2a2b35",
              borderRadius: "0 0 8px 8px",
              marginTop: "4px",
              maxHeight: "300px",
              overflowY: "auto",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
            }}
          >
            {suggestions.map((s) => (
              <div
                key={s.id}
                onClick={() => selectUser(s.unique_code)}
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid #2a2b35",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#2a2b35")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: "14px" }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#71717a" }}>
                    {s.email} · {s.unique_code}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: s.checked_in ? "#22c55e" : "#ef4444",
                  }}
                >
                  {s.checked_in ? "Checked In" : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remove old search result UI since we use modal now */}
      {/* Search Result - REMOVED */}

      {/* Search Result */}

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "16px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          value={filter.event}
          onChange={(e) => {
            setFilter((f) => ({ ...f, event: e.target.value }));
            setPage(1);
          }}
          style={{ ...styles.input, width: "auto", minWidth: "160px" }}
        >
          <option value="">All Events</option>
          {Object.entries(EVENT_NAMES).map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={filter.paymentStatus}
          onChange={(e) => {
            setFilter((f) => ({ ...f, paymentStatus: e.target.value }));
            setPage(1);
          }}
          style={{ ...styles.input, width: "auto", minWidth: "130px" }}
        >
          <option value="">All Payments</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <select
          value={filter.checkedIn}
          onChange={(e) => {
            setFilter((f) => ({ ...f, checkedIn: e.target.value }));
            setPage(1);
          }}
          style={{ ...styles.input, width: "auto", minWidth: "140px" }}
        >
          <option value="">All Check-in</option>
          <option value="true">Checked In</option>
          <option value="false">Not Checked In</option>
        </select>

        <select
          value={filter.abstractStatus}
          onChange={(e) => {
            setFilter((f) => ({ ...f, abstractStatus: e.target.value }));
            setPage(1);
          }}
          style={{ ...styles.input, width: "auto", minWidth: "140px" }}
        >
          <option value="">All Abstracts</option>
          <option value="CONFIRMED">Pending Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>

        <span
          style={{
            color: "#71717a",
            fontSize: "12px",
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span>
            {paginationMeta ? paginationMeta.total : registrations.length}{" "}
            registration
            {(paginationMeta ? paginationMeta.total : registrations.length) !==
            1
              ? "s"
              : ""}
          </span>
          <select
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
            style={{
              ...styles.input,
              width: "auto",
              minWidth: "80px",
              padding: "4px 8px",
              fontSize: "12px",
            }}
          >
            {[10, 15, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: "40px",
            color: "#71717a",
          }}
        >
          Hang tight ra coordinators...
        </div>
      ) : registrations.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: "40px",
            color: "#71717a",
          }}
        >
          No registrations found ra coordinators...
        </div>
      ) : (
        <div style={{ ...styles.card, padding: 0, overflow: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Code</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>College</th>
                <th style={styles.th}>Events</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Check-in</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => {
                const payment = reg.payment?.[0];
                return (
                  <tr
                    key={reg.id}
                    onClick={() => setSelectedReg(reg)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "#1f2028";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                    }}
                  >
                    <td
                      style={{
                        ...styles.td,
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: "#F54E00",
                        fontSize: "12px",
                      }}
                    >
                      {reg.unique_code}
                    </td>
                    <td style={styles.td}>
                      <div style={{ fontWeight: 500 }}>{reg.name}</div>
                      <div style={{ color: "#71717a", fontSize: "11px" }}>
                        {reg.email}
                      </div>
                    </td>
                    <td style={{ ...styles.td, fontSize: "12px" }}>
                      {reg.college}
                    </td>
                    <td style={{ ...styles.td, maxWidth: "200px" }}>
                      <div
                        style={{
                          display: "flex",
                          gap: "3px",
                          flexWrap: "wrap",
                        }}
                      >
                        {reg.events.map((ev) => (
                          <span
                            key={ev.event_id}
                            style={{
                              ...styles.badge,
                              background: "#2a2b35",
                              color: "#9ca3af",
                              fontSize: "10px",
                            }}
                          >
                            {
                              (
                                ev.event_title ||
                                EVENT_NAMES[ev.event_id] ||
                                ev.event_id
                              ).split(" ")[0]
                            }
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            payment?.status === "VERIFIED"
                              ? "#22c55e20"
                              : "#fbbf2420",
                          color:
                            payment?.status === "VERIFIED"
                              ? "#22c55e"
                              : "#fbbf24",
                        }}
                      >
                        {payment?.status || "N/A"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background: reg.checked_in
                            ? "#22c55e20"
                            : "#ef444420",
                          color: reg.checked_in ? "#22c55e" : "#ef4444",
                        }}
                      >
                        {reg.checked_in ? "✓" : "✕"}
                      </span>
                    </td>
                    <td
                      style={{
                        ...styles.td,
                        color: "#71717a",
                        fontSize: "11px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {new Date(reg.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {paginationMeta && (
        <Pagination
          pagination={paginationMeta}
          onPageChange={handlePageChange}
        />
      )}

      {/* Detail Modal */}
      {selectedReg && (
        <RegistrationDetail
          reg={selectedReg}
          onClose={() => setSelectedReg(null)}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
}

// ─── Main Page ───
// ─── Main Page ───
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if session cookie is valid
    fetch("/api/admin/me")
      .then((res) => {
        if (res.ok) {
          setAuthenticated(true);
        }
      })
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div
        style={{
          ...styles.page,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#71717a" }}>
          Verifying session ra coordinators...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {authenticated ? (
        <Suspense
          fallback={<div style={{ padding: 20 }}>Loading dashboard...</div>}
        >
          <Dashboard
            onLogout={() => {
              localStorage.removeItem("admin_passkey");
              setAuthenticated(false);
            }}
          />
        </Suspense>
      ) : (
        <LoginScreen onLogin={() => setAuthenticated(true)} />
      )}
    </div>
  );
}
