export interface Event {
  id: string;
  title: string;
  type: 'Technical' | 'Non-Technical' | 'Workshop' | 'Other';
  date: string;
  time: string;
  venue: string;
  description: string;
  team_size: string;
  fee: string;
  rules: string[];
  coordinators?: string[];
  image?: string;
}

export const GUSTO_INFO = {
  name: "GUSTO '26",
  date: "2026-03-06",
  venue: "Government College of Engineering, Erode",
  department: "Information Technology",
  contactRequest: "gustogcee@gmail.com"
};

export const EVENTS: Event[] = [
  {
    id: "paper-presentation",
    title: "Paper Presentation",
    type: "Technical",
    date: "2026-03-07",
    time: "10:30 AM",
    venue: "Main Auditorium",
    description: "Showcase research and technical knowledge through a formal paper presentation. Present innovative ideas and solutions to technical challenges.",
    team_size: "Solo or team of 2-3",
    fee: "Free",
    rules: [
      "Submit abstract during registration on or before 1st March 2026.",
      "Shortlisting based on quality, relevance, and originality.",
      "PPT must be attached as soon as possible.",
      "On-stage oral presentation duration: 7 to 10 minutes.",
      "Shortlisted authors notified via mail by 3rd March 2026."
    ]
  },
  {
    id: "project-presentation",
    title: "Project Presentation (Exposition)",
    type: "Technical",
    date: "2026-03-07",
    time: "10:30 AM",
    venue: "IT Computer Lab 1",
    description: "Demonstrate engineering skills by presenting a working project or prototype. Explain design process, implementation challenges, and results.",
    team_size: "Solo or team of 2-3",
    fee: "Free",
    rules: [
      "Upload project abstract (max 5 pages) including existing system/proposed methodology during registration.",
      "Must bring working project model and presentation slides.",
      "Presentation duration: 5-10 minutes followed by live demonstration.",
      "Hard copy of project report is required.",
      "Deadline for abstract submission: 1st March 2026."
    ]
  },
  {
    id: "code-debugging",
    title: "Code Debugging",
    type: "Technical",
    date: "2026-03-07",
    time: "11:00 AM",
    venue: "IT Computer Lab 2",
    description: "Identify and fix bugs in provided code snippets. Race against time to optimize problematic code.",
    team_size: "Individual",
    fee: "₹50",
    rules: [
      "Pen and paper event; no internet or electronic devices allowed.",
      "Two rounds, 30 minutes each.",
      "Preferred languages: C/Java.",
      "Batches allocated based on registration."
    ]
  },
  {
    id: "blind-coding",
    title: "Blind Coding",
    type: "Technical",
    date: "2026-03-07",
    time: "11:00 AM",
    venue: "IT Computer Lab 3",
    description: "A challenging competition where participants type code and run it only once. Errors lead to immediate elimination.",
    team_size: "Individual",
    fee: "₹50",
    rules: [
      "Round 1: 15 mins (simple problem); Round 2: 15 mins (medium difficulty).",
      "Preferred languages: C, Python, Java.",
      "Programs must be run only once under supervision.",
      "Any runtime or compilation errors lead to instant elimination."
    ]
  },
  {
    id: "tech-quiz",
    title: "Tech Quiz",
    type: "Technical",
    date: "2026-03-07",
    time: "12:20 PM",
    venue: "Main Auditorium",
    description: "Test knowledge of technology, computer science, and engineering trends in a fast-paced proctored online format.",
    team_size: "Individual",
    fee: "₹50",
    rules: [
      "Conducted via an online platform in the auditorium.",
      "Sections: Easy, Medium, Hard.",
      "Topics: Programming (C, Python, Java), SQL logic, and DSA.",
      "Strict time limit and proctoring enforced."
    ]
  },
  {
    id: "hunt-mods",
    title: "Hunt Mods",
    type: "Technical",
    date: "2026-03-07",
    time: "12:20 PM",
    venue: "IT Computer Lab 2",
    description: "Technical treasure hunt combining cryptography, problem-solving, and logic-based coding alterations.",
    team_size: "Individual",
    fee: "₹50",
    rules: [
      "Round 1: 30 mins; Round 2: 30 mins.",
      "Focus on altering code logic to achieve specific output.",
      "Allows 'N' runs within the allocated time.",
      "Winner determined by time and output quality."
    ]
  },
  {
    id: "meme-contest",
    title: "Meme Contest",
    type: "Non-Technical",
    date: "2026-03-07",
    time: "Online",
    venue: "Online",
    description: "Create original memes based on provided situations (College life, student struggles, etc.).",
    team_size: "Individual",
    fee: "Free",
    rules: [
      "Individual participation only.",
      "Memes must be uploaded by 1st March 2026 via email.",
      "Themes: Hostel life, 'That one professor', Senior advice, etc.",
      "No adult content or depictions of violence."
    ]
  },
  {
    id: "photography",
    title: "Photography",
    type: "Non-Technical",
    date: "2026-03-07",
    time: "Online",
    venue: "Online",
    description: "Capture the essence of themes like Nature, The Color Green, or Macro photography.",
    team_size: "Individual",
    fee: "Free",
    rules: [
      "Themes: Landscapes, Animals, Flowers, Macro, Elements of Design.",
      "One photo per participant; Aspect ratio 3:4.",
      "No AI-generated content or collages allowed.",
      "Upload by 1st March 2026; only minimal editing permitted."
    ]
  }
];
