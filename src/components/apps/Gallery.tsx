"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Gallery images — add your own images to /public/gallery/
 * and list them here to display them in the app.
 *
 * Each entry needs:
 *   src  : path relative to /public  (e.g. "/gallery/photo1.jpg")
 *   alt  : a short description
 */
const GALLERY_IMAGES: { src: string; alt: string }[] = [
    { src: "/gallery/24PP05674.JPG", alt: "Gallery Photo 1" },
    { src: "/gallery/24PP05675.JPG", alt: "Gallery Photo 2" },
    { src: "/gallery/24PP05682.JPG", alt: "Gallery Photo 3" },
    { src: "/gallery/24PP05683.JPG", alt: "Gallery Photo 4" },
    { src: "/gallery/24PP05685.JPG", alt: "Gallery Photo 5" },
    { src: "/gallery/24PP05687.JPG", alt: "Gallery Photo 6" },
    { src: "/gallery/24PP05692.JPG", alt: "Gallery Photo 7" },
    { src: "/gallery/24PP05703.JPG", alt: "Gallery Photo 8" },
    { src: "/gallery/24PP05705.JPG", alt: "Gallery Photo 9" },
    { src: "/gallery/24PP05706.JPG", alt: "Gallery Photo 10" },
    { src: "/gallery/24PP05709.JPG", alt: "Gallery Photo 11" },
    { src: "/gallery/24PP05710.JPG", alt: "Gallery Photo 12" },
    { src: "/gallery/24PP05713.JPG", alt: "Gallery Photo 13" },
    { src: "/gallery/24PP05717.JPG", alt: "Gallery Photo 14" },
    { src: "/gallery/24PP05739.JPG", alt: "Gallery Photo 15" },
    { src: "/gallery/24PP05740.JPG", alt: "Gallery Photo 16" },
    { src: "/gallery/24PP05741.JPG", alt: "Gallery Photo 17" },
    { src: "/gallery/24PP05746.JPG", alt: "Gallery Photo 18" },
    { src: "/gallery/24PP05748.JPG", alt: "Gallery Photo 19" },
    { src: "/gallery/24PP05752.JPG", alt: "Gallery Photo 20" },
    { src: "/gallery/24PP05759.JPG", alt: "Gallery Photo 21" },
    { src: "/gallery/24PP05772.JPG", alt: "Gallery Photo 22" },
    { src: "/gallery/24PP05789.JPG", alt: "Gallery Photo 23" },
    { src: "/gallery/24PP05806.JPG", alt: "Gallery Photo 24" },
    { src: "/gallery/24PP05807.JPG", alt: "Gallery Photo 25" },
    { src: "/gallery/24PP05811.JPG", alt: "Gallery Photo 26" },
    { src: "/gallery/24PP05819.JPG", alt: "Gallery Photo 27" },
    { src: "/gallery/24PP05822.JPG", alt: "Gallery Photo 28" },
    { src: "/gallery/24PP05841.JPG", alt: "Gallery Photo 29" },
    { src: "/gallery/24PP05846.JPG", alt: "Gallery Photo 30" },
    { src: "/gallery/24PP05868.JPG", alt: "Gallery Photo 31" },
    { src: "/gallery/24PP05886.JPG", alt: "Gallery Photo 32" },
    { src: "/gallery/24PP05899.JPG", alt: "Gallery Photo 33" },
    { src: "/gallery/24PP05900.JPG", alt: "Gallery Photo 34" },
    { src: "/gallery/24PP05906.JPG", alt: "Gallery Photo 35" },
    { src: "/gallery/24PP05916.JPG", alt: "Gallery Photo 36" },
    { src: "/gallery/24PP05918.JPG", alt: "Gallery Photo 37" },
    { src: "/gallery/24PP05929.JPG", alt: "Gallery Photo 38" },
    { src: "/gallery/24PP05948.JPG", alt: "Gallery Photo 39" },
    { src: "/gallery/24PP05953.JPG", alt: "Gallery Photo 40" },
    { src: "/gallery/24PP05988.JPG", alt: "Gallery Photo 41" },
    { src: "/gallery/24PP05989.JPG", alt: "Gallery Photo 42" },
    { src: "/gallery/24PP05992.JPG", alt: "Gallery Photo 43" },
    { src: "/gallery/24PP05995.JPG", alt: "Gallery Photo 44" },
    { src: "/gallery/24PP05996.JPG", alt: "Gallery Photo 45" },
    { src: "/gallery/24PP05998.JPG", alt: "Gallery Photo 46" },
    { src: "/gallery/24PP06006.JPG", alt: "Gallery Photo 47" },
    { src: "/gallery/24PP06007.JPG", alt: "Gallery Photo 48" },
    { src: "/gallery/24PP06016.JPG", alt: "Gallery Photo 49" },
    { src: "/gallery/24PP06017.JPG", alt: "Gallery Photo 50" },
    { src: "/gallery/24PP06018.JPG", alt: "Gallery Photo 51" },
    { src: "/gallery/24PP06019.JPG", alt: "Gallery Photo 52" },
    { src: "/gallery/24PP06032.JPG", alt: "Gallery Photo 53" },
    { src: "/gallery/24PP06033.JPG", alt: "Gallery Photo 54" },
    { src: "/gallery/GOW06781.JPG", alt: "Gallery Photo 55" },
    { src: "/gallery/GOW06782.JPG", alt: "Gallery Photo 56" },
    { src: "/gallery/GOW06785.JPG", alt: "Gallery Photo 57" },
    { src: "/gallery/GOW06820.JPG", alt: "Gallery Photo 58" },
];

