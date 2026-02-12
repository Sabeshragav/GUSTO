import type { Contact } from '../../../data/contacts';
import { ContactCard } from './ContactCard';

interface ContactListProps {
    contacts: Contact[];
    onSelect: (contact: Contact) => void;
}

export function ContactList({ contacts, onSelect }: ContactListProps) {
    if (contacts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)] opacity-60">
                <p className="text-sm font-medium">No contacts found</p>
            </div>
        );
    }

    // Group by category
    const grouped = contacts.reduce((acc, contact) => {
        const cat = contact.category;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(contact);
        return acc;
    }, {} as Record<string, Contact[]>);

    // Order of categories
    const order = [
        'Faculty Coordinator',
        'Student Coordinator',
        'Technical Head',
        'Non-Technical Head'
    ];

    return (
        <div className="space-y-6 pb-20">
            {order.map(category => {
                const group = grouped[category];
                if (!group || group.length === 0) return null;

                return (
                    <div key={category}>
                        <div className="sticky top-[72px] z-10 bg-[var(--surface-bg)]/95 backdrop-blur-sm py-2 px-1 mb-1 border-b border-[var(--border-color)]/50">
                            <h3 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pl-2 border-l-2 border-[var(--accent-color)]">
                                {category}
                            </h3>
                        </div>
                        <div className="space-y-1 px-1">
                            {group.map(contact => (
                                <ContactCard
                                    key={contact.id}
                                    contact={contact}
                                    onClick={() => onSelect(contact)}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
