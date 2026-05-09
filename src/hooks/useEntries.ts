import { useCallback } from 'react';
import { useLocalStorage } from './useStorage';
import type { DayEntry } from '@/types';
import { STORAGE_KEYS } from '@/config/constants';

export function useEntries() {
  const [entries, setEntries] = useLocalStorage<DayEntry[]>(STORAGE_KEYS.entries, []);

  const addEntry = useCallback((entry: DayEntry) => {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.dayNumber === entry.dayNumber);
      if (existingIndex >= 0) {
        const newEntries = [...prev];
        newEntries[existingIndex] = entry;
        return newEntries;
      }
      return [...prev, entry];
    });
  }, [setEntries]);

  const getEntryByDay = useCallback((dayNumber: number) => {
    return entries.find((e) => e.dayNumber === dayNumber);
  }, [entries]);

  return {
    entries,
    setEntries,
    addEntry,
    getEntryByDay
  };
}
