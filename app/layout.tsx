import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/index.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://gusto26.in"),
  title: {
    template: "%s | GUSTO '26",
    default: "GUSTO '26 | National Level Technical Symposium",
  },
  description:
    "GUSTO '26 - A National Level Technical Symposium organized by the Department of Information Technology at Government College of Engineering, Erode. Join us on March 6, 2026!",
  keywords: [
    "GUSTO",
    "Technical Symposium",
    "GCEE",
    "Government College of Engineering Erode",
    "IT Department",
    "Technical Events",
    "College Symposium",
    "March 6 2026",
  ],
  authors: [{ name: "GCEE IT Department" }],
  creator: "GCEE IT Department",
  publisher: "Government College of Engineering, Erode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logos/AIT/bronze.png",
    shortcut: "/logos/AIT/bronze.png",
    apple: "/logos/AIT/bronze.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gusto26.in",
    title: "GUSTO '26 | National Level Technical Symposium",
    description:
      "GUSTO '26 - A National Level Technical Symposium organized by the Department of Information Technology at Government College of Engineering, Erode. Join us on March 6, 2026!",
    siteName: "GUSTO '26",
    images: ["/logos/AIT/bronze.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUSTO '26 | National Level Technical Symposium",
    description:
      "GUSTO '26 - A National Level Technical Symposium organized by the Department of Information Technology at Government College of Engineering, Erode. Join us on March 6, 2026!",
    images: ["/logos/AIT/bronze.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-black`}
        suppressHydrationWarning
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
