"use client";

import { useState, useEffect, useCallback } from "react";

// ─── Types ───
interface Registration {
    id: string;
    reg_code: string;
    name: string;
    email: string;
    mobile: string;
    college: string;
    year: string;
    pass_tier: string;
    selected_events: string[];
    screenshot_url: string;
    payment_verified: boolean;
    checked_in: boolean;
    created_at: string;
    team_members: TeamMember[] | null;
    event_attendance: EventAttendance[] | null;
}

interface TeamMember {
    id: string;
    event_id: string;
    member_name: string;
    member_email: string | null;
    member_mobile: string | null;
    is_leader: boolean;
}

interface EventAttendance {
    event_id: string;
    status: string;
    marked_at: string | null;
}

interface Stats {
    total: string;
    checked_in: string;
    verified: string;
    silver: string;
    gold: string;
    diamond: string;
    platinum: string;
}

const EVENT_NAMES: Record<string, string> = {
    "paper-presentation": "Paper Presentation",
    "project-presentation": "Project Presentation",
    "code-debugging": "Code Debugging",
    "blind-coding": "Blind Coding",
    "tech-quiz": "Tech Quiz",
    "hunt-mods": "Hunt Mods",
    "meme-contest": "Meme Contest",
    photography: "Photography",
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
    btnPrimary: {
        background: "#F54E00",
        color: "#fff",
    } as React.CSSProperties,
    btnSecondary: {
        background: "#2a2b35",
        color: "#e4e4e7",
    } as React.CSSProperties,
    btnSuccess: {
        background: "#22c55e",
        color: "#fff",
    } as React.CSSProperties,
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
            <div style={{ ...styles.card, width: "100%", maxWidth: "380px", textAlign: "center" }}>
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
        { label: "Silver", value: stats.silver, color: "#94a3b8" },
        { label: "Gold", value: stats.gold, color: "#fbbf24" },
        { label: "Diamond", value: stats.diamond, color: "#60a5fa" },
        { label: "Platinum", value: stats.platinum, color: "#c084fc" },
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
                    <div style={{ fontSize: "11px", color: "#71717a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                body: JSON.stringify({ regCode: reg.reg_code }),
            });
            onRefresh();
        } catch {
            // ignore
        } finally {
            setUpdating(null);
        }
    };

    const handleEventStatus = async (eventId: string, status: string) => {
        setUpdating(eventId);
        try {
            await fetch("/api/admin/event-status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    registrationId: reg.id,
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
                        <h2 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700 }}>
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
                            {reg.reg_code}
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
                        { label: "Pass", value: reg.pass_tier },
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
                            <div style={{ fontSize: "13px", color: "#d4d4d8" }}>{item.value}</div>
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

                {/* Payment Screenshot */}
                {reg.screenshot_url && (
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
                            Payment Screenshot
                        </div>
                        <a
                            href={reg.screenshot_url}
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
                    {(reg.event_attendance || []).map((ea) => (
                        <div
                            key={ea.event_id}
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
                                {EVENT_NAMES[ea.event_id] || ea.event_id}
                            </span>
                            <div style={{ display: "flex", gap: "6px" }}>
                                {["registered", "present", "absent"].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleEventStatus(ea.event_id, status)}
                                        disabled={updating === ea.event_id}
                                        style={{
                                            ...styles.btn,
                                            padding: "3px 10px",
                                            fontSize: "11px",
                                            background:
                                                ea.status === status
                                                    ? status === "present"
                                                        ? "#22c55e"
                                                        : status === "absent"
                                                            ? "#ef4444"
                                                            : "#3b82f6"
                                                    : "#2a2b35",
                                            color: ea.status === status ? "#fff" : "#9ca3af",
                                            opacity: updating === ea.event_id ? 0.6 : 1,
                                        }}
                                    >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Team Members */}
                {reg.team_members && reg.team_members.length > 0 && (
                    <div>
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
                            Team Members
                        </div>
                        {reg.team_members.map((tm) => (
                            <div
                                key={tm.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    padding: "6px 12px",
                                    background: "#15161d",
                                    borderRadius: "6px",
                                    marginBottom: "4px",
                                    fontSize: "13px",
                                }}
                            >
                                <span style={{ color: tm.is_leader ? "#F54E00" : "#71717a" }}>
                                    {tm.is_leader ? "★" : "•"}
                                </span>
                                <span style={{ fontWeight: 500 }}>{tm.member_name}</span>
                                <span style={{ color: "#71717a", fontSize: "11px" }}>
                                    {EVENT_NAMES[tm.event_id] || tm.event_id}
                                </span>
                                {tm.member_email && (
                                    <span style={{ color: "#9ca3af", fontSize: "11px", marginLeft: "auto" }}>
                                        {tm.member_email}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
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
    const [filter, setFilter] = useState({ event: "", tier: "", checkedIn: "" });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchRegistrations = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", String(page));
            params.set("limit", "30");
            if (filter.event) params.set("event", filter.event);
            if (filter.tier) params.set("tier", filter.tier);
            if (filter.checkedIn) params.set("checkedIn", filter.checkedIn);

            const res = await fetch(`/api/admin/registrations?${params}`);
            const data = await res.json();

            if (data.success) {
                setRegistrations(data.registrations);
                setStats(data.stats);
                setTotal(data.total);
            }
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    }, [page, filter]);

    useEffect(() => {
        fetchRegistrations();
    }, [fetchRegistrations]);

    const handleSearch = async () => {
        if (!searchCode.trim()) return;
        setSearchError("");
        setSearchResult(null);

        try {
            const res = await fetch(`/api/admin/search?code=${encodeURIComponent(searchCode.trim())}`);
            const data = await res.json();

            if (data.success) {
                setSearchResult(data.registration);
            } else {
                setSearchError(data.message || "Not found");
            }
        } catch {
            setSearchError("Network error");
        }
    };

    const handleRefresh = () => {
        fetchRegistrations();
        if (searchResult) {
            // Re-fetch the selected registration
            fetch(`/api/admin/search?code=${encodeURIComponent(searchResult.reg_code)}`)
                .then((r) => r.json())
                .then((data) => {
                    if (data.success) {
                        setSearchResult(data.registration);
                        setSelectedReg(data.registration);
                    }
                });
        }
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
            <div style={{ ...styles.card, display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={{ fontSize: "18px" }}>🔍</div>
                <input
                    type="text"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by registration code (e.g. GST-A3X9K2)"
                    style={{ ...styles.input, border: "none", padding: "8px 0", fontSize: "15px", flex: 1 }}
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
                        <div style={{ fontWeight: 600, fontSize: "14px" }}>{searchResult.name}</div>
                        <div style={{ color: "#71717a", fontSize: "12px" }}>
                            {searchResult.reg_code} · {searchResult.pass_tier} · {searchResult.college}
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
                        <span style={{ color: "#71717a", fontSize: "12px" }}>Click to view →</span>
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
                    onChange={(e) => { setFilter((f) => ({ ...f, event: e.target.value })); setPage(1); }}
                    style={{ ...styles.input, width: "auto", minWidth: "160px" }}
                >
                    <option value="">All Events</option>
                    {Object.entries(EVENT_NAMES).map(([id, name]) => (
                        <option key={id} value={id}>{name}</option>
                    ))}
                </select>

                <select
                    value={filter.tier}
                    onChange={(e) => { setFilter((f) => ({ ...f, tier: e.target.value })); setPage(1); }}
                    style={{ ...styles.input, width: "auto", minWidth: "130px" }}
                >
                    <option value="">All Passes</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Platinum">Platinum</option>
                </select>

                <select
                    value={filter.checkedIn}
                    onChange={(e) => { setFilter((f) => ({ ...f, checkedIn: e.target.value })); setPage(1); }}
                    style={{ ...styles.input, width: "auto", minWidth: "140px" }}
                >
                    <option value="">All Status</option>
                    <option value="true">Checked In</option>
                    <option value="false">Not Checked In</option>
                </select>

                <span style={{ color: "#71717a", fontSize: "12px", marginLeft: "auto" }}>
                    {total} registration{total !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ ...styles.card, textAlign: "center", padding: "40px", color: "#71717a" }}>
                    Loading...
                </div>
            ) : registrations.length === 0 ? (
                <div style={{ ...styles.card, textAlign: "center", padding: "40px", color: "#71717a" }}>
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
                                <th style={styles.th}>Pass</th>
                                <th style={styles.th}>Events</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registrations.map((reg) => (
                                <tr
                                    key={reg.id}
                                    onClick={() => setSelectedReg(reg)}
                                    style={{ cursor: "pointer" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#1f2028"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                                >
                                    <td style={{ ...styles.td, fontFamily: "monospace", fontWeight: 700, color: "#F54E00", fontSize: "12px" }}>
                                        {reg.reg_code}
                                    </td>
                                    <td style={styles.td}>
                                        <div style={{ fontWeight: 500 }}>{reg.name}</div>
                                        <div style={{ color: "#71717a", fontSize: "11px" }}>{reg.email}</div>
                                    </td>
                                    <td style={{ ...styles.td, fontSize: "12px" }}>{reg.college}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background:
                                                    reg.pass_tier === "Platinum" ? "#c084fc15" :
                                                        reg.pass_tier === "Diamond" ? "#60a5fa15" :
                                                            reg.pass_tier === "Gold" ? "#fbbf2415" : "#94a3b815",
                                                color:
                                                    reg.pass_tier === "Platinum" ? "#c084fc" :
                                                        reg.pass_tier === "Diamond" ? "#60a5fa" :
                                                            reg.pass_tier === "Gold" ? "#fbbf24" : "#94a3b8",
                                            }}
                                        >
                                            {reg.pass_tier}
                                        </span>
                                    </td>
                                    <td style={{ ...styles.td, maxWidth: "180px" }}>
                                        <div style={{ display: "flex", gap: "3px", flexWrap: "wrap" }}>
                                            {reg.selected_events.map((eventId) => (
                                                <span
                                                    key={eventId}
                                                    style={{
                                                        ...styles.badge,
                                                        background: "#2a2b35",
                                                        color: "#9ca3af",
                                                        fontSize: "10px",
                                                    }}
                                                >
                                                    {EVENT_NAMES[eventId]?.split(" ")[0] || eventId}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: reg.checked_in ? "#22c55e20" : "#ef444420",
                                                color: reg.checked_in ? "#22c55e" : "#ef4444",
                                            }}
                                        >
                                            {reg.checked_in ? "✓" : "✕"}
                                        </span>
                                    </td>
                                    <td style={{ ...styles.td, color: "#71717a", fontSize: "11px", whiteSpace: "nowrap" }}>
                                        {new Date(reg.created_at).toLocaleDateString("en-IN", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {total > 30 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ ...styles.btn, ...styles.btnSecondary, opacity: page === 1 ? 0.4 : 1 }}
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
                        Page {page} of {Math.ceil(total / 30)}
                    </span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * 30 >= total}
                        style={{
                            ...styles.btn,
                            ...styles.btnSecondary,
                            opacity: page * 30 >= total ? 0.4 : 1,
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

    return authenticated ? <Dashboard /> : <LoginScreen onLogin={() => setAuthenticated(true)} />;
}
