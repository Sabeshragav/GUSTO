"use client";

import Image from "next/image";
import { Heart, MapPin, Calendar, Globe, Instagram } from "lucide-react";
import { instagram } from "../../data/details/fullData";

export function About() {
    return (
        <div className="h-full flex flex-col bg-[var(--surface-bg)]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[var(--surface-bg)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 shadow-sm">
                <h1 className="text-xl font-bold text-[var(--text-primary)] leading-none">
                    About
                </h1>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium tracking-wide opacity-80">
                    GUSTO &apos;26
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
                    {/* Logos & Title */}
                    <div className="flex flex-col items-center text-center">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 relative">
                                <Image
                                    src="/logos/GCEE/white.png"
                                    alt="GCEE Logo"
                                    width={64}
                                    height={64}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                            <div className="h-10 w-px bg-[var(--border-color)]" />
                            <div className="w-16 h-16 relative">
                                <Image
                                    src="/logos/AIT/silver.png"
                                    alt="AIT Logo"
                                    width={64}
                                    height={64}
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">
                            GUSTO &apos;26
                        </h2>
                        <p className="text-xs text-[#FF6B35] font-bold uppercase tracking-[0.2em] mt-1">
                            A National Level Technical Symposium
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                            Department of Information Technology
                        </p>
                    </div>

                    {/* Description */}
                    <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 border border-[var(--border-color)]">
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            GUSTO is the flagship national-level technical symposium organised
                            by the Department of Information Technology at the Government
                            College of Engineering, Erode. It brings together students from
                            across the country to showcase their technical prowess, creativity,
                            and innovation through a diverse range of events.
                        </p>
                    </div>

                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 border border-[var(--border-color)] flex flex-col items-center text-center gap-2">
                            <Calendar size={20} className="text-[#FF6B35]" />
                            <span className="text-xs font-bold text-[var(--text-primary)]">
                                March 6, 2026
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                                Event Date
                            </span>
                        </div>
                        <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 border border-[var(--border-color)] flex flex-col items-center text-center gap-2">
                            <MapPin size={20} className="text-[#FF6B35]" />
                            <span className="text-xs font-bold text-[var(--text-primary)]">
                                GCE, Erode
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                                Venue
                            </span>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 border border-[var(--border-color)]">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">
                            What to Expect
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                "Technical & Non-Technical Events",
                                "Paper & Project Presentations",
                                "Refresments and lunch will be provided ( veg/non-veg )",
                                "AI & Coding Competitions",
                                "Exciting Prizes & Certificates",
                                "Networking & Fun Activities",
                            ].map((item) => (
                                <li
                                    key={item}
                                    className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social Link */}
                    <a
                        href={instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white text-sm font-semibold py-3 rounded-2xl active:opacity-80 transition-opacity"
                    >
                        <Instagram size={18} />
                        Follow us on Instagram
                    </a>

                    {/* Developer Credits */}
                    <div className="bg-[var(--surface-secondary)] rounded-2xl p-4 border border-[var(--border-color)]">
                        <p className="text-[10px] tracking-widest text-[var(--text-muted)] font-bold mb-2.5 text-center">
                            Cooked and served by
                        </p>
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {[
                                { name: "Sabeshragav", url: "https://www.linkedin.com/in/sabeshragavgk"},
                                { name: "Devak", url:"https://www.linkedin.com/in/devak-c-k-b53a73308" },
                                { name: "Prem", url:"https://www.linkedin.com/in/premkumar-p-8247aa314" },
                            ].map((dev, i) => (
                                <a
                                    key={dev.name}
                                    href={dev.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A66C2]/10 border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20 active:bg-[#0A66C2]/30 transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" fill="#0A66C2" className="w-3 h-3 flex-shrink-0">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                    <span className="text-xs font-semibold text-[#0A66C2]">
                                        {dev.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pb-6">
                        <p className="text-[10px] text-[var(--text-muted)] flex items-center justify-center gap-1">
                            Made with <Heart size={10} className="text-red-500" /> by the IT
                            Department
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] mt-1 opacity-60">
                            Government College of Engineering, Erode
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
