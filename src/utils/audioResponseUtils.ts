import type { ProgramTrack, UniversalAudio } from '@/types';
import { UNIVERSAL_AUDIO } from '@/data/voiceNotes';

/**
 * Get a random universal audio response for the given context
 */
export function getUniversalAudio(context: 'acknowledge' | 'comfort' | 'celebrate'): UniversalAudio | null {
  const audios = UNIVERSAL_AUDIO[context];
  if (!audios || audios.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * audios.length);
  return audios[randomIndex];
}

/**
 * Get context-specific audio based on user state
 */
export function getContextAudio(
  _programTrack: ProgramTrack,
  context: 'acknowledge' | 'comfort' | 'celebrate',
  variant?: 1 | 2 | 3
): UniversalAudio | null {
  const audios = UNIVERSAL_AUDIO[context];
  if (!audios || audios.length === 0) return null;

  if (variant) {
    return audios.find(audio => audio.variant === variant) || null;
  }

  // Return random variant
  const randomIndex = Math.floor(Math.random() * audios.length);
  return audios[randomIndex];
}