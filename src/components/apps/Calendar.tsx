'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Users, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { EVENTS } from '../../data/events';
import { registationFinalDate } from '../../data/details/fullData';

export function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  // March 2026
  const [currentMonth] = useState(new Date(2026, 2, 1));

  // March 2026 starts on a Sunday (0)
  const daysInMonth = 31;
  const startDay = 0; // Sunday

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar grid
  const days = Array.from({ length: 35 }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum > 0 && dayNum <= daysInMonth) return dayNum;
    return null;
  });

  const getDayEvent = (day: number) => {
    if (day === 6) return { type: 'gusto', title: "Gusto '26", color: 'var(--ph-orange)' };
    if (day === 4) return { type: 'deadline', title: "Reg Ends", color: '#FF3B30' }; // Red for deadline
    return null;
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(day);
  };

  return (
    <div className="flex h-full bg-[var(--surface-bg)] text-[var(--text-primary)] font-sans relative overflow-hidden">
      {/* Calendar View */}
      <div className={`flex-1 flex flex-col transition-opacity duration-300 ${selectedDate ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>

        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
          <h2 className="text-xl font-bold tracking-tight">March 2026</h2>
          <div className="flex gap-2">
            <button className="p-1 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
              <ChevronLeft size={20} />
            </button>
            <button className="p-1 rounded hover:bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map(d => (
              <div key={d} className="text-center text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-2 h-[calc(100%-40px)]">
            {days.map((day, idx) => {
              const event = day ? getDayEvent(day) : null;

              return (
                <div key={idx} className="relative">
                  {day && (
                    <button
                      onClick={() => handleDateClick(day)}
                      className={`w-full h-full rounded-lg border-2 flex flex-col items-start p-2 transition-all hover:shadow-md ${event
                          ? `bg-[var(--surface-elevated)] border-[${event.color}]`
                          : 'bg-[var(--surface-primary)] border-transparent hover:border-[var(--border-color)] text-[var(--text-primary)]'
                        }`}
                      style={event ? { borderColor: event.color } : {}}
                    >
                      <span className={`text-sm font-bold ${event ? '' : ''}`} style={event ? { color: event.color } : {}}>
                        {day}
                      </span>

                      {event && (
                        <div className="mt-auto w-full">
                          <div className="w-1.5 h-1.5 rounded-full mb-1" style={{ backgroundColor: event.color }} />
                          <span className="text-[10px] font-medium leading-tight block truncate w-full text-left" style={{ color: event.color }}>
                            {event.title}
                          </span>
                        </div>
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Details Modal/Overlay */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 right-0 w-full md:w-[400px] bg-[var(--surface-elevated)] border-l-2 border-[var(--border-color)] shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b-2 border-[var(--border-color)] flex items-center justify-between bg-[var(--surface-primary)]">
              <div>
                <h3 className="font-bold text-lg">March {selectedDate}, 2026</h3>
                <span className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wider">
                  {new Date(2026, 2, selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1.5 rounded hover:bg-[var(--ph-orange)] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {getDayEvent(selectedDate)?.type === 'gusto' ? (
                // GUSTO Event Details
                <>
                  <div className="p-4 bg-[var(--ph-orange)] text-white rounded-lg shadow-[4px_4px_0px_0px_var(--ph-black)] border-2 border-[var(--ph-black)] mb-6">
                    <h4 className="text-2xl font-black mb-1">GUSTO &apos;26</h4>
                    <p className="font-medium opacity-90">National Level Technical Symposium</p>
                    <div className="mt-2 text-xs font-mono opacity-80 flex items-center gap-1">
                      <CalendarIcon size={12} /> March 6, 2026
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">Schedule</h5>

                  <div className="space-y-3">
                    {EVENTS.map((event) => (
                      <div key={event.id} className="group p-3 rounded-lg border-2 border-transparent hover:border-[var(--border-color)] hover:bg-[var(--surface-primary)] transition-all">
                        <div className="flex justify-between items-start mb-1">
                          <h6 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--ph-orange)] transition-colors">
                            {event.title}
                          </h6>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-mono py-0.5 px-1.5 bg-[var(--surface-secondary)] rounded text-[var(--text-secondary)] mb-0.5">
                              {event.time || "10:00 AM"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-1">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {event.venue}</span>
                          <span className="flex items-center gap-1"><Users size={12} /> {event.team_size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : getDayEvent(selectedDate)?.type === 'deadline' ? (
                // Registration Deadline Details
                <div className="flex flex-col h-full">
                  <div className="p-4 bg-[#FF3B30] text-white rounded-lg shadow-[4px_4px_0px_0px_#8B0000] border-2 border-[#8B0000] mb-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle size={28} className="shrink-0" />
                      <div>
                        <h4 className="text-xl font-black mb-1">Registration Closes</h4>
                        <p className="font-medium opacity-90 text-sm">Last chance to register for Gusto &apos;26!</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[var(--surface-primary)] border-2 border-[var(--border-color)] p-6 rounded-lg text-center">
                    <Clock size={40} className="mx-auto text-[#FF3B30] mb-4" />
                    <h5 className="text-lg font-bold text-[var(--text-primary)] mb-2">Deadline</h5>
                    <p className="text-3xl font-mono font-black text-[var(--text-primary)] mb-1">11:59 PM</p>
                    <p className="text-sm text-[var(--text-secondary)]">March 4, 2026</p>
                  </div>

                  <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
                    Ensure all team details and abstracts are submitted before this time.
                  </div>
                </div>
              ) : (
                // Empty Date
                <div className="flex flex-col items-center justify-center h-64 text-[var(--text-muted)]">
                  <div className="w-16 h-16 rounded-full bg-[var(--surface-secondary)] flex items-center justify-center mb-4">
                    <Clock size={32} className="opacity-50" />
                  </div>
                  <p>No events scheduled for this date.</p>
                </div>
              )}
            </div>

            {getDayEvent(selectedDate)?.type === 'deadline' && (
              <div className="p-4 border-t-2 border-[var(--border-color)] bg-[var(--surface-primary)]">
                <button className="w-full py-2.5 bg-[#FF3B30] text-white font-bold rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-[#D32F2F]">
                  Go to Registration
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
