export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
}

export const defaultSEO: PageSEO = {
  title: "Gusto '26 - National Level Technical Symposium",
  description: "Join us for Gusto '26, a grand technical symposium organized by the Department of Information Technology, GCE Erode. Innovate, Compete, Excel!",
  keywords: ["Gusto '26", "Technical Symposium", "GCE Erode", "IT Department", "Events"],
  ogImage: "/og-image.png", // Replace with actual image path
  twitterCard: "summary_large_image",
};

export const seoData: Record<string, PageSEO> = {
  home: defaultSEO,
  events: {
    title: "Events - Gusto '26",
    description: "Explore technical and non-technical events at Gusto '26. Participate and win exciting prizes!",
    keywords: ["Events", "Competitions", "Coding", "Photography"],
  },
  rules: {
    title: "Rules & Guidelines - Gusto '26",
    description: "Read the rules and guidelines for participating in Gusto '26 events.",
  },
  register: {
    title: "Register - Gusto '26",
    description: "Register now for Gusto '26 events! Secure your spot in the technical symposium.",
  },
  contact: {
    title: "Contact Us - Gusto '26",
    description: "Get in touch with the organizers of Gusto '26 for queries and support.",
  },
  // Add more pages here as needed
};

export const getSEO = (pageId: string): PageSEO => {
  return seoData[pageId] || defaultSEO;
};
