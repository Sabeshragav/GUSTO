'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';

const STORAGE_KEY = 'gusto-desktop-onboarding-done';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '#dock-icon-events',
    title: '📅 Events',
    content: 'Browse all symposium events, timings, and venues.',
    placement: 'top',
  },
  {
    target: '#dock-icon-rules',
    title: '📋 Rules',
    content: 'Check the rules and guidelines for each event.',
    placement: 'top',
  },
  {
    target: '#dock-icon-register',
    title: '📝 Register',
    content: 'Register for your favourite events here!',
    placement: 'top',
  },
  {
    target: '#dock-icon-terminal',
    title: '💻 Terminal',
    content: 'Open the terminal — type "help" to see what you can do!',
    placement: 'top',
  },
  {
    target: '#dock-icon-mail',
    title: '📧 Mail',
    content: 'Check mail from the organizers and explore messages.',
    placement: 'top',
  },
  {
    target: '#dock-icon-spotify',
    title: '🎵 Music',
    content: 'Listen to music while you explore the app.',
    placement: 'top',
  },
];

const TOOLTIP_W = 300;
const EDGE_PAD = 16;
const GAP = 202;

interface DesktopOnboardingProps {
  isReady: boolean;
}

export function DesktopOnboarding({ isReady }: DesktopOnboardingProps) {
  const [run, setRun] = useState(false);
  const [step, setStep] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isReady) return;
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        const t = setTimeout(() => setRun(true), 1500);
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
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  let tooltipLeft = (vw - TOOLTIP_W) / 2;
  let tooltipTop = vh / 2;
  let arrowLeftPx = TOOLTIP_W / 2;
  const above = current.placement === 'top';

  if (spotlightRect) {
    const cx = spotlightRect.left + spotlightRect.width / 2;

    tooltipLeft = cx - TOOLTIP_W / 2;
    tooltipLeft = Math.max(EDGE_PAD, Math.min(tooltipLeft, vw - TOOLTIP_W - EDGE_PAD));

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
    zIndex: 10001,
    ...(above ? { top: tooltipTop, transform: 'translateY(-100%)' } : { top: tooltipTop }),
  };

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      {/* Dark backdrop with spotlight cutout */}
      <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
        <defs>
          <mask id="desktop-onb-mask">
            <rect width="100%" height="100%" fill="white" />
            {spotlightRect && (
              <rect
                x={spotlightRect.left - 10}
                y={spotlightRect.top - 10}
                width={spotlightRect.width + 20}
                height={spotlightRect.height + 20}
                rx={14}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)" mask="url(#desktop-onb-mask)" />
      </svg>

      {/* Glowing ring around target */}
      {spotlightRect && (
        <div
          className="absolute rounded-[14px] pointer-events-none"
          style={{
            left: spotlightRect.left - 10,
            top: spotlightRect.top - 10,
            width: spotlightRect.width + 20,
            height: spotlightRect.height + 20,
            // border: '2px solid rgba(251,146,60,0.5)',
            // boxShadow: '0 0 30px 6px rgba(251,146,60,0.1)',
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
          className="pointer-events-auto"
        >
          {/* Arrow pointing to target */}
          <div
            className="absolute w-3 h-3 rotate-45 z-0"
            style={{
              left: arrowLeftPx - 6,
              backgroundColor: '#1e1e1e',
              ...(above
                ? { bottom: -6, borderRight: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)' }
                : { top: -6, borderLeft: '1px solid rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.12)' }),
            }}
          />

          {/* Card body */}
          <div className="relative bg-[#1e1e1e] border border-white/[0.12] rounded-xl p-5 shadow-2xl z-10">
            <button
              onClick={finish}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60 transition-colors"
            >
              <X size={14} />
            </button>

            <h3 className="text-white font-semibold text-base mb-1.5 pr-10">{current.title}</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-4">{current.content}</p>

            <div className="flex items-center justify-between">
              {/* Progress dots */}
              <div className="flex gap-1.5 items-center">
                {TOUR_STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === step
                        ? 'w-5 h-2 bg-orange-400'
                        : i < step
                        ? 'w-2 h-2 bg-orange-400/40'
                        : 'w-2 h-2 bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button
                    onClick={back}
                    className="text-white/40 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-white/5 hover:text-white/60 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={next}
                  className="flex items-center gap-1 bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-5 py-1.5 rounded-lg transition-colors"
                >
                  {isLast ? 'Got it!' : 'Next'}
                  {!isLast && <ChevronRight size={15} />}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
