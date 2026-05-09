import { useLocalStorage } from './useStorage';
import type { AppSettings } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

const defaultSettings: AppSettings = {
  reminderEnabled: false,
  reminderTime: '08:00',
  autoPlayVoice: false,
  onboardingDone: true,
  doseOffset: 0,
};

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.settings, defaultSettings);
  const [hasVisited, setHasVisited] = useLocalStorage<boolean>(STORAGE_KEYS.firstVisit, false);

  const setDoseOffset = (offset: number) => {
    setSettings((s) => ({ ...s, doseOffset: offset }));
  };

  return {
    settings,
    setSettings,
    hasVisited,
    setHasVisited,
    setDoseOffset
  };
}
