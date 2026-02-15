export type EventCategory = 'Technical' | 'Non-Technical';
export type EventType = 'ABSTRACT' | 'DIRECT' | 'SUBMISSION';
export type TimeSlot = 'SLOT_1015' | 'SLOT_1100' | 'ONLINE';

export interface Event {
  id: string;
  title: string;
  type: EventCategory;
  eventType: EventType;
  date: string;
  time: string;
  venue: string;
  description: string;
  team_size: string;
  rules: string[];
  coordinators?: string[];
  image?: string;
  track: 'A' | 'B' | 'C';
  timeSlot: TimeSlot;
  submissionEmail?: string;
}

export const GUSTO_INFO = {
  name: "GUSTO '26",
  date: "2026-03-06",
  venue: "Government College of Engineering, Erode",
  department: "Information Technology",
};

export const REGISTRATION_PRICE = 250;

export const EVENTS: Event[] = [
  // ── Technical Events (ABSTRACT) ──
  {
    id: "paper-presentation",
    title: "Paper Presentation",
    type: "Technical",
    eventType: "ABSTRACT",
    date: "2026-03-06",
    time: "10:15 AM",
    venue: "Seminar Hall & HOD lab",
    description:
      "Present your innovative ideas and research work. Submit your abstract via email for shortlisting.",
    team_size: "1-3",
    rules: [
      "Solo or team (max 3).",
      "Submit abstract via email before deadline.",
      "Shortlisted papers notified via email.",
      "Oral presentation: 7–10 min.",
    ],
    track: "A",
    timeSlot: "SLOT_1015",
    submissionEmail: "subramanidhaya77@gmail.com",
  },
  {
    id: "project-presentation",
    title: "Project Presentation",
    type: "Technical",
    eventType: "ABSTRACT",
    date: "2026-03-06",
    time: "10:15 AM",
    venue: "IT Computer Lab 1",
    description:
      "Demonstrate a working project or prototype. Submit your project abstract via email for shortlisting.",
    team_size: "1-3",
    rules: [
      "Solo or team (max 3).",
      "Submit abstract via email before deadline.",
      "Bring working model and slides.",
      "Presentation: 5–10 min + live demo.",
    ],
    track: "A",
    timeSlot: "SLOT_1015",
    submissionEmail: "project.gusto26@example.com",
  },

  // ── Technical Events (DIRECT) ──
  {
    id: "think-like-a-compiler",
    title: "Think Like a Compiler",
    type: "Technical",
    eventType: "DIRECT",
    date: "2026-03-06",
    time: "10:15 AM",
    venue: "Hardware lab & IT-lab 2",
    description:
      "Analyse, interpret, and correct code with precision — approach problems from a compiler's perspective.",
    team_size: "1",
    rules: [
      "Individual event.",
      "No devices allowed.",
      "Manual code analysis only.",
      "Two rounds: Think + Flip the Code.",
      "Average time of the event is 50 mins"
    ],
    track: "B",
    timeSlot: "SLOT_1015",
  },
  {
    id: "code-chaos",
    title: "Code Chaos",
    type: "Technical",
    eventType: "DIRECT",
    date: "2026-03-06",
    time: "11:00 AM",
    venue: "IT-lab 1 & IT-lab 3",
    description:
      "A two-stage programming challenge: blind coding + hunt debugging under time pressure.",
    team_size: "1",
    rules: [
      "Individual event.",
      "Languages: C, Python, Java.",
      "Two rounds: Blind Coding + Hunt Debugging.",
      "No external assistance.",
    ],
    track: "A",
    timeSlot: "SLOT_1100",
  },
  {
    id: "promptx",
    title: "PROMPTX",
    type: "Technical",
    eventType: "DIRECT",
    date: "2026-03-06",
    time: "11:00 AM",
    venue: "AD-21 IT department ",
    description:
      "AI-based prompt engineering competition — recreate images and replicate web pages using AI tools.",
    team_size: "1",
    rules: [
      "Individual event.",
      "Two rounds: Image Recreation + Web Page Replication.",
      "Max 3 prompts per task.",
      "Bring your own laptop.",
    ],
    track: "B",
    timeSlot: "SLOT_1100",
  },

  // ── Non-Technical Events (SUBMISSION — online) ──
  {
    id: "photography",
    title: "Photography",
    type: "Non-Technical",
    eventType: "SUBMISSION",
    date: "2026-03-06",
    time: "Online Event",
    venue: "Online",
    description:
      "Capture the essence of a theme and tell a visual story through your lens. Submit via email.",
    team_size: "1",
    rules: [
      "Online event.",
      "Original photos only (no AI).",
      "One photo, 3:4 aspect ratio.",
      "Minimal editing permitted.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "photo.gusto26@example.com",
  },
  {
    id: "meme-contest",
    title: "Meme Contest",
    type: "Non-Technical",
    eventType: "SUBMISSION",
    date: "2026-03-06",
    time: "Online Event",
    venue: "Online",
    description:
      "Create original memes based on given themes — showcase creativity and humor.",
    team_size: "1",
    rules: [
      "Online event.",
      "Individual only.",
      "Based on provided themes.",
      "No adult or violent content.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "meme.gusto26@example.com",
  },
  {
    id: "short-film",
    title: "Short Film Competition",
    type: "Non-Technical",
    eventType: "SUBMISSION",
    date: "2026-03-06",
    time: "Online Event",
    venue: "Online",
    description:
      "Create a short film (20–30 min) with a meaningful message. Upload to Google Drive and share the link.",
    team_size: "1-5",
    rules: [
      "Online event.",
      "Team of 1–5 members.",
      "MP4, min 1080p, 20–30 min.",
      "English subtitles required if not in English.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "shortfilm.gusto26@example.com",
  },

  // ── Non-Technical Event (DIRECT — offline) ──
  {
    id: "icon-iq",
    title: "Icon IQ",
    type: "Non-Technical",
    eventType: "DIRECT",
    date: "2026-03-06",
    time: "TBD",
    venue: "TBD",
    description:
      "Test your visual intelligence — identify logos and connect images to tech concepts.",
    team_size: "1",
    rules: [
      "Individual event, offline.",
      "Two rounds: Logo Guessing + Connection Game.",
      "No devices allowed.",
      "Judge's decision is final.",
    ],
    track: "C",
    timeSlot: "SLOT_1015",
  },
];
