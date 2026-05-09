export type Track = 'A' | 'B' | 'C';
export type VoiceContext = 'morning' | 'comfort' | 'celebrate' | 'acknowledge';

export interface DayAudio {
  day: number;
  track: Track;
  morningAudioUrl: string;
  morningTitle: string;
  isUnlocked: boolean;
}

export interface UniversalAudio {
  type: 'acknowledge' | 'comfort' | 'celebrate';
  variant: 1 | 2 | 3;
  audioUrl: string;
  label: string;
}

export interface UserProfile {
  name: string;
  track: Track;
  startDate: string;
  assessmentAnswers: number[];
}

export interface GerdSymptoms {
  heartburn: boolean;
  bloating: boolean;
  nausea: boolean;
  chestTightness: boolean;
  swallowingDifficulty: boolean;
  none: boolean;
}

export interface CheckInData {
  mood: number; // 1-5
  anxietyLevel: number; // 1-10
  symptoms: GerdSymptoms;
  triggers: string[];
  sleepHours: number;
  sleepQuality: number; // 1-5
  activities: string[];
  notes: string;
  walmagh?: 'sesuai' | 'tidak_sesuai' | 'belum';
}

export interface DayEntry {
  dayNumber: number;
  date: string;
  completed: boolean;
  checkInData?: CheckInData;
  voiceNotePlayed: boolean;
  voiceNoteContext?: VoiceContext;
}

export interface AppSettings {
  reminderEnabled: boolean;
  reminderTime: string; // "08:00"
  autoPlayVoice: boolean;
  onboardingDone: boolean;
  doseOffset: number;
}

export interface DayContent {
  dayNumber: number;
  title: string;
  subtitle: string;
  mission: string[];
  material: string;
  voiceNotes: Record<VoiceContext, string>;
}

export interface TrackContent {
  track: Track;
  name: string;
  description: string;
  image: string;
  color: string;
  days: DayContent[];
}

