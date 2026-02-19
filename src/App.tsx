import { AppLayout } from '@/layout';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useAppStore } from '@/store';

function App() {
  const { theme } = useAppStore();

  // Apply theme class to html element
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    }
    // System implemented separately
  }

  return (
    <>
      <AppLayout />
      <SettingsDialog />
    </>
  );
}

export default App;
