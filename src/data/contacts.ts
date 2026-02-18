export interface Contact {
    id: string;
    name: string;
    role: string;
    phone: string;
    category: string;
    initials: string;
}

const rawContacts = [
    // Secretary
    {
        "name": "SANTHAKUMARAN C",
        "role": "Secretary",
        "phone": "+91 9626202811",
        "category": "Secretary"
    },
    {
        "name": "SORNA MALLIKA M",
        "role": "Secretary",
        "phone": "+91 8015754245",
        "category": "Secretary"
    },
    // Registration Coordinators
    {
        "name": "MURUGANANTHAM R",
        "role": "Registration Coordinator",
        "phone": "+91 7418024057",
        "category": "registration"
    },
    {
        "name": "MAHADHARSHINI P",
        "role": "Registration Coordinator",
        "phone": "+91 8122720771",
        "category": "registration"
    }
];

export const CONTACTS: Contact[] = rawContacts.map((c, i) => ({
    ...c,
    id: String(i + 1),
    initials: c.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
}));
