"use client";

import { useDesktop } from "../../contexts/DesktopContext";
import { Window } from "../ui/Window";
import { Finder } from "../apps/Finder";
import { Terminal } from "../apps/Terminal";
import { EmailClient } from "../apps/EmailClient";
import { Minesweeper } from "../apps/Minesweeper";
import { Snake } from "../apps/Snake";
import { TextViewer } from "../apps/TextViewer";
import { PDFViewer } from "../apps/PDFViewer";
import { TrashViewer } from "../apps/TrashViewer";
import { SystemPreferences } from "../apps/SystemPreferences";
import { Achievements } from "../apps/Achievements";
import { Spotify } from "../apps/Spotify";
import { CalendarApp } from "../apps/Calendar";
import { EventsExplorer } from "../apps/EventsExplorer";
import { RulesSection } from "../apps/RulesSection";
import { ContactSection } from "../apps/ContactSection";
import { TransportInfo } from "../apps/TransportInfo";
import { RegisterPage } from "../apps/register/RegisterPage";
import { BrowserChrome } from "../apps/register/BrowserChrome";
import { Gallery } from "../apps/Gallery";
import { About } from "../apps/About";
import { YouTubeApp } from "../apps/YouTubeApp"; // Added Import

export function WindowManager() {
  const { state } = useDesktop();

  const renderWindowContent = (windowState: (typeof state.windows)[0]) => {
    switch (windowState.appId) {
      case "finder":
        return (
          <Finder windowId={windowState.id} data={windowState.data as any} />
        );
      case "calendar":
        return <CalendarApp />;
      case "terminal":
        return <Terminal />;
      case "email":
        return <EmailClient />;
      case "minesweeper":
        return <Minesweeper />;
      case "snake":
        return <Snake />;
      case "textViewer":
        return <TextViewer data={windowState.data as any} />;
      case "pdfViewer":
        return <PDFViewer />;
      case "trash":
        return <TrashViewer />;
      case "systemPreferences":
        return <SystemPreferences />;
      case "achievements":
        return <Achievements />;
      case "spotify":
        return <Spotify />;
      case "youtube": // Added Case
        // Pass video ID if provided in window data
        return <YouTubeApp videoId={(windowState.data as any)?.videoId} />;
      case "events":
        return <EventsExplorer />;
      case "rules":
        return <RulesSection />;
      case "contact":
        return <ContactSection />;
      case "transport":
        return <TransportInfo />;
      case "gallery":
        return <Gallery />;
      case "about":
        return <About />;
      case "register":
        return <RegisterPage data={windowState.data} />;
      default:
        return (
          <div className="p-4 text-[var(--text-muted)]">
            Unknown app: {windowState.appId}
          </div>
        );
    }
  };

  return (
    <>
      {state.windows.map((windowState) => (
        <Window key={windowState.id} window={windowState}>
          {renderWindowContent(windowState)}
        </Window>
      ))}
    </>
  );
}
