"use client";

import { useState, useEffect, useCallback } from "react";

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
  events: EventRegistration[];
  payment: Payment[] | null;
}

interface Stats {
  total: number;
  checked_in: number;
  payment_verified: number;
  abstracts_pending: number;
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

// ─── Login Screen ───
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

// ─── Stats Bar ───
function StatsBar({ stats }: { stats: Stats }) {
  const items = [
    { label: "Total", value: stats.total, color: "#818cf8" },
    { label: "Checked In", value: stats.checked_in, color: "#22c55e" },
    { label: "Paid ✓", value: stats.payment_verified, color: "#60a5fa" },
    {
      label: "Abstracts Pending",
      value: stats.abstracts_pending,
      color: "#fbbf24",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "12px",
        marginBottom: "20px",
      }}
    >
      {items.map((item) => (
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

// ─── Registration Detail Modal ───
function RegistrationDetail({
  reg,
  onClose,
  onRefresh,
}: {
  reg: Registration;
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleCheckin = async () => {
    setUpdating("checkin");
    try {
      await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueCode: reg.unique_code }),
      });
      onRefresh();
    } catch {
      // ignore
    } finally {
      setUpdating(null);
    }
  };

  const handleEventAttendance = async (eventId: string, status: string) => {
    setUpdating(eventId);
    try {
      await fetch("/api/admin/event-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: reg.id,
          eventId,
          status,
        }),
      });
      onRefresh();
    } catch {
      // ignore
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
      await fetch("/api/admin/abstract-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: reg.id,
          eventId,
          action,
        }),
      });
      onRefresh();
    } catch {
      // ignore
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
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
              style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700 }}
            >
              {reg.name}
            </h2>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "16px",
                fontWeight: 800,
                color: "#F54E00",
                letterSpacing: "2px",
              }}
            >
              {reg.unique_code}
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

        {/* Payment */}
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
function Dashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<Registration | null>(null);
  const [searchError, setSearchError] = useState("");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);
  const [filter, setFilter] = useState({
    event: "",
    paymentStatus: "",
    checkedIn: "",
    abstractStatus: "",
  });
  const [page, setPage] = useState(1);
  const PER_PAGE = 30;

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

      const res = await fetch(`/api/admin/registrations?${params}`);
      const data = await res.json();

      if (data.registrations) {
        setRegistrations(data.registrations);
        setStats(data.stats);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

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

  const handleSearch = async () => {
    if (!searchCode.trim()) return;
    setSearchError("");
    setSearchResult(null);

    try {
      const res = await fetch(
        `/api/admin/search?code=${encodeURIComponent(searchCode.trim())}`,
      );
      const data = await res.json();

      if (res.ok && data.user) {
        setSearchResult(mergeSearchResult(data));
      } else {
        setSearchError(data.error || "Not found");
      }
    } catch {
      setSearchError("Network error");
    }
  };

  const handleRefresh = () => {
    fetchRegistrations();
    if (searchResult) {
      fetch(
        `/api/admin/search?code=${encodeURIComponent(searchResult.unique_code)}`,
      )
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            const merged = mergeSearchResult(data);
            setSearchResult(merged);
            setSelectedReg(merged);
          }
        });
    }
  };

  // Client-side pagination
  const paginatedRegs = registrations.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );
  const totalPages = Math.ceil(registrations.length / PER_PAGE);

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
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700 }}>
            GUSTO&apos;26 Admin
          </h1>
          <p style={{ margin: 0, color: "#71717a", fontSize: "13px" }}>
            Event Management Dashboard
          </p>
        </div>
        <button
          onClick={fetchRegistrations}
          style={{ ...styles.btn, ...styles.btnSecondary }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      {stats && <StatsBar stats={stats} />}

      {/* Search Bar */}
      <div
        style={{
          ...styles.card,
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: "18px" }}>🔍</div>
        <input
          type="text"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by unique code (e.g. GST-A3X9K2)"
          style={{
            ...styles.input,
            border: "none",
            padding: "8px 0",
            fontSize: "15px",
            flex: 1,
          }}
        />
        <button
          onClick={handleSearch}
          style={{ ...styles.btn, ...styles.btnPrimary }}
        >
          Search
        </button>
      </div>

      {/* Search Result */}
      {searchError && (
        <div
          style={{
            ...styles.card,
            background: "#ef444415",
            borderColor: "#ef444430",
            color: "#ef4444",
            fontSize: "13px",
            padding: "12px 16px",
          }}
        >
          {searchError}
        </div>
      )}

      {searchResult && (
        <div
          style={{
            ...styles.card,
            background: "#22c55e10",
            borderColor: "#22c55e30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setSelectedReg(searchResult)}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>
              {searchResult.name}
            </div>
            <div style={{ color: "#71717a", fontSize: "12px" }}>
              {searchResult.unique_code} · {searchResult.college}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span
              style={{
                ...styles.badge,
                background: searchResult.checked_in ? "#22c55e20" : "#ef444420",
                color: searchResult.checked_in ? "#22c55e" : "#ef4444",
              }}
            >
              {searchResult.checked_in ? "Checked In" : "Not Checked In"}
            </span>
            <span style={{ color: "#71717a", fontSize: "12px" }}>
              Click to view →
            </span>
          </div>
        </div>
      )}

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
          style={{ color: "#71717a", fontSize: "12px", marginLeft: "auto" }}
        >
          {registrations.length} registration
          {registrations.length !== 1 ? "s" : ""}
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
          Loading...
        </div>
      ) : paginatedRegs.length === 0 ? (
        <div
          style={{
            ...styles.card,
            textAlign: "center",
            padding: "40px",
            color: "#71717a",
          }}
        >
          No registrations found.
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
              {paginatedRegs.map((reg) => {
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
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              opacity: page === 1 ? 0.4 : 1,
            }}
          >
            ← Previous
          </button>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              color: "#71717a",
              padding: "0 12px",
            }}
          >
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            style={{
              ...styles.btn,
              ...styles.btnSecondary,
              opacity: page >= totalPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
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
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div style={styles.page}>
      {authenticated ? (
        <Dashboard />
      ) : (
        <LoginScreen onLogin={() => setAuthenticated(true)} />
      )}
    </div>
  );
}
