import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStorageItem, setStorageItem } from '@/hooks/useStorage';
import { getDayContent } from '@/data/content';
import type { UserProfile, DayEntry } from '@/types';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { CheckInWizard } from '@/components/CheckInWizard';
import { VoiceNotePlayer } from '@/components/VoiceNotePlayer';
import { selectVoiceContext } from '@/utils/selectVoiceContext';

export default function CheckIn() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const profile = getStorageItem<UserProfile>('lt-profile');
  const [showSummary, setShowSummary] = useState(false);
  const [checkinData, setCheckinData] = useState<any>(null);

  if (!profile || !dayNumber) return null;
  const day = parseInt(dayNumber, 10);
  const dayContent = getDayContent(profile.track, day);

  const handleComplete = (data: any) => {
    const previousEntries = getStorageItem<DayEntry[]>('lt-entries') || [];
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
      },
      voiceNotePlayed: false,
      voiceNoteContext: context,
    };

    const entries = [...previousEntries];
    const existingIndex = entries.findIndex((e) => e.dayNumber === day);
    if (existingIndex >= 0) {
      entries[existingIndex] = newEntry;
    } else {
      entries.push(newEntry);
    }

    setStorageItem('lt-entries', entries);
    setCheckinData(newEntry.checkInData);
    setShowSummary(true);
    toast.success("Check-in hari ini tersimpan ✓");
  };

  const handleDone = () => {
    navigate('/dashboard');
  };

  if (showSummary) {
    return (
      <div className="page-container h-[100dvh] flex flex-col pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#8FBC8F]/10 rounded-full flex items-center justify-center mb-4 shrink-0">
            <Star size={32} className="text-[#8FBC8F] fill-[#8FBC8F]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3D322B] mb-1">Check-in Selesai</h2>
          <p className="text-[#6B5B4F] text-xs sm:text-sm mb-8">Terima kasih sudah menemani dirimu hari ini.</p>

          <div className="w-full space-y-3 mb-8">
            <div className="text-left px-1">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B5ADA0]">
                Respons Khusus Untukmu
              </span>
            </div>
            <VoiceNotePlayer 
              track={profile.track}
              day={day}
              checkinData={checkinData}
              className="shadow-xl shadow-[#8FBC8F]/5 border border-[#E8E2D5]"
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
    <div className="page-container h-[100dvh] flex flex-col pt-6 pb-2">
      <div className="mb-4 shrink-0 text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-[#3D322B]">Check-in Hari {day}</h1>
        <p className="text-[10px] sm:text-sm text-[#B5ADA0] italic">"{dayContent.subtitle}"</p>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <CheckInWizard dayNumber={day} onComplete={handleComplete} />
      </div>
    </div>
  );
}
