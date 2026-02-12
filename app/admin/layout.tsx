import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin — GUSTO'26",
    robots: "noindex, nofollow",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body
                style={{
                    margin: 0,
                    fontFamily: "'Inter', -apple-system, sans-serif",
                    background: "#0f1117",
                    color: "#e4e4e7",
                    minHeight: "100vh",
                }}
            >
                {children}
            </body>
        </html>
    );
}
