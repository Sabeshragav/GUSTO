"use client";

import { useIsMobile } from "../../hooks/useIsMobile";
import { busRoutes } from "../../data/details/bus_timings";

interface InfoCard {
  title: string;
  icon: string;
  items: string[];
}

const TRANSPORT_DATA: InfoCard[] = [
  {
    title: "By Bus",
    icon: "🚌",
    items: [
      "Government College of Engineering is well-connected by TNSTC and private bus services.",
      "Erode Central Bus Stand is approximately 5 km from the campus.",
      "Frequent city buses (Route 4, 7, 12) run from the bus stand to GCE, Erode.",
      "Auto-rickshaws and cabs are available from the bus stand (~₹100-150).",
    ],
  },
  {
    title: "By Train",
    icon: "🚆",
    items: [
      "Erode Junction (ED) is the nearest railway station, about 6 km from campus.",
      "Erode Junction is a major junction on the Salem–Coimbatore line.",
      "Well-connected to Chennai, Coimbatore, Bangalore, Madurai, and Trichy.",
      "Prepaid taxi and auto counters available at the station.",
    ],
  },
  {
    title: "By Air",
    icon: "✈️",
    items: [
      "Coimbatore International Airport (CJB) is the nearest airport (~80 km).",
      "Salem Airport (SLV) is approximately 90 km away.",
      "Taxi services available from both airports to Erode (~2-2.5 hours).",
    ],
  },
];

const LANDMARKS = [
  "Erode Bus Stand — 12 km",
  "Erode Junction Railway Station — 15 km",
  "Perundurai — 15 km",
  "Bhavani — 8 km",
  "Gobichettipalayam — 25 km",
];


function InfoSection({ card }: { card: InfoCard }) {
  return (
    <div className="bg-[var(--surface-primary)] border-2 border-[var(--border-color)] p-4">
      <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
        <span className="text-lg">{card.icon}</span>
        {card.title}
      </h3>
      <ul className="space-y-2 list-disc pl-5 marker:text-[var(--ph-orange)]">
        {card.items.map((item, idx) => (
          <li
            key={idx}
            className="text-sm text-[var(--text-secondary)] leading-relaxed"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TransportInfo() {
  const { isMobile } = useIsMobile();

  return (
    <div className="h-full overflow-y-auto">
      <div className={`${isMobile ? "p-4" : "p-6"} max-w-4xl mx-auto`}>
        {/* Header */}
        <header className="mb-6 border-b-2 border-[var(--border-color)] pb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-1">
            Getting Here
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Government College of Engineering, Erode — Tamil Nadu 638316
          </p>
        </header>

        {/* Transport Options */}
        <div
          className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"}`}
        >
          {TRANSPORT_DATA.map((card) => (
            <InfoSection key={card.title} card={card} />
          ))}
        </div>

        {/* Bus Timings */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <span className="text-xl">🚍</span>
            Bus Timings to College
          </h3>
          <div className={`grid gap-4 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}>
            {busRoutes.map((route, idx) => (
              <div key={idx} className="bg-[var(--surface-primary)] border-2 border-[var(--border-color)] p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2 border-b border-[var(--border-color)] pb-2">
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-base">{route.location}</h4>
                    <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">Stop: {route.stopName}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[10px] font-bold bg-[var(--surface-secondary)] px-2 py-1 rounded border border-[var(--border-color)] mb-1 block w-fit">
                      {route.duration}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)]">{route.distance}</span>
                  </div>
                </div>

                <div className="space-y-2 mt-3">
                  {route.buses.map((bus, busIdx) => (
                    <div key={busIdx} className="flex justify-between items-center text-xs bg-[var(--surface-secondary)]/50 p-2 rounded">
                      <span className="font-mono font-bold text-[var(--accent-color)] text-sm">{bus.time}</span>
                      <div className="text-right">
                        <div className="text-[var(--text-primary)] font-medium">{bus.type}</div>
                        <div className="text-[10px] text-[var(--text-muted)] line-clamp-1">{bus.destination}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Split section: Landmarks + Accommodation */}
        <div
          className={`grid gap-4 mb-6 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {/* Nearby Landmarks */}
          <div className="bg-[var(--surface-primary)] border-2 border-[var(--border-color)] p-4">
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span className="text-lg">📍</span>
              Nearby Landmarks
            </h3>
            <ul className="space-y-2">
              {LANDMARKS.map((lm, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="w-1.5 h-1.5 bg-[var(--ph-orange)] rounded-full flex-shrink-0" />
                  {lm}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Google Maps Link */}
        <div className="border-2 border-[var(--border-color)] bg-[var(--surface-secondary)] p-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <span className="text-lg">🗺️</span>
            Find Us on Map
          </h3>
          <a
            href="https://maps.google.com/?q=Government+College+of+Engineering+Erode"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 text-sm font-bold bg-[var(--ph-orange)] text-white border-2 border-[var(--ph-orange)] hover:bg-[var(--accent-hover)] transition-colors active:translate-y-[1px] min-h-[44px]"
          >
            Open in Google Maps ↗
          </a>
        </div>
      </div>
    </div>
  );
}
