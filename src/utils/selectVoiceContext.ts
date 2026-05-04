import { getVoiceNote } from '@/data/voiceNotes';
import type { Track, VoiceContext, DayEntry } from '@/types';

/**
 * Logic to select the most appropriate voice note context based on check-in data.
 */
export function selectVoiceContext(
  checkinData: any, 
  previousEntries: DayEntry[] = []
): VoiceContext {
  if (!checkinData) return 'morning';

  // Normalize checkin data
  const mood = checkinData.mood || 3;
  // Handle both 'anxiety' from wizard and 'anxietyLevel' from structured entry
  const anxiety = checkinData.anxiety || checkinData.anxietyLevel || 5;
  
  // Normalize symptoms to always be an array of strings
  let symptomsArray: string[] = [];
  if (Array.isArray(checkinData.symptoms)) {
    symptomsArray = checkinData.symptoms;
  } else if (checkinData.symptoms && typeof checkinData.symptoms === 'object') {
    // If it's an object format { heartburn: true, nausea: false }
    symptomsArray = Object.entries(checkinData.symptoms)
      .filter(([_, value]) => value === true)
      .map(([key]) => key);
  }

  // 1. Acknowledge: New symptoms reported that weren't in the previous entry
  if (previousEntries && previousEntries.length > 0) {
    const lastEntry = previousEntries[previousEntries.length - 1];
    const lastSymptomsRaw = lastEntry?.checkInData?.symptoms;
    
    let lastSymptomsArray: string[] = [];
    if (Array.isArray(lastSymptomsRaw)) {
      lastSymptomsArray = lastSymptomsRaw;
    } else if (lastSymptomsRaw && typeof lastSymptomsRaw === 'object') {
      lastSymptomsArray = Object.entries(lastSymptomsRaw)
        .filter(([_, value]) => value === true)
        .map(([key]) => key);
    }
    
    const hasNewSymptom = symptomsArray.some((s: string) => s !== 'none' && !lastSymptomsArray.includes(s));
    if (hasNewSymptom) return 'acknowledge';
  }

  // 2. Comfort: High anxiety or high physical symptom count
  const nonNoneSymptoms = symptomsArray.filter(s => s !== 'none');
  if (anxiety >= 8 || nonNoneSymptoms.length >= 3) {
    return 'comfort';
  }

  // 3. Celebrate: Good mood and minimal symptoms
  const isMinimalSymptoms = nonNoneSymptoms.length <= 1;
  if (mood >= 4 && isMinimalSymptoms) {
    return 'celebrate';
  }

  // 4. Default: Morning/Standard
  return 'morning';
}

/**
 * Gets the specific script and context for today's check-in.
 */
export function getTodayVoiceNote(track: Track, day: number, checkinData: any, previousEntries: DayEntry[] = []) {
  const context = selectVoiceContext(checkinData, previousEntries);
  const script = getVoiceNote(track, day, context);
  
  return {
    context,
    script
  };
}
