import type { FileNode, Email } from '../types';

export const fileSystem: FileNode = {
  id: 'root',
  name: 'Desktop',
  type: 'folder',
  children: [

    {
      id: 'events-folder',
      name: 'Events',
      type: 'folder',
      children: [
        {
          id: 'technical-events',
          name: 'Technical',
          type: 'folder',
          children: [
            {
              id: 'paper-ppt',
              name: 'Paper Presentation',
              type: 'folder',
              children: [
                {
                  id: 'paper-ppt-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Paper Presentation
                  
## Description
Showcase research and technical knowledge through a formal paper presentation. Present innovative ideas and solutions to technical challenges.

## Rules
- Submit abstract during registration on or before 20th April 2025.
- Shortlisting based on quality, relevance, and originality.
- PPT must be attached as soon as possible.
- On-stage oral presentation duration: 7 to 10 minutes.
- Shortlisted authors notified via mail by 21st April 2025.

**Venue:** Main Auditorium
**Time:** 10:30 AM`,
                },
              ],
            },
            {
              id: 'project-expo',
              name: 'Project Presentation',
              type: 'folder',
              children: [
                {
                  id: 'project-expo-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Project Presentation (Exposition)

## Description
Demonstrate engineering skills by presenting a working project or prototype. Explain design process, implementation challenges, and results.

## Rules
- Upload project abstract (max 5 pages) including existing system/proposed methodology during registration.
- Must bring working project model and presentation slides.
- Presentation duration: 5-10 minutes followed by live demonstration.
- Hard copy of project report is required.
- Deadline for abstract submission: 20th April 2025.

**Venue:** IT Computer Lab 1
**Time:** 10:30 AM`,
                },
              ],
            },
            {
              id: 'code-debugging',
              name: 'Code Debugging',
              type: 'folder',
              children: [
                {
                  id: 'code-debug-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Code Debugging

## Description
Identify and fix bugs in provided code snippets. Race against time to optimize problematic code.

## Rules
- Pen and paper event; no internet or electronic devices allowed.
- Two rounds, 30 minutes each.
- Preferred languages: C/Java.
- Batches allocated based on registration.

**Venue:** IT Computer Lab 2
**Time:** 11:00 AM`,
                },
              ],
            },
            {
              id: 'blind-coding',
              name: 'Blind Coding',
              type: 'folder',
              children: [
                 {
                  id: 'blind-code-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Blind Coding

## Description
A challenging competition where participants type code and run it only once. Errors lead to immediate elimination.

## Rules
- Round 1: 15 mins (simple problem); Round 2: 15 mins (medium difficulty).
- Preferred languages: C, Python, Java.
- Programs must be run only once under supervision.
- Any runtime or compilation errors lead to instant elimination.

**Venue:** IT Computer Lab 3
**Time:** 11:00 AM`,
                },
              ],
            },
          ],
        },
        {
          id: 'non-technical-events',
          name: 'Non-Technical',
          type: 'folder',
          children: [
            {
              id: 'meme-contest',
              name: 'Meme Contest',
              type: 'folder',
              children: [
                {
                  id: 'meme-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Meme Contest

## Description
Create original memes based on provided situations (College life, student struggles, etc.).

## Rules
- Individual participation only.
- Memes must be uploaded by 20th April 2025 via email.
- Themes: Hostel life, 'That one professor', Senior advice, etc.
- No adult content or depictions of violence.

**Venue:** Online`,
                },
              ],
            },
            {
              id: 'photography',
              name: 'Photography',
              type: 'folder',
              children: [
                {
                  id: 'photo-readme',
                  name: 'Rules.md',
                  type: 'markdown',
                  content: `# Photography

## Description
Capture the essence of themes like Nature, The Color Green, or Macro photography.

## Rules
- Themes: Landscapes, Animals, Flowers, Macro, Elements of Design.
- One photo per participant; Aspect ratio 3:4.
- No AI-generated content or collages allowed.
- Upload by 20th April 2025; only minimal editing permitted.

**Venue:** Online`,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'general-info',
      name: 'General Info',
      type: 'folder',
      children: [
        {
          id: 'schedule',
          name: 'Schedule.md',
          type: 'markdown',
          content: `# GUSTO '25 Schedule

**Date:** April 23, 2025

- **09:00 AM**: Registration
- **10:00 AM**: Inauguration
- **10:30 AM**: Paper Presentation (Auditorium)
- **10:30 AM**: Project Expo (Lab 1)
- **11:00 AM**: Code Debugging (Lab 2)
- **11:00 AM**: Blind Coding (Lab 3)
- **12:20 PM**: Tech Quiz (Auditorium)
- **01:00 PM**: Lunch Break
- **02:00 PM**: Valedictory Function`,
        },
        {
          id: 'contact',
          name: 'Contact.txt',
          type: 'text',
          content: `For any queries, please contact:

gustoreg25gcee@gmail.com

Department of Information Technology
Government College of Engineering, Erode`,
        },
      ],
    },
    {
      id: 'registration-form',
      name: 'Registration.pdf',
      type: 'pdf',
      content: 'Registration Form Placeholder',
    },
  ],
};

export const emails: Email[] = [
  {
    id: 'email-1',
    from: 'Gusto \'25 Team',
    fromEmail: 'gustoreg25gcee@gmail.com',
    subject: 'Registration Confirmed: Welcome to Gusto \'25!',
    body: `Hi [Name],

Thank you for registering for Gusto '25! We are thrilled to have you join us at the Government College of Engineering, Erode on April 23rd, 2025.

Your registration ID is: GST-2025-8X92

Event Schedule:
- 09:00 AM: Check-in & Breakfast
- 10:00 AM: Opening Ceremony
- 10:30 AM: Technical Events Start
- 01:00 PM: Lunch
- 04:00 PM: Prize Distribution

Please carry a valid college ID card for entry.

See you there!
The Gusto Team`,
    date: '2025-04-10',
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
    date: '2025-04-21',
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
    date: '2025-04-22',
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
    date: '2025-04-20',
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
