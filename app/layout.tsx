import type { Metadata } from 'next';
import '@/index.css';

export const metadata: Metadata = {
  title: 'macOS  Gusto-2026 OS Simulator',
  description: 'Interactive  Gusto-2026 experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
