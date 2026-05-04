import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getDayContent } from '@/data/content';
import { getStorageItem } from '@/hooks/useStorage';
import type { UserProfile } from '@/types';
import { ChevronLeft, CheckCircle2, Circle, Moon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { VoiceNotePlayer } from '@/components/VoiceNotePlayer';

export default function DayDetail() {
  const { dayNumber } = useParams<{ dayNumber: string }>();
  const navigate = useNavigate();
  const profile = getStorageItem<UserProfile>('lt-profile');
  const [missionsDone, setMissionsDone] = useState<Set<number>>(new Set());

  if (!profile || !dayNumber) return null;

  const day = parseInt(dayNumber, 10);
  const content = getDayContent(profile.track, day);

  const toggleMission = (i: number) => {
    setMissionsDone((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="page-container h-[100dvh] flex flex-col pt-6 pb-20 pb-safe-bottom">
      <div className="flex-1 overflow-y-auto scrollbar-hide -mx-6 px-6 pb-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-[#6B5B4F]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <span className="text-xs font-bold text-[#8FBC8F] uppercase tracking-wider">
              Hari {day}
            </span>
            <h1 className="text-xl font-bold text-[#3D322B]">{content.title}</h1>
          </div>
        </div>

        {/* Voice Note Player */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <VoiceNotePlayer 
            track={profile.track}
            day={day}
            title="Voice Note Pendamping"
          />
          
          {/* Transcript excerpt */}
          <div className="mt-3 px-1">
            <p className="text-[13px] text-[#6B5B4F] leading-relaxed italic opacity-80">
              "{content.voiceNotes.morning.substring(0, 100)}..."
            </p>
          </div>
        </motion.div>

        {/* Material */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-[#3D322B] mb-3">Materi Hari Ini</h2>
          <p className="text-[#6B5B4F] leading-relaxed text-sm whitespace-pre-line">
            {content.material}
          </p>
        </motion.div>

        {/* Dzikir/Ruhiyah Section for H1-4 (Pola Pikir) */}
        {profile.track === 'A' && day >= 1 && day <= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#f5f0e8] rounded-xl p-4 mb-6 border border-[#E8E2D5]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#D4A373]/20 rounded-full w-10 h-10 flex items-center justify-center">
                <Moon size={20} className="text-[#D4A373]" />
              </div>
              <h3 className="text-base font-bold text-[#3D322B]">Dzikir & Ruhiyah</h3>
              <Sparkles size={16} className="text-[#D4A373] ml-auto" />
            </div>
            <p className="text-sm text-[#6B5B4F] italic leading-relaxed">
              "Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Bersabarlah, karena kesabaran adalah kunci kemenangan."
            </p>
          </motion.div>
        )}

        {/* Daily Mission */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-[#3D322B] mb-4">Misi Hari Ini</h2>
          <div className="space-y-3">
            {content.mission.map((m, i) => (
              <button
                key={i}
                onClick={() => toggleMission(i)}
                className="w-full flex items-start gap-3 text-left p-3 rounded-xl hover:bg-[#F7F5F0] transition-colors"
              >
                {missionsDone.has(i) ? (
                  <CheckCircle2 size={22} className="text-[#8FBC8F] flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle size={22} className="text-[#E8E2D5] flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${missionsDone.has(i) ? 'text-[#B5ADA0] line-through' : 'text-[#6B5B4F]'}`}>
                  {m}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Check-in CTA */}
      <div className="pt-2">
        <button
          onClick={() => navigate(`/checkin/${day}`)}
          className="btn-primary w-full"
        >
          {day === new Date().getDate() ? 'Check-in Hari Ini' : `Check-in Hari ${day}`}
        </button>
      </div>
    </div>
  );
}
