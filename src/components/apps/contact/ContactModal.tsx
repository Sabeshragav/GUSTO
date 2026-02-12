import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';
import type { Contact } from '../../../data/contacts';

interface ContactModalProps {
    contact: Contact | null;
    onClose: () => void;
}

export function ContactModal({ contact, onClose }: ContactModalProps) {
    return (
        <AnimatePresence>
            {contact && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-sm bg-[var(--surface-primary)] border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden p-6 relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--surface-secondary)] text-[var(--text-muted)] transition-colors"
                        >
                            <X size={18} />
                        </button>

                        {/* Large Avatar */}
                        <div className="flex flex-col items-center mb-6 mt-2">
                            <div
                                className="w-24 h-24 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-3xl font-bold flex items-center justify-center bg-[var(--surface-bg)] shadow-inner mb-4 border border-[var(--accent-color)]/20"
                            >
                                {contact.initials}
                            </div>
                            <h2 className="text-xl font-bold text-[var(--text-primary)] text-center">{contact.name}</h2>
                            <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">{contact.role}</p>
                            <div className="mt-3">
                                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-1 bg-[var(--surface-secondary)] text-[var(--text-muted)] rounded-md border border-[var(--border-color)]">
                                    {contact.category}
                                </span>
                            </div>
                        </div>

                        {/* Action Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <a
                                href={`tel:${contact.phone}`}
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[var(--surface-secondary)] hover:bg-[var(--accent-color)] hover:text-white transition-all group border border-transparent hover:border-[var(--accent-color)]/50 shadow-sm hover:shadow-lg"
                            >
                                <Phone size={24} className="opacity-80 group-hover:opacity-100" />
                                <span className="text-xs font-bold">Call</span>
                            </a>

                            <a
                                href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[var(--surface-secondary)] hover:bg-[#25D366] hover:text-white transition-all group border border-transparent hover:border-[#25D366]/50 shadow-sm hover:shadow-lg"
                            >
                                <MessageCircle size={24} className="opacity-80 group-hover:opacity-100" />
                                <span className="text-xs font-bold">WhatsApp</span>
                            </a>
                        </div>

                        {/* Info Row */}
                        <div className="bg-[var(--surface-secondary)]/50 rounded-xl p-4 flex items-center justify-between border border-[var(--border-color)]">
                            <div>
                                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-wider block mb-0.5">Mobile</span>
                                <p className="text-sm font-mono font-medium text-[var(--text-primary)]">{contact.phone}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(contact.phone);
                                    alert("Copied to clipboard!");
                                }}
                                className="text-xs font-bold text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 px-3 py-1.5 rounded-md transition-colors"
                            >
                                Copy
                            </button>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
