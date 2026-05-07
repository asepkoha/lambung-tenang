import { useLocalStorage } from './useStorage';
import type { AppSettings } from '@/types';
import { STORAGE_KEYS } from '@/types';

const defaultSettings: AppSettings = {
  reminderEnabled: false,
  reminderTime: '08:00',
  autoPlayVoice: false,
  onboardingDone: true,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.settings, defaultSettings);
  const [hasVisited, setHasVisited] = useLocalStorage<boolean>(STORAGE_KEYS.firstVisit, false);

  return {
    settings,
    setSettings,
    hasVisited,
    setHasVisited
  };
}
