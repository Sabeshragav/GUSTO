'use client';

import { useState } from 'react';
import { EVENTS, type Event } from '../../data/events';

export function EventsExplorer() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(EVENTS[0]?.id || null);

  const selectedEvent = EVENTS.find((e) => e.id === selectedEventId);

  return (
    <div className="flex h-full text-[var(--ph-black)] font-sans">
      {/* Sidebar List */}
      <div 
        className="w-1/3 min-w-[200px] border-r-2 border-[var(--border-color)] flex flex-col bg-[var(--surface-secondary)]"
      >
        <div className="p-2 border-b-2 border-[var(--border-color)] bg-[var(--surface-primary)] font-bold text-sm">
          GUSTO &apos;25 Events
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {EVENTS.map((event) => (
            <button
              key={event.id}
              onClick={() => setSelectedEventId(event.id)}
              className={`w-full text-left px-3 py-2 text-sm font-medium border-2 transition-all active:translate-y-[1px] ${
                selectedEventId === event.id
                  ? 'bg-[var(--ph-orange)] text-white border-[var(--ph-black)] shadow-[2px_2px_0px_0px_var(--ph-black)]'
                  : 'bg-[var(--surface-primary)] border-transparent hover:border-[var(--border-color)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]'
              }`}
            >
              {event.title}
              <div className={`text-[10px] mt-0.5 ${selectedEventId === event.id ? 'text-white/90' : 'text-[var(--text-secondary)]'}`}>
                {event.type}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Detail View */}
      <div className="flex-1 flex flex-col bg-[var(--surface-bg)] overflow-hidden">
        {selectedEvent ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="mb-6 border-b-2 border-[var(--border-color)] pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-block px-2 py-0.5 text-xs font-bold border border-[var(--border-color)] bg-[var(--ph-orange)] text-white">
                    {selectedEvent.type.toUpperCase()}
                  </span>
                  <span className="text-sm font-mono text-[var(--text-secondary)]">
                    {selectedEvent.date} • {selectedEvent.time}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">{selectedEvent.title}</h1>
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-4 h-4 rounded-full bg-[var(--ph-black)] flex items-center justify-center text-white text-[10px]">📍</span>
                  {selectedEvent.venue}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none mb-8">
                <h3 className="text-lg font-bold border-b border-[var(--border-color)] mb-2 pb-1">Description</h3>
                <p className="mb-4 leading-relaxed">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[var(--surface-primary)] p-3 border border-[var(--border-color)] shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]">
                    <span className="block text-xs uppercase font-bold text-[var(--text-secondary)] mb-1">Team Size</span>
                    <span className="font-mono font-medium">{selectedEvent.team_size}</span>
                  </div>
                  {/* Add more grid items if needed */}
                </div>

                <h3 className="text-lg font-bold border-b border-[var(--border-color)] mb-2 pb-1">Rules & Guidelines</h3>
                <ul className="list-disc pl-5 space-y-1 marker:text-[var(--ph-orange)]">
                  {selectedEvent.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                 <button className="px-6 py-2 bg-[var(--ph-black)] text-white font-bold border-2 border-transparent hover:bg-[var(--ph-orange)] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none">
                  Register Now
                </button>
                 <button className="px-6 py-2 bg-[var(--surface-primary)] text-[var(--ph-black)] font-bold border-2 border-[var(--border-color)] hover:bg-[var(--surface-secondary)] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[2px] active:shadow-none">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
            Select an event to view details
          </div>
        )}
      </div>
    </div>
  );
}
