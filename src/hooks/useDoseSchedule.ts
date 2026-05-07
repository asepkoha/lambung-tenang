import { useState, useEffect } from 'react';
import { differenceInDays } from 'date-fns';
import { useProfile } from '@/hooks/useProfile';
import { 
  DOSE_SCHEDULE_3X, 
  DOSE_SCHEDULE_2X, 
  DOSE_SCHEDULE_OFFSET_MAX, 
  FASE3_START_DAY,
  TOTAL_PROGRAM_DAYS
} from '@/config/constants';

export function useDoseSchedule(providedCurrentDay?: number) {
  const { profile } = useProfile();
  // Fallback membaca currentDay dengan cara yang sama seperti di Dashboard
  // jika tidak ada global state useAppState
  let currentDay = providedCurrentDay;
  
  if (!currentDay) {
    const startDate = profile?.startDate ? new Date(profile.startDate) : new Date();
    const validStartDate = isNaN(startDate.getTime()) ? new Date() : startDate;
    const daysDiff = differenceInDays(new Date(), validStartDate);
    const calculatedDay = daysDiff + 1;
    currentDay = Math.min(Math.max(isNaN(calculatedDay) ? 1 : calculatedDay, 1), TOTAL_PROGRAM_DAYS);
  }

  const isFase3 = currentDay >= FASE3_START_DAY;
  const baseSchedule = isFase3 ? DOSE_SCHEDULE_2X : DOSE_SCHEDULE_3X;
  const frekuensi = isFase3 ? 2 : 3;
  const sendok = isFase3 ? 2 : 3;

  // Baca offset user dari localStorage
  const [offset, setOffsetState] = useState<number>(0);

  useEffect(() => {
    const savedOffset = localStorage.getItem('doseOffset');
    if (savedOffset) {
      setOffsetState(parseInt(savedOffset, 10));
    }
  }, []);

  const setOffset = (newOffset: number) => {
    const boundedOffset = Math.max(-DOSE_SCHEDULE_OFFSET_MAX, Math.min(newOffset, DOSE_SCHEDULE_OFFSET_MAX));
    setOffsetState(boundedOffset);
    localStorage.setItem('doseOffset', boundedOffset.toString());
  };

  // Hitung jam aktual
  const schedule = baseSchedule.map(jam => {
    let jamAktual = jam + offset;
    // Pastikan tetap dalam format 24 jam (0-23)
    if (jamAktual >= 24) jamAktual -= 24;
    if (jamAktual < 0) jamAktual += 24;
    return jamAktual;
  });

  return {
    currentDay,
    isFase3,
    frekuensi,
    sendok,
    baseSchedule,
    schedule,
    offset,
    setOffset
  };
}
