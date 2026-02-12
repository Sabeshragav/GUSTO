import { useState, useMemo } from 'react';
import type { Contact } from '../data/contacts';

export function useContactSearch(contacts: Contact[]) {
    const [query, setQuery] = useState('');

    // Debounce could be added if needed but memo is sufficient for local filtering
    const filteredContacts = useMemo(() => {
        if (!query) return contacts;

        const lowerQuery = query.toLowerCase().trim();
        return contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowerQuery) ||
            contact.phone.replace(/\D/g, '').includes(lowerQuery.replace(/\D/g, ''))
        );
    }, [contacts, query]);

    return { query, setQuery, filteredContacts };
}
