import type { FileNode, Email } from '../types';

export const fileSystem: FileNode = {
  id: 'root',
  name: 'Desktop',
  type: 'folder',
  children: [
    {
      id: 'events-app',
      name: 'Events',
      type: 'app',
      icon: 'calendar',
    },
    {
      id: 'rules-app',
      name: 'Rules',
      type: 'app',
      icon: 'clipboard',
    },
    {
      id: 'contact-app',
      name: 'Contact',
      type: 'app',
      icon: 'mail',
    },
    {
      id: 'transport-app',
      name: 'Transport',
      type: 'app',
      icon: 'map',
    },
    {
      id: 'gallery-app',
      name: 'Gallery',
      type: 'app',
      icon: 'image',
    },
    {
      id: 'about-app',
      name: 'About',
      type: 'app',
      icon: 'info',
    },
    {
      id: 'youtube-app',
      name: 'YouTube',
      type: 'app',
      icon: 'youtube',
    },
    {
      id: 'register-app',
      name: 'Register',
      type: 'app',
      icon: 'clipboard', // Fallback icon in case custom mapping isn't full yet, or use 'user-plus' if supported
    },
  ],
};

export const emails: Email[] = [
  {
    id: 'email-1',
    from: 'Gusto \'25 Team',
    fromEmail: 'gustoreg25gcee@gmail.com',
    subject: 'Registration Confirmed: Welcome to Gusto \'26!',
    body: `Hi [Name],

Thank you for registering for Gusto '26! We are thrilled to have you join us at the Government College of Engineering, Erode on March 6th, 2026.

Your registration ID is: GST-2026-8X92

Event Schedule:
- 09:00 AM: Check-in & Breakfast
- 10:00 AM: Opening Ceremony
- 10:30 AM: Technical Events Start
- 01:00 PM: Lunch
- 04:00 PM: Prize Distribution

Please carry a valid college ID card for entry.

See you there!
The Gusto Team`,
    date: '2026-03-02',
    isRead: false,
    isStarred: true,
  },
  {
    id: 'email-2',
    from: 'Technical Committee',
    fromEmail: 'technical@gustogcee.in',
    subject: 'Paper Presentation: Abstract Selection Status',
    body: `Dear Participant,

We are pleased to inform you that your abstract for the Paper Presentation event has been reviewed.

Status: SHORTLISTED 

Next Steps:
1. Prepare your final presentation slides (max 15 slides).
2. Bring a soft copy on a USB drive.
3. Report to the Main Auditorium by 10:15 AM on the event day.

Good luck!
Gusto Technical Team`,
    date: '2026-03-05',
    isRead: true,
    isStarred: true,
  },
  {
    id: 'email-3',
    from: 'Event Coordinator',
    fromEmail: 'events@gustogcee.in',
    subject: 'Updates to Code Debugging Rules',
    body: `Hello Coders,

A quick update regarding the "Code Debugging" event. 

We have updated the rules to allow Python explicitly for Round 1 alongside C and Java. 
Round 2 remains language-agnostic logic debugging.

Venue: IT Computer Lab 2
Time: 11:00 AM

Sharpen your skills!
Coordinator`,
    date: '2026-03-05',
    isRead: false,
    isStarred: false,
  },
  {
    id: 'email-4',
    from: 'Photography Club',
    fromEmail: 'clicks@gustogcee.in',
    subject: 'Submission Deadline Reminder: Photography Contest',
    body: `Hey Shutterbugs! 📸

This is a reminder that the deadline for the online Photography contest is tonight at 11:59 PM.

Theme: "Campus Life" or "Nature's Palette"
Format: JPEG/PNG, max 10MB.

Don't miss out on the chance to win exciting prizes!

Submit your entries here or reply to this email.

Best,
Gusto Photography Club`,
    date: '2026-03-04',
    isRead: true,
    isStarred: false,
  },
];



export function findFileById(id: string, node: FileNode = fileSystem): FileNode | null {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findFileById(id, child);
      if (found) return found;
    }
  }
  return null;
}

export function findFileByPath(path: string): FileNode | null {
  const parts = path.split('/').filter(Boolean);
  let current: FileNode | undefined = fileSystem;

  for (const part of parts) {
    if (!current?.children) return null;
    current = current.children.find(c => c.name.toLowerCase() === part.toLowerCase());
    if (!current) return null;
  }

  return current || null;
}

export function getFilePath(id: string, node: FileNode = fileSystem, path: string[] = []): string[] | null {
  if (node.id === id) return [...path, node.name];
  if (node.children) {
    for (const child of node.children) {
      const result = getFilePath(id, child, [...path, node.name]);
      if (result) return result;
    }
  }
  return null;
}
