import type { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Admin — GUSTO'26",
  robots: "noindex, nofollow",
};

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={inter.className}
      style={{
        margin: 0,
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: "#0f1117",
        color: "#e4e4e7",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}
