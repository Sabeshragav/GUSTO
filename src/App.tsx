'use client';

import { DesktopProvider, useDesktop } from './contexts/DesktopContext';
import { AchievementsProvider } from './contexts/AchievementsContext';
import { Desktop } from './components/desktop/Desktop';
import { AchievementNotification } from './components/ui/AchievementNotification';

function AppContent() {
  const { openApp } = useDesktop();

  const openAchievementsWindow = () => {
    openApp('achievements');
  };

  return (
    <AchievementsProvider openAchievementsWindow={openAchievementsWindow}>
      <Desktop />
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
