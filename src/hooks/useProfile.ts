import { useCallback } from 'react';
import { useLocalStorage, removeStorageItem } from './useStorage';
import type { UserProfile } from '@/types';
import { STORAGE_KEYS } from '@/types';

export function useProfile() {
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(STORAGE_KEYS.profile, null);

  const updateProfile = useCallback((newProfile: UserProfile | ((prev: UserProfile | null) => UserProfile | null)) => {
    setProfile(newProfile);
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
