'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'gusto-onboarding-done';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '#app-icon-events',
    title: '📅 Events',
    content: 'Tap to explore all symposium events, timings, and venues.',
    placement: 'bottom',
  },
  {
    target: '#app-icon-rules',
    title: '📋 Rules',
    content: 'Check the rules and guidelines for each event.',
    placement: 'bottom',
  },
  {
    target: '#app-icon-contact',
    title: '📧 Contact',
    content: 'Need help? Reach out to the organizers here.',
    placement: 'bottom',
  },
  {
    target: '#app-icon-browser',
    title: '🌐 Browser',
    content: 'Open the browser to register for your favourite events!',
    placement: 'bottom',
  },
  {
    target: '#app-icon-achievements',
    title: '🏆 Achievements',
    content: 'Track your achievements as you explore the app.',
    placement: 'bottom',
  },
  {
    target: '#app-icon-terminal',
    title: '💻 Terminal',
    content: 'Try the terminal — type "help" to see what you can do!',
    placement: 'top',
  },
];

const TOOLTIP_W = 270;
const EDGE_PAD = 14;
const GAP = 14;

interface MobileOnboardingProps {
  isReady: boolean;
}

export function MobileOnboarding({ isReady }: MobileOnboardingProps) {
  const [run, setRun] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isReady) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setRun(true), 1200);
        return () => clearTimeout(t);
      }
    } catch {}
  }, [isReady]);

  const updateSpotlight = useCallback(() => {
    if (!run) return;
    const el = document.querySelector(TOUR_STEPS[step].target);
    if (el) {
      setSpotlightRect(el.getBoundingClientRect());
    }
  }, [run, step]);

  useEffect(() => {
    updateSpotlight();
    window.addEventListener('resize', updateSpotlight);
    window.addEventListener('scroll', updateSpotlight, true);
    return () => {
      window.removeEventListener('resize', updateSpotlight);
      window.removeEventListener('scroll', updateSpotlight, true);
    };
  }, [updateSpotlight]);

  const finish = useCallback(() => {
    setRun(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }, []);

  const next = useCallback(() => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  const back = useCallback(() => {
    if (step > 0) setStep(s => s - 1);
  }, [step]);

  if (!run || !isReady) return null;

  const current = TOUR_STEPS[step];
  const isLast = step === TOUR_STEPS.length - 1;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 400;
  const above = current.placement === 'top';

  // ── Tooltip positioning ──
  // Anchor horizontally to target center, clamp within screen edges
  let tooltipLeft = (vw - TOOLTIP_W) / 2;
  let tooltipTop = 200;
  let arrowLeftPx = TOOLTIP_W / 2;

  if (spotlightRect) {
    const cx = spotlightRect.left + spotlightRect.width / 2;

    // Clamp left edge
    tooltipLeft = cx - TOOLTIP_W / 2;
    tooltipLeft = Math.max(EDGE_PAD, Math.min(tooltipLeft, vw - TOOLTIP_W - EDGE_PAD));

    // Arrow points at target center
    arrowLeftPx = cx - tooltipLeft;
    arrowLeftPx = Math.max(24, Math.min(arrowLeftPx, TOOLTIP_W - 24));

    if (above) {
      tooltipTop = spotlightRect.top - GAP;
    } else {
      tooltipTop = spotlightRect.bottom + GAP;
    }
  }

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed' as const,
    left: tooltipLeft,
    width: TOOLTIP_W,
    zIndex: 10000,
    ...(above ? { top: tooltipTop, transform: 'translateY(-100%)' } : { top: tooltipTop }),
  };

  return (
    <div className="fixed inset-0 z-[9999]" onClick={next}>
      {/* Dark backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="onb-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 8}
                y={spotlightRect.top - 8}
                width={spotlightRect.width + 16}
                height={spotlightRect.height + 16}
                rx={18}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.78)" mask="url(#onb-mask)" />
      </svg>

      {/* Glowing ring around target */}
      {spotlightRect && (
        <div
          className="absolute rounded-[18px] pointer-events-none"
          style={{
            left: spotlightRect.left - 8,
            top: spotlightRect.top - 8,
            width: spotlightRect.width + 16,
            height: spotlightRect.height + 16,
            border: '2px solid rgba(251,146,60,0.5)',
            boxShadow: '0 0 24px 4px rgba(251,146,60,0.12)',
          }}
        />
      )}

      {/* Tooltip card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: above ? 8 : -8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: above ? 8 : -8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={tooltipStyle}
          onClick={e => e.stopPropagation()}
        >
          {/* Arrow pointing to target */}
          <div
            className="absolute w-3 h-3 rotate-45 z-0"
            style={{
              left: arrowLeftPx - 6,
              backgroundColor: '#1c1c1c',
              ...(above
                ? { bottom: -6, borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }
                : { top: -6, borderLeft: '1px solid rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)' }),
            }}
          />

          {/* Card body */}
          <div className="relative bg-[#1c1c1c] border border-white/10 rounded-2xl p-4 shadow-2xl z-10">
            <button
              onClick={finish}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-white/40 active:bg-white/10"
            >
              <X size={12} />
            </button>

            <h3 className="text-white font-bold text-sm mb-1 pr-8">{current.title}</h3>
            <p className="text-white/55 text-[13px] leading-relaxed mb-3">{current.content}</p>

            <div className="flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex gap-1.5 items-center">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-4 h-1.5 bg-orange-400'
                        : i < step
                        ? 'w-1.5 h-1.5 bg-orange-400/40'
                        : 'w-1.5 h-1.5 bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-1.5">
                {step > 0 && (
                  <button
                    onClick={back}
                    className="text-white/40 text-xs font-medium px-2.5 py-1.5 rounded-full active:bg-white/5"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-0.5 bg-orange-500 active:bg-orange-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full"
                >
                  {isLast ? 'Got it!' : 'Next'}
                  {!isLast && <ChevronRight size={13} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
