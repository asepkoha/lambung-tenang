import { differenceInDays } from 'date-fns';
import type { DayEntry } from '@/types';

/**
 * Menghitung hari saat ini berdasarkan tanggal mulai program.
 * Dibatasi maksimal 14 hari.
 */
export function getCurrentDay(startDate?: string): number {
  const start = startDate ? new Date(startDate) : new Date();
  const validStartDate = isNaN(start.getTime()) ? new Date() : start;
  const today = new Date();
  const daysDiff = differenceInDays(today, validStartDate);
  const calculatedDay = daysDiff + 1;
  return Math.min(Math.max(isNaN(calculatedDay) ? 1 : calculatedDay, 1), 14);
}

/**
 * Menghitung streak terpanjang dari riwayat check-in (hari berturut-turut).
 */
export function calculateStreak(entries: DayEntry[]): number {
  if (!entries || entries.length === 0) return 0;
  
  return entries.reduce((max, entry, i, arr) => {
    if (!entry.completed) return max;
    let count = 1;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j]?.completed) count++;
      else break;
    }
    return Math.max(max, count);
  }, 0);
}

/**
 * Menentukan fase program berdasarkan hari saat ini.
 * Fase 1: Hari 1-3
 * Fase 2: Hari 4-10
 * Fase 3: Hari 11-14
 */
export function getProgramPhase(day: number): 1 | 2 | 3 {
  if (day >= 1 && day <= 3) return 1;
  if (day >= 4 && day <= 10) return 2;
  return 3;
}

/**
 * Menghitung persentase progres program (0-100).
 */
export function getProgressPercent(day: number): number {
  const boundedDay = Math.min(Math.max(day, 0), 14);
  return Math.round((boundedDay / 14) * 100);
}
