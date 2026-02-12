"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useContactSearch } from "../../hooks/useContactSearch";
import { CONTACTS, type Contact } from "../../data/contacts";
import { ContactList } from "./contact/ContactList";
import { ContactModal } from "./contact/ContactModal";
import { useAchievements } from "../../contexts/AchievementsContext";

export function ContactSection() {
  const { isMobile } = useIsMobile();
  const { query, setQuery, filteredContacts } = useContactSearch(CONTACTS);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { unlockAchievement } = useAchievements();

  // Simple alphabetical sort for filtered contacts
  const sortedContacts = [...filteredContacts].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  useEffect(() => {
    if (selectedContact) {
      // Unlock achievement if user opens a contact
      unlockAchievement("contact-explorer");
    }
  }, [selectedContact, unlockAchievement]);

  return (
    <div className="h-full flex flex-col bg-[var(--surface-bg)] relative overflow-hidden">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-[var(--surface-bg)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] leading-none">Contacts</h1>
          <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium tracking-wide opacity-80">
            {filteredContacts.length} contacts
          </p>
        </div>

        {/* Search Input */}
        <div className="relative group w-40 focus-within:w-48 transition-all duration-300">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-color)] transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[var(--surface-secondary)] text-[var(--text-primary)] text-xs pl-8 pr-3 py-2 rounded-full border border-transparent focus:border-[var(--accent-color)]/30 focus:bg-[var(--surface-primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Contact List Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin scrollbar-thumb-[var(--text-muted)]/20 scrollbar-track-transparent hover:scrollbar-thumb-[var(--accent-color)]/50 transition-colors">
        <div className="max-w-3xl mx-auto px-4 pt-2">
          <ContactList
            contacts={sortedContacts}
            onSelect={setSelectedContact}
          />
        </div>
      </div>

      {/* Modal */}
      <ContactModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </div>
  );
}
