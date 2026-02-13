"use client";

import { useIsMobile } from "../../hooks/useIsMobile";

const GENERAL_RULES = [
  "All participants must carry a valid college ID card for entry.",
  "Registration is mandatory for all events.",
  "Participants must report to their respective event venues at least 15 minutes before the scheduled time.",
  "Any form of malpractice or use of unauthorized materials will lead to immediate disqualification.",
  "The decision of the judges and organizing committee is final and binding.",
  "Participants must maintain discipline and decorum throughout the event.",
  "Mobile phones must be switched off or kept in silent mode during technical events.",
  "Participants are responsible for their belongings. The organizing committee is not liable for any loss.",
  "Cross-college teams are allowed only where explicitly stated in event-specific rules.",
  "All submissions (abstracts, photos, memes) must be original work. Plagiarism will result in disqualification.",
  "Event timings and venues are subject to change. Participants will be notified of any updates.",
  "Lunch and refreshments will be provided to registered participants.",
  "Certificate of participation will be provided to all registered participants.",
  "Winners will be awarded certificates and prizes during the valedictory ceremony.",
];

const CODE_OF_CONDUCT = [
  "Be respectful to fellow participants, volunteers, and organizers.",
  "Do not damage college property or infrastructure.",
  "Follow all safety guidelines provided by the organizing team.",
  "Report any issues or emergencies to the nearest volunteer or organizer.",
  "Smoking and consumption of alcohol is strictly prohibited on campus.",
];

export function RulesSection() {
  const { isMobile } = useIsMobile();

  return (
    <div className="h-full overflow-y-auto">
      <div className={`${isMobile ? "p-4" : "p-6"} max-w-3xl mx-auto`}>
        {/* Header */}
        <div className="mb-6 border-b-2 border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            General Rules & Regulations
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            GUSTO 2026 — Government College of Engineering, Erode
          </p>
        </div>

        {/* General Rules */}
        <section className="mb-8">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[var(--ph-orange)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              §
            </span>
            General Rules
          </h3>
          <ol className="space-y-2 pl-4">
            {GENERAL_RULES.map((rule, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-sm text-[var(--text-secondary)] leading-relaxed"
              >
                <span className="font-mono text-[var(--ph-orange)] font-bold flex-shrink-0 w-6 text-right">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Code of Conduct */}
        <section className="mb-8">
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[var(--ph-orange)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              ✓
            </span>
            Code of Conduct
          </h3>
          <ul className="space-y-2 pl-4 list-disc marker:text-[var(--ph-orange)]">
            {CODE_OF_CONDUCT.map((item, idx) => (
              <li
                key={idx}
                className="text-sm text-[var(--text-secondary)] leading-relaxed ml-2"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Note */}
        <div className="border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] p-4 text-sm text-[var(--text-secondary)]">
          <strong className="text-[var(--text-primary)]">Note:</strong> For
          event-specific rules, please refer to the individual event details in
          the Events section.
        </div>
      </div>
    </div>
  );
}
