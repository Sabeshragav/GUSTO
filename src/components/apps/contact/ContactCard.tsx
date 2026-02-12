import { motion } from 'framer-motion';
import { Phone, User } from 'lucide-react';
import type { Contact } from '../../../data/contacts';

interface ContactCardProps {
    contact: Contact;
    onClick: () => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--surface-secondary)] active:bg-[var(--surface-secondary)] cursor-pointer group transition-colors text-left border border-transparent hover:border-[var(--border-color)]"
        >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-medium text-sm flex-shrink-0 border border-[var(--accent-color)]/20">
                {contact.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] truncate leading-tight">
                    {contact.name}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                    {contact.phone}
                </p>
            </div>

            {/* Action Icon */}
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] group-hover:bg-[var(--surface-primary)] group-hover:text-[var(--accent-color)] transition-all">
                <Phone size={14} />
            </div>
        </motion.button>
    );
}
