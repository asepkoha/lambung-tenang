import { useCallback } from 'react';
import { useLocalStorage, removeStorageItem } from './useStorage';
import type { UserProfile } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

export function useProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(STORAGE_KEYS.profile, null);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      if (!prev) return updates as UserProfile;
      return { ...prev, ...updates };
    });
  }, [setProfile]);

  const clearProfile = useCallback(() => {
    removeStorageItem(STORAGE_KEYS.profile);
    setProfile(null);
  }, [setProfile]);

  return {
    profile,
    updateProfile,
    clearProfile
  };
}
