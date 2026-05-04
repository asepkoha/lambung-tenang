import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStorageItem } from '@/hooks/useStorage';
import { allTrackContent } from '@/data/content';
import type { UserProfile, DayEntry } from '@/types';
import { CheckCircle2, ChevronRight, Sprout, Lock, Flame, Smile } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { VoiceNotePlayer } from '@/components/VoiceNotePlayer';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = getStorageItem<UserProfile>('lt-profile');
  const entries = getStorageItem<DayEntry[]>('lt-entries') || [];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for shimmer effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!profile) return null;

  if (isLoading) {
    return (
      <div className="page-container pb-24 px-4 sm:px-6 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2 mb-8">
          <div className="h-4 w-32 bg-[#E8E4DF] rounded" />
          <div className="flex items-center justify-between">
            <div className="h-8 w-48 bg-[#E8E4DF] rounded" />
            <div className="h-6 w-24 bg-[#E8E4DF] rounded-full" />
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-[#E8E4DF] rounded" />
            <div className="h-4 w-20 bg-[#E8E4DF] rounded" />
          </div>
          <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-hidden pb-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative w-20 sm:w-24 shrink-0 aspect-square rounded-2xl bg-[#E8E4DF]" />
            ))}
          </div>
        </div>

        {/* Card Skeleton */}
        <div className="h-64 bg-[#E8E4DF] rounded-2xl mb-6" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-[#E8E4DF] rounded-2xl" />
          <div className="h-24 bg-[#E8E4DF] rounded-2xl" />
        </div>
      </div>
    );
  }

  const trackContent = profile?.track ? allTrackContent[profile.track] : null;
  const startDate = profile?.startDate ? new Date(profile.startDate) : new Date();
  const today = new Date();
  
  // Ensure startDate is a valid date
  const validStartDate = isNaN(startDate.getTime()) ? new Date() : startDate;
  const daysDiff = differenceInDays(today, validStartDate);
  
  // Robust day calculation
  const calculatedDay = daysDiff + 1;
  const currentDay = Math.min(Math.max(isNaN(calculatedDay) ? 1 : calculatedDay, 1), 14);
  const isComplete = (daysDiff + 1) > 14;

  const todayEntry = entries.find((e) => e.dayNumber === currentDay);
  const dayContent = trackContent?.days[currentDay - 1];

  // Stats
  const streak = entries.reduce((max, entry, i, arr) => {
    if (!entry.completed) return max;
    let count = 1;
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j]?.completed) count++;
      else break;
    }
    return Math.max(max, count);
  }, 0);

  const entriesWithMood = entries.filter((e) => e.checkInData?.mood);
  const avgMood = entriesWithMood.length > 0
    ? entriesWithMood.reduce((acc, curr) => acc + (curr.checkInData?.mood || 0), 0) / entriesWithMood.length
    : 0;

  const handleCheckIn = () => navigate(`/checkin/${currentDay}`);
  const handleViewDay = () => navigate(`/day/${currentDay}`);

  if (!trackContent) return null;

  return (
    <div className="page-container min-h-screen pt-6 pb-20 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <p className="text-[#6B5B4F] text-sm mb-1">Halo, {profile.name}. Gimana kabarmu hari ini?</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#3D322B]">
              {isComplete ? 'Program Selesai' : `Hari ${currentDay}`}
            </h1>
            <span className="text-xs font-medium text-[#6B5B4F] mb-0.5">
              • {format(today, 'd MMM yyyy', { locale: id })}
            </span>
          </div>
          <div 
            className="px-2 py-1 rounded-full text-[9px] font-bold text-white bg-[#6B8E5A] uppercase tracking-wider"
          >
            {trackContent.name}
          </div>
        </div>
      </motion.div>

      {/* 14-Day Grid */}
      <div className="mb-6 px-4">
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 14 }, (_, i) => {
            const dayNum = i + 1;
            const entry = entries.find((e) => e.dayNumber === dayNum);
            const isDone = entry?.completed;
            const isToday = dayNum === currentDay;
            const isPast = dayNum < currentDay;
            const isFuture = dayNum > currentDay;
            
            // Color Logic
            let bgColor = "bg-white";
            let borderColor = "border-2 border-transparent";
            let textColor = "text-[#A0A0A0]";
            let icon = null;
            
            if (isToday) {
              bgColor = "bg-[#E8F0E3]";
              borderColor = "border-2 border-[#6B8E5A]";
              textColor = "text-[#6B8E5A]";
              icon = <Sprout size={20} strokeWidth={2} className="text-[#6B8E5A]" />;
            } else if (isFuture) {
              bgColor = "bg-white";
              borderColor = "border-2 border-[#EDE9E3]";
              textColor = "text-[#A0A0A0]";
              icon = <Lock size={12} strokeWidth={1.5} className="text-[#A0A0A0]" />;
            } else if (isDone) {
              bgColor = "bg-white";
              borderColor = "border-2 border-[#6B8E5A]";
              textColor = "text-[#6B8E5A]";
              icon = <CheckCircle2 size={16} strokeWidth={2.5} className="text-[#6B8E5A]" />;
            } else if (isPast && !isDone) {
              bgColor = "bg-white";
              borderColor = "border-2 border-[#C4A484]/30";
              textColor = "text-[#C4A484]";
            }

            return (
              <motion.button
                key={dayNum}
                whileTap={!isFuture ? { scale: 0.95 } : {}}
                whileHover={!isFuture ? { scale: 1.05 } : {}}
                onClick={() => !isFuture && navigate(`/day/${dayNum}`)}
                disabled={isFuture}
                className={cn(
                  "relative w-full h-16 rounded-2xl flex flex-col items-center justify-center transition-all gap-1",
                  bgColor,
                  borderColor,
                  textColor,
                  isFuture && "cursor-not-allowed"
                )}
              >
                {isToday ? (
                  // Hari 1 (Current/Active): icon replaces number
                  icon
                ) : (
                  <>
                    <span className="text-sm font-medium">{dayNum}</span>
                    {icon}
                  </>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

    {/* Today's Focused Card */}
    {!isComplete && dayContent && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-wide text-[#6B8E5A]">
            Untuk Hari ini
          </span>
          {todayEntry?.completed && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#6B8E5A] bg-[#6B8E5A]/10 px-2 py-0.5 rounded-full">
              <CheckCircle2 size={10} /> TERDATA
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">{dayContent.title}</h2>
        <p className="text-sm text-[#6B6B6B] mb-5 italic">"{dayContent.subtitle}"</p>

        <VoiceNotePlayer 
          track={profile.track}
          day={currentDay}
          checkinData={todayEntry?.checkInData}
          className="mb-4"
        />

        <div className="flex gap-2">
          <button 
            onClick={handleCheckIn} 
            className="btn-primary flex-1"
          >
            {todayEntry?.completed ? 'Update Check-in' : 'Yuk, Cerita Kondisi Hari ini'}
          </button>
          <button 
            onClick={handleViewDay} 
            className="btn-secondary h-12 w-12 flex items-center justify-center p-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </motion.div>
    )}

    {/* Completion state */}
    {isComplete && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-soft p-8 text-center"
      >
        <img src="growth.webp" alt="Pertumbuhan" className="w-32 h-32 mx-auto mb-4 rounded-full object-cover" />
        <h2 className="text-xl font-bold text-[#3D322B] mb-2">Selamat, {profile.name}!</h2>
        <p className="text-[#6B5B4F] mb-6">Kamu telah menyelesaikan 14 hari perjalanan ini.</p>
        <button onClick={() => navigate('/history')} className="btn-primary w-full">
          Lihat Riwayat Lengkap
        </button>
      </motion.div>
    )}

    {/* Quick Stats */}
    <div className="grid grid-cols-2 gap-3 mt-2 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm p-4"
      >
        <div className="flex items-start gap-3">
          <div className="bg-[#E8F0E3] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <Flame size={18} className="text-[#6B8E5A]" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-[#6B6B6B]">Konsistensi</span>
            <p className="text-2xl font-bold text-[#2D2D2D]">{streak} hari</p>
            <p className="text-xs text-[#A0A0A0]">hari berturut-turut</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm p-4"
      >
        <div className="flex items-start gap-3">
          <div className="bg-[#E8F0E3] rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <Smile size={18} className="text-[#6B8E5A]" />
          </div>
          <div className="flex-1">
            <span className="text-sm text-[#6B6B6B]">Perasaanmu</span>
            <p className="text-2xl font-bold text-[#2D2D2D]">
              {avgMood > 0 ? avgMood.toFixed(1) : '-'}
            </p>
            <p className="text-xs text-[#A0A0A0]">skala 1-5</p>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
}
