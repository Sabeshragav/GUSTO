"use client";

import { useIsMobile } from "../../hooks/useIsMobile";

interface ContactItem {
  label: string;
  value: string;
  icon: string;
  href?: string;
}

const CONTACT_INFO: ContactItem[] = [
  {
    label: "Email",
    value: "gustoreg26gcee@gmail.com",
    icon: "✉️",
    href: "mailto:gustoreg26gcee@gmail.com",
  },
  {
    label: "Phone",
    value: "+91 98765 43210",
    icon: "📞",
    href: "tel:+919876543210",
  },
  {
    label: "Instagram",
    value: "@gusto_gcee",
    icon: "📸",
    href: "https://instagram.com/gusto_gcee",
  },
  {
    label: "Location",
    value: "Government College of Engineering, Erode, Tamil Nadu 638316",
    icon: "📍",
  },
];

const ORGANIZERS = [
  {
    name: "Dr. K. Ramasamy",
    role: "Head of Department, Information Technology",
  },
  { name: "Prof. S. Meenakshi", role: "Faculty Coordinator" },
  { name: "Rahul M.", role: "Student Coordinator" },
  { name: "Priya S.", role: "Student Coordinator" },
];

function ContactCard({ item }: { item: ContactItem }) {
  const content = (
    <div className="flex items-start gap-3 p-4 bg-[var(--surface-primary)] border-2 border-[var(--border-color)] transition-shadow hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.12)]">
      <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
      <div className="min-w-0">
        <span className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-0.5 tracking-wider">
          {item.label}
        </span>
        <span className="text-sm font-medium text-[var(--text-primary)] break-words">
          {item.value}
        </span>
      </div>
    </div>
  );

  if (item.href) {
    return (
      <a
        href={item.href}
        target={item.href.startsWith("http") ? "_blank" : undefined}
        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block no-underline"
      >
        {content}
      </a>
    );
  }

  return content;
}

export function ContactSection() {
  const { isMobile } = useIsMobile();

  return (
    <div className="h-full overflow-y-auto">
      <div className={`${isMobile ? "p-4" : "p-6"} max-w-4xl mx-auto`}>
        {/* Header */}
        <header className="mb-6 border-b-2 border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            Contact Us
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Department of Information Technology — Government College of
            Engineering, Erode
          </p>
        </header>

        {/* Contact Grid */}
        <div
          className={`grid gap-3 mb-8 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {CONTACT_INFO.map((item) => (
            <ContactCard key={item.label} item={item} />
          ))}
        </div>

        {/* Organizing Committee */}
        <section>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-[var(--ph-orange)] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
              👤
            </span>
            Organizing Committee
          </h3>

          <div
            className={`grid gap-3 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
          >
            {ORGANIZERS.map((org) => (
              <div
                key={org.name}
                className="p-3 bg-[var(--surface-primary)] border border-[var(--border-color)]"
              >
                <span className="block text-sm font-bold text-[var(--text-primary)]">
                  {org.name}
                </span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {org.role}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
