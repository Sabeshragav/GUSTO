export type ContactCategory =
    | 'Faculty Coordinator'
    | 'Student Coordinator'
    | 'Technical Head'
    | 'Non-Technical Head';

export interface Contact {
    id: string;
    name: string;
    role: string;
    phone: string;
    category: ContactCategory;
    email?: string;
    initials: string;
}

export const CONTACTS: Contact[] = [
    // Faculty
    {
        id: '1',
        name: 'Dr. K. Ramasamy',
        role: 'Head of Department',
        phone: '+91 98765 43210',
        category: 'Faculty Coordinator',
        initials: 'DR'
    },
    {
        id: '2',
        name: 'Prof. S. Meenakshi',
        role: 'Faculty Coordinator',
        phone: '+91 91234 56789',
        category: 'Faculty Coordinator',
        initials: 'SM'
    },

    // Student
    {
        id: '3',
        name: 'Rahul M.',
        role: 'Student Coordinator',
        phone: '+91 99887 76655',
        category: 'Student Coordinator',
        initials: 'RM'
    },
    {
        id: '4',
        name: 'Priya S.',
        role: 'Student Coordinator',
        phone: '+91 88776 65544',
        category: 'Student Coordinator',
        initials: 'PS'
    },
    {
        id: '9',
        name: 'Vikram R.',
        role: 'Treasurer',
        phone: '+91 97766 55443',
        category: 'Student Coordinator',
        initials: 'VR'
    },

    // Technical Heads
    {
        id: '5',
        name: 'Arun Kumar',
        role: 'Paper Presentation Head',
        phone: '+91 77665 54433',
        category: 'Technical Head',
        initials: 'AK'
    },
    {
        id: '6',
        name: 'Divya R.',
        role: 'Code Debugging Head',
        phone: '+91 66554 43322',
        category: 'Technical Head',
        initials: 'DR'
    },
    {
        id: '10',
        name: 'Sanjay K.',
        role: 'Blind Coding Head',
        phone: '+91 66443 32211',
        category: 'Technical Head',
        initials: 'SK'
    },
    {
        id: '11',
        name: 'Meera N.',
        role: 'Tech Quiz Head',
        phone: '+91 66332 21100',
        category: 'Technical Head',
        initials: 'MN'
    },

    // Non-Technical Heads
    {
        id: '7',
        name: 'Karthik V.',
        role: 'Photography Head',
        phone: '+91 55443 32211',
        category: 'Non-Technical Head',
        initials: 'KV'
    },
    {
        id: '8',
        name: 'Sneha P.',
        role: 'Meme Contest Head',
        phone: '+91 44332 21100',
        category: 'Non-Technical Head',
        initials: 'SP'
    },
    {
        id: '12',
        name: 'Rajesh T.',
        role: 'Short Film Head',
        phone: '+91 44221 10099',
        category: 'Non-Technical Head',
        initials: 'RT'
    },
];
