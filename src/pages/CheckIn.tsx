import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { getDayContent } from '@/data/content';
import type { DayEntry, CheckInData } from '@/types';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { CheckInWizard } from '@/features/checkin/components/CheckInWizard';
import { VoiceNotePlayer } from '@/features/dashboard/components/VoiceNotePlayer';
import { selectVoiceContext } from '@/utils/selectVoiceContext';

// Wizard form data structure (matches CheckInWizard internal state)
interface WizardFormData {
  mood?: number;
  anxiety?: number;
  symptoms?: string[];
  food?: string;
  sleep?: number;
  activities?: string[];
  reflection?: string;
  walmagh?: 'sesuai' | 'tidak_sesuai' | 'belum';
}

export default function CheckIn() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { entries: previousEntries, addEntry } = useEntries();
  const [showSummary, setShowSummary] = useState(false);
  const [checkinData, setCheckinData] = useState<CheckInData | null>(null);

  if (!profile || !dayNumber) return null;
  const day = parseInt(dayNumber, 10);
  const track = profile.track || 'A'; // Use track from profile
  const dayContent = getDayContent(track, day);

  const handleComplete = (data: WizardFormData) => {
    const context = selectVoiceContext(data, previousEntries);
    
    const newEntry: DayEntry = {
      dayNumber: day,
      date: new Date().toISOString(),
      completed: true,
      checkInData: {
        mood: data?.mood || 3,
        anxietyLevel: data?.anxiety || 5,
        symptoms: {
          heartburn: data?.symptoms?.includes('heartburn') || false,
          bloating: data?.symptoms?.includes('bloating') || false,
          nausea: data?.symptoms?.includes('nausea') || false,
          chestTightness: data?.symptoms?.includes('reflux') || false, // Mapping for consistency
          swallowingDifficulty: false,
          none: data?.symptoms?.includes('none') || false,
        },
        triggers: data?.food ? [data.food] : [],
        sleepHours: data?.sleep || 7,
        sleepQuality: 3, // Wizard uses sleep hours mainly, could be enhanced
        activities: data?.activities || [],
        notes: data?.reflection || '',
        walmagh: data?.walmagh || undefined,
      },
      voiceNotePlayed: false,
      voiceNoteContext: context,
    };

    addEntry(newEntry);
    setCheckinData(newEntry.checkInData ?? null);
    setShowSummary(true);
    toast.success("Check-in hari ini tersimpan ✓");
  };

  const handleDone = () => {
    navigate('/dashboard');
  };

  if (showSummary) {
    return (
      <div className="page-container min-h-screen flex flex-col pt-8 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sage/10 rounded-full flex items-center justify-center mb-4 shrink-0">
            <Star size={32} className="text-sage fill-sage" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-sage-text dark:text-dark-text mb-1">Check-in Selesai</h2>
          <p className="text-sage-muted dark:text-dark-muted text-xs sm:text-sm mb-8">Terima kasih sudah menemani dirimu hari ini.</p>

          <div className="w-full space-y-3 mb-8">
            <div className="text-left px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sage-muted dark:text-dark-muted">
                Respons Khusus Untukmu
              </span>
            </div>
            <VoiceNotePlayer
              track={profile.track || 'A'}
              day={day}
              checkinData={checkinData}
              className="shadow-xl shadow-sage/5 border border-sage-light dark:border-dark-disabled"
            />
          </div>

          <div className="w-full mt-auto shrink-0">
            <button onClick={handleDone} className="btn-primary w-full">
              Selesai & Kembali
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex flex-col pt-6 pb-24 overflow-y-auto">
      <div className="mb-4 shrink-0 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-sage-text dark:text-dark-text">Check-in Hari {day}</h1>
        <p className="text-[10px] sm:text-sm text-sage-muted dark:text-dark-muted italic">"{dayContent.subtitle}"</p>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <CheckInWizard dayNumber={day} onComplete={handleComplete} />
      </div>
    </div>
  );
}