export function Gallery() {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const openImage = (i: number) => setSelectedIndex(i);
    const closeImage = () => setSelectedIndex(null);

    const goPrev = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex(
            selectedIndex === 0 ? GALLERY_IMAGES.length - 1 : selectedIndex - 1,
        );
    }, [selectedIndex]);

    const goNext = useCallback(() => {
        if (selectedIndex === null) return;
        setSelectedIndex(
            selectedIndex === GALLERY_IMAGES.length - 1 ? 0 : selectedIndex + 1,
        );
    }, [selectedIndex]);

    // Keyboard navigation (desktop)
    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
            else if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
            else if (e.key === "Escape") { e.preventDefault(); closeImage(); }
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [selectedIndex, goPrev, goNext]);

    // Swipe handler (mobile)
    const handleSwipeDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -50) goNext();
        else if (info.offset.x > 50) goPrev();
    };

    return (
        <div className="h-full flex flex-col bg-[var(--surface-bg)]">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-[var(--surface-bg)]/80 backdrop-blur-md border-b border-[var(--border-color)] px-4 py-3 shadow-sm">
                <h1 className="text-xl font-bold text-[var(--text-primary)] leading-none">
                    Gallery
                </h1>
                <p className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium tracking-wide opacity-80">
                    {GALLERY_IMAGES.length} photos
                </p>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3">
                {GALLERY_IMAGES.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-muted)] px-8">
                        <div className="text-5xl mb-4">📷</div>
                        <h2 className="text-lg font-bold text-[var(--text-secondary)] mb-2">
                            No Photos Yet
                        </h2>
                        <p className="text-sm leading-relaxed">
                            Add images to{" "}
                            <code className="bg-[var(--surface-secondary)] px-1.5 py-0.5 rounded text-xs font-mono text-[var(--accent-color)]">
                                /public/gallery/
                            </code>{" "}
                            and update the GALLERY_IMAGES array in Gallery.tsx to display them
                            here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                        {GALLERY_IMAGES.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => openImage(i)}
                                className="relative aspect-square rounded-lg overflow-hidden group active:scale-95 transition-transform"
                            >
                                <Image
                                    src={img.src}
                                    alt={img.alt}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 33vw, 200px"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedIndex !== null && GALLERY_IMAGES[selectedIndex] && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center"
                        onClick={closeImage}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeImage}
                            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
                        >
                            <X size={20} />
                        </button>

                        {/* Prev */}
                        {GALLERY_IMAGES.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goPrev();
                                }}
                                className="absolute left-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        {/* Image — swipeable on mobile, arrow-key on desktop */}
                        <motion.div
                            key={selectedIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative w-[90%] max-w-lg aspect-auto max-h-[80vh] cursor-grab active:cursor-grabbing"
                            onClick={(e) => e.stopPropagation()}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.3}
                            onDragEnd={handleSwipeDragEnd}
                        >
                            <Image
                                src={GALLERY_IMAGES[selectedIndex].src}
                                alt={GALLERY_IMAGES[selectedIndex].alt}
                                width={800}
                                height={800}
                                className="object-contain w-full h-full rounded-lg pointer-events-none select-none"
                                draggable={false}
                            />
                            <p className="text-white/60 text-xs text-center mt-3 select-none">
                                {GALLERY_IMAGES[selectedIndex].alt} — {selectedIndex + 1} /{" "}
                                {GALLERY_IMAGES.length}
                            </p>
                        </motion.div>

                        {/* Next */}
                        {GALLERY_IMAGES.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goNext();
                                }}
                                className="absolute right-2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white active:bg-white/20"
                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
