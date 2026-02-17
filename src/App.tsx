"use client";

import { DesktopProvider, useDesktop } from "./contexts/DesktopContext";
import { AchievementsProvider } from "./contexts/AchievementsContext";
import { Desktop } from "./components/desktop/Desktop";
import { MobileOS } from "./components/mobile/MobileOS";
import { AchievementNotification } from "./components/ui/AchievementNotification";

function AppContent() {
  const { openApp } = useDesktop();

  const openAchievementsWindow = () => {
    openApp("achievements");
  };

  return (
    <AchievementsProvider openAchievementsWindow={openAchievementsWindow}>
      {/* Desktop layout: visible only on lg (≥1024px) */}
      <div className="hidden lg:block fixed inset-0 w-screen h-screen overflow-hidden">
        <Desktop />
      </div>

      {/* Mobile layout: visible only below lg (<1024px) */}
      <div className="lg:hidden fixed inset-0 w-screen overflow-hidden" style={{ height: '100dvh' }}>
        <MobileOS />
      </div>

      <AchievementNotification />
    </AchievementsProvider>
  );
}

function App() {
  return (
    <DesktopProvider>
      <AppContent />
    </DesktopProvider>
  );
}

export default App;
