"use client";

import { MessageCircle, Phone, Globe, Mail } from "lucide-react";

interface EventCardProps {
  event: any;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isMobile: boolean;
}

export function EventCard({
  event,
  isExpanded,
  onToggleExpand,
  isMobile,
}: EventCardProps) {
  const isTechnical = event.type === "Technical";

  const techBadge = isTechnical
    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
    : "bg-purple-500/15 text-purple-400 border border-purple-500/30";

  return (
    <div
      className={`border-2 border-[var(--border-color)] bg-[var(--surface-primary)] transition-all duration-200 flex flex-col ${!isMobile ? "hover:scale-[1.01] hover:shadow-md" : "active:scale-[0.99]"
        }`}
      style={{ borderRadius: "6px" }}
    >
      {/* Image Banner (if available) */}
      {/* {event.image && (
        <div className="h-32 w-full overflow-hidden border-b border-[var(--border-color)]">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>
      )} */}

      {/* Card Header */}
      <div className="p-4 pb-3 flex-1 flex flex-col">
        {/* Title + Type badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-bold text-[var(--text-primary)] leading-tight">
            {event.title}
          </h3>
          <span
            className={`flex-shrink-0 inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${techBadge}`}
          >
            {isTechnical ? "Tech" : "Non-Tech"}
          </span>
        </div>

        {/* Venue/Time Info Row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-muted)] font-mono">
          {event.time && (
            <span className="flex items-center gap-1">
              🕒 {event.time}
            </span>
          )}
          {event.venue && (
            <span className="flex items-center gap-1">
              📍 {event.venue}
            </span>
          )}
        </div>

        {/* Description */}
        <p
          className={`text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1 ${isExpanded ? "" : "line-clamp-3"
            }`}
        >
          {event.description}
        </p>

        {/* Actions */}
        <div className="mt-auto pt-2">
          <button
            onClick={onToggleExpand}
            className="w-full px-3 py-2 text-xs font-bold bg-[var(--surface-secondary)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-[var(--text-muted)] transition-colors active:translate-y-[1px]"
            style={{ borderRadius: "4px" }}
          >
            {isExpanded ? "Hide Details" : "View Details"}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t-2 border-[var(--border-color)] p-4 bg-[var(--surface-bg)] animate-in fade-in slide-in-from-top-2 duration-200">

          {/* Rules Section */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-2 border-b border-[var(--border-color)] pb-1 flex items-center gap-2">
              <span className="text-[var(--accent-color)]">📜</span> Rules & Guidelines
            </h4>

            {Array.isArray(event.rules) ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text-secondary)] marker:text-[var(--accent-color)]">
                {event.rules.map((rule: string, idx: number) => (
                  <li key={idx} className="leading-snug">{rule}</li>
                ))}
              </ul>
            ) : (
              <div className="space-y-4">
                {Object.entries(event.rules).map(([key, round]: [string, any]) => (
                  <div key={key} className="bg-[var(--surface-secondary)]/50 p-3 rounded border border-[var(--border-color)]">
                    <h5 className="font-bold text-xs uppercase text-[var(--text-primary)] mb-2">{round.title || key}</h5>
                    <ul className="list-disc pl-4 space-y-1 text-sm text-[var(--text-secondary)] marker:text-[var(--accent-color)]">
                      {round.rules.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coordinators Section */}
          {(event.coordinator1 || event.coordinator2) && (
            <div className="mb-4">
              <h4 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest mb-2 border-b border-[var(--border-color)] pb-1 flex items-center gap-2">
                <span className="text-[var(--accent-color)]">👥</span> Coordinators
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {[event.coordinator1, event.coordinator2, event.coordinator3].filter(Boolean).map((coord: any, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[var(--surface-secondary)] p-2 rounded border border-[var(--border-color)]">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{coord.name}</span>
                    <a href={`tel:${coord.phone}`} className="flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors">
                      <Phone size={12} /> {coord.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submission / Links */}
          {(event.submission_Email || event.registrationLink) && (
            <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex flex-col gap-2">
              {event.submission_Email && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase">{event.submission_name || "Submission"}</span>
                  <div className="flex items-center gap-2 text-sm break-all select-all">
                    <Mail size={14} className="shrink-0 text-[var(--accent-color)]" />
                    {event.submission_Email}
                  </div>
                </div>
              )}
              {event.registrationLink && event.registrationLink !== "#" && (
                <a
                  href={event.registrationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-center block w-full bg-[var(--accent-color)] text-white text-xs font-bold py-2 rounded shadow-sm hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Register for Event
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
