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
    time: "11:00 AM",
    venue: "Seminar Hall & HOD lab",
    description:
      "A platform for students to present innovative research and ideas. Evaluates understanding, originality, and presentation skills.",
    team_size: "1-3",
    rules: [
      "Submit abstract before 3rd March 2026.",
      "Shortlisted candidates notified via email (4th-5th March).",
      "Oral presentation: 7-10 minutes.",
      "On-spot registration not available.",
    ],
    track: "B",
    timeSlot: "SLOT_1100",
    submissionEmail: "subramanidhaya77@gmail.com",
  },
  {
    id: "project-presentation",
    title: "Project Presentation",
    type: "Technical",
    eventType: "ABSTRACT",
    date: "2026-03-06",
    time: "10:30 AM",
    venue: "IT Computer Lab 1",
    description:
      "Showcase technical innovation through working projects or prototypes. Explain design, implementation, and results.",
    team_size: "1-3",
    rules: [
      "Submit abstract and 5-page methodology before 3rd March 2026.",
      "Shortlisted candidates notified (4th-5th March).",
      "Bring working model and hard copy report.",
      "Presentation: 5-10 mins + live demo.",
    ],
    track: "A",
    timeSlot: "SLOT_1015",
    submissionEmail: "kavikumarbalaganesan@gmail.com",
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
      "Analyze and correct code from a compiler's perspective. Focuses on syntax accuracy and logical prediction.",
    team_size: "1",
    rules: [
      "Strictly individual event.",
      "Manual code analysis (no devices allowed).",
      "Round 1: Identify errors/logic Step-by-Step.",
      "Round 2: Rearrange shuffled code to match output.",
      "On-spot registration available.",
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
      "A two-stage challenge testing precision and debugging. Features blind coding and hunt debugging under pressure.",
    team_size: "1",
    rules: [
      "Languages: C, Python, Java.",
      "Level 1: Blind Coding (no terminal output).",
      "Level 2: Hunt Debugging (logical flaws).",
      "On-spot registration available.",
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
    time: "10:30 AM",
    venue: "AD-21 IT department",
    description:
      "AI prompt engineering competition targeting accuracy and efficiency in image and web page replication.",
    team_size: "1",
    rules: [
      "Round 1: Image Recreation (max 5 prompts).",
      "Round 2: Web Page Replication (HTML/CSS/JS only).",
      "Bring your own laptop and 2 email IDs.",
      "Manual edits are strictly prohibited.",
      "On-spot registration available.",
    ],
    track: "A",
    timeSlot: "SLOT_1015",
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
      "Tell a visual story through composition and mood. Themes include Nostalgia and Reflective Photography.",
    team_size: "1",
    rules: [
      "Original photos only (no AI or plagiarism).",
      "Aspect ratio 3:4; minimal editing permitted.",
      "Submit via email before 4th March 2026 - 3.00PM.",
      "Mention details (name, dept, college) in mail.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "gr906344@gmail.com",
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
      "Showcase humor and creativity on themes like AI tech and college life Student Struggles.",
    team_size: "1",
    rules: [
      "Themes: AI tech, College life, Job vs Entrepreneurship.",
      "Must be original and college-friendly.",
      "Submit via email before 5th March 2026 - 3.00PM.",
      "Mention details (name, dept, college) in mail.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "yoroim80@gmail.com",
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
      "Direct and showcase meaningful messages through digital cinema. Evaluated on storytelling and cinematography.",
    team_size: "1-5",
    rules: [
      "Length: 20-30 minutes; MP4 (min 1080p).",
      "English subtitles compulsory if not in English.",
      "Submit Google Drive link before 5th March 2026 - 3.00PM.",
      "Only copyright-free music allowed.",
    ],
    track: "C",
    timeSlot: "ONLINE",
    submissionEmail: "adhithyav82005@gmail.com",
  },

  // ── Non-Technical Event (DIRECT — offline) ──
  {
    id: "icon-iq",
    title: "Icon IQ",
    type: "Non-Technical",
    eventType: "DIRECT",
    date: "2026-03-06",
    time: "10:15 AM",
    venue: "AD-22 IT department",
    description:
      "A test of visual intelligence and IT awareness. Analyze logos and connect technical concepts.",
    team_size: "1",
    rules: [
      "Round 1: Logo Guessing (software/IT companies).",
      "Round 2: Connection Game (logical tech words).",
      "No devices or external assistance allowed.",
      "On-spot registration available.",
    ],
    track: "C",
    timeSlot: "SLOT_1015",
  },
];
