import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getCurrentDay, calculateStreak } from '@/utils/programUtils';
import {
  Sprout,
  Lock,
  CheckCircle2,
  Flame,
  Smile,
  Heart,
  ChevronRight,
  ArrowRight,
  MoreHorizontal,
  Download,
  X,
} from 'lucide-react';
import { VoiceNotePlayer } from '@/features/dashboard/components/VoiceNotePlayer';
import { SOSButton } from '@/features/sos/components/SOSButton';
import { DoseTimeline } from '@/features/dashboard/components/DoseTimeline';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { usePWAInstall } from '@/hooks/useTheme';
import { allTrackContent } from '@/data/content';
import { cn } from '@/lib/utils';

interface HomeScreenProps {
  userName?: string;
  currentDay?: number;
  totalDays?: number;
  lessonTitle?: string;
  lessonQuote?: string;
  motivationMessage?: string;
}

const DEFAULT_MOTIVATION =
  'Tenang ya, jalani pelan-pelan. Hari ini nggak usah mikirin yang lain, cukup fokus ke dirimu sendiri dulu. Allah Mahatahu setiap usahamu';

export default function HomeScreen(props: HomeScreenProps) {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { entries } = useEntries();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { canInstall, install, dismiss } = usePWAInstall();

  const today = new Date();
  const trackContent = profile ? allTrackContent[profile.track] : null;
  const computedCurrentDay = getCurrentDay(profile?.startDate);
  // Keep isComplete logic simple, just check if they are past day 14.
  // We can calculate daysDiff here or just assume if computedCurrentDay === 14 and they've actually completed 14 it might be done,
  // but to preserve exact behavior:
  const isComplete = profile?.startDate ? (differenceInDays(new Date(), new Date(profile.startDate)) + 1 > 14) : false;

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  // Redirect to completion page if program is finished (only once per session)
  useEffect(() => {
    if (isComplete && profile) {
      const alreadySeen = sessionStorage.getItem('lt-completion-seen');
      if (!alreadySeen) {
        sessionStorage.setItem('lt-completion-seen', '1');
        navigate('/completion');
      }
    }
  }, [isComplete, navigate, profile]);

  if (!profile) return null;

  const userName = props.userName ?? profile.name;
  const currentDay = props.currentDay ?? computedCurrentDay;
  const totalDays = props.totalDays ?? 14;
  const dayContent = trackContent?.days[currentDay - 1];
  const lessonTitle = props.lessonTitle ?? dayContent?.title ?? '—';
  const lessonQuote = props.lessonQuote ?? dayContent?.subtitle ?? '';
  const motivationMessage = props.motivationMessage ?? DEFAULT_MOTIVATION;

  const todayEntry = entries.find((e) => e.dayNumber === currentDay);
  const streak = calculateStreak(entries);

  const moodLabels = ['Sangat Sedih', 'Sedih', 'Biasa', 'Baik', 'Sangat Baik'];
  const moodStatus = todayEntry?.checkInData?.mood
    ? moodLabels[todayEntry.checkInData.mood - 1]
    : 'Belum dicatat';

  const handleCheckIn = () => navigate(`/checkin/${currentDay}`);
  const handleViewDay = () => navigate(`/day/${currentDay}`);

  if (isLoading || !trackContent) {
    return (
      <div className="min-h-screen bg-lt-bg-base animate-pulse">
        <div className="h-14 bg-lt-bg-subtle/40" />
        <div className="p-4 space-y-4">
          <div className="h-6 w-48 bg-lt-bg-subtle/60 rounded" />
          <div className="h-12 w-40 bg-lt-bg-subtle/60 rounded" />
          <div className="h-32 bg-lt-bg-subtle/40 rounded-2xl" />
          <div className="h-64 bg-lt-bg-subtle/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-lt-text-primary pb-20">
      {/* Topbar */}
      <header className="sticky top-0 z-30 bg-lt-bg-base/90 backdrop-blur border-b border-lt-border-subtle">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/logo-kas.webp" alt="Lambung Tenang" className="w-9 h-9 rounded-full object-cover border border-lt-border-subtle" />
            <span className="text-sm font-semibold text-lt-text-primary">Lambung Tenang</span>
          </div>
          <SOSButton />
        </div>
      </header>

      <div className="px-4 pt-4">
        {/* Greeting + Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-3 mb-4"
        >
          <div>
            <p className="text-sm text-lt-text-secondary mb-1">Salam hangat,</p>
            <h1 className="text-xl font-bold text-lt-text-primary leading-tight">
              Kak {userName}
            </h1>
          </div>
          <div className="px-3 py-1 rounded-full text-[9px] font-bold text-white bg-lt-color-primary uppercase tracking-wider whitespace-nowrap mt-1 shrink-0">
            {trackContent.name}
          </div>
        </motion.div>

        {/* PWA Install Banner */}
        {canInstall && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-lt-bg-subtle border border-lt-border-subtle rounded-2xl p-4 mb-4 flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-lt-color-primary/20 rounded-full flex items-center justify-center shrink-0 border border-lt-border-subtle">
                <Download size={20} className="text-lt-color-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-lt-text-primary">
                  Pasang di Home Screen
                </p>
                <p className="text-xs text-lt-text-secondary">
                  Akses lebih cepat tanpa browser
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowInstallModal(true)}
                className="px-4 py-2 bg-lt-color-primary hover:bg-lt-color-primary/90 text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
              >
                Pasang
              </button>
              <button
                onClick={dismiss}
                className="p-2 text-lt-text-muted hover:text-lt-text-primary transition-colors"
                aria-label="Tutup"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Hero — satu baris */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-baseline gap-2 flex-wrap">
            <h2 className="text-4xl font-bold text-lt-text-primary leading-none">
              {isComplete ? 'Selesai' : `Hari ${currentDay}`}
            </h2>
            <span className="text-xs text-lt-text-secondary">
              • {format(today, 'EEEE, d MMMM yyyy', { locale: id })}
            </span>
          </div>
        </motion.div>

        {/* Progress 14 Hari */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-lt-text-secondary">
              Perjalanan 14 Hari
            </span>
            <span className="text-xs font-medium text-lt-color-primary">
              {currentDay} / {totalDays}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }, (_, i) => {
              const dayNum = i + 1;
              const entry = entries.find((e) => e.dayNumber === dayNum);
              const isDone = entry?.completed;
              const isToday = dayNum === currentDay;
              const isFuture = dayNum > currentDay;

              let pillClass = 'bg-lt-bg-surface shadow-sm';
              let textClass = 'text-lt-text-secondary';
              let icon: React.ReactNode = null;
              let label: React.ReactNode = (
                <span className="text-xs font-semibold">{dayNum}</span>
              );

              if (isToday) {
                pillClass = 'bg-lt-color-primary shadow-[0_0_12px_rgba(107,142,90,0.4)]';
                textClass = 'text-white font-bold';
                icon = <Sprout size={22} className="text-white" strokeWidth={2.5} />;
                label = null;
              } else if (isDone) {
                pillClass = 'bg-[rgba(107,142,90,0.12)]';
                textClass = 'text-lt-color-primary';
                icon = <CheckCircle2 size={18} className="text-lt-color-primary" strokeWidth={2.5} />;
                label = null;
              } else if (isFuture) {
                pillClass = 'bg-[rgba(255,255,255,0.05)] opacity-40';
                textClass = 'text-lt-text-secondary';
                icon = <Lock size={12} className="text-lt-text-secondary" />;
              }

              return (
                <motion.button
                  key={dayNum}
                  whileTap={!isFuture ? { scale: 0.94 } : {}}
                  onClick={() => !isFuture && navigate(`/day/${dayNum}`)}
                  disabled={isFuture}
                  className={cn(
                    'relative h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all',
                    pillClass,
                    textClass,
                    isFuture && 'cursor-not-allowed'
                  )}
                >
                  {icon}
                  {label}
                  {isToday && (
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-lt-color-primary whitespace-nowrap">
                      Hari {dayNum}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <div className="mb-6">
          <DoseTimeline />
        </div>

        {/* Card "UNTUK HARI INI" */}
        {!isComplete && dayContent && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-lt-bg-surface rounded-2xl shadow-sm dark:shadow-black/40 p-5 mb-4 mt-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-1 rounded-full bg-lt-color-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-lt-color-primary">
                Untuk Hari Ini
              </span>
            </div>

            <h3 className="text-lg font-bold text-lt-text-primary mb-1">{lessonTitle}</h3>
            <p className="text-sm italic text-lt-text-secondary leading-relaxed mb-4">
              "{lessonQuote}"
            </p>

            <VoiceNotePlayer
              track={profile.track}
              day={currentDay}
              audioType="morning"
              checkinData={todayEntry?.checkInData}
              className="mb-4"
            />

            <div className="flex gap-2 items-center">
              <button
                onClick={handleCheckIn}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-lt-color-primary hover:bg-lt-color-primary/90 text-white font-medium text-sm transition-colors shadow-sm"
              >
                {todayEntry?.completed ? 'Update Check-in' : 'Yuk, Cerita Kondisi Hari Ini'}
              </button>
              <button
                onClick={handleViewDay}
                aria-label="Lihat detail hari"
                className="w-12 h-12 rounded-full border border-lt-border-subtle hover:border-lt-color-primary flex items-center justify-center text-lt-color-primary transition-colors bg-lt-bg-base"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Mini cards: Konsistensi & Perasaanmu */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-lt-bg-surface rounded-2xl shadow-sm p-4 border border-lt-border-subtle">
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-lt-bg-subtle flex items-center justify-center border border-lt-border-subtle">
                <Flame size={16} className="text-lt-color-primary" />
              </div>
              <button aria-label="Opsi" className="text-lt-text-muted hover:text-lt-text-primary">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="text-2xl font-bold text-lt-text-primary leading-tight">
              {streak} <span className="text-sm font-normal text-lt-text-secondary">hari</span>
            </p>
            <p className="text-[11px] text-lt-text-secondary">berturut-turut</p>
          </div>

          <div className="bg-lt-bg-surface rounded-2xl shadow-sm p-4 border border-lt-border-subtle">
            <div className="flex items-start justify-between mb-2">
              <div className="w-8 h-8 rounded-full bg-lt-bg-subtle flex items-center justify-center border border-lt-border-subtle">
                <Smile size={16} className="text-lt-color-primary" />
              </div>
              <button aria-label="Opsi" className="text-lt-text-muted hover:text-lt-text-primary">
                <MoreHorizontal size={16} />
              </button>
            </div>
            <p className="text-xs text-lt-text-secondary mb-1">Perasaanmu</p>
            <p className="text-sm font-semibold text-lt-text-primary mb-1">{moodStatus}</p>
            {!todayEntry?.checkInData?.mood && (
              <button
                onClick={handleCheckIn}
                className="flex items-center gap-1 text-[11px] font-semibold text-lt-color-primary hover:text-lt-color-primary/80"
              >
                Catat sekarang <ArrowRight size={11} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Pesan dari kakak */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-lt-bg-subtle rounded-2xl p-4 flex gap-3 items-start border border-lt-border-subtle"
        >
          <div className="w-9 h-9 rounded-full bg-lt-bg-surface flex items-center justify-center shrink-0 border border-lt-border-subtle shadow-sm">
            <Heart size={16} className="text-lt-color-primary fill-lt-color-primary/20" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-lt-color-primary mb-1">Pesan dari Kang Asep</p>
            <p className="text-xs text-lt-text-secondary leading-relaxed italic">
              "{motivationMessage}"
            </p>
          </div>
        </motion.div>
      </div>

      {/* PWA Install Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-lt-bg-surface rounded-3xl shadow-xl p-6 w-full max-w-sm border border-lt-border-subtle"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-lt-color-primary/20 rounded-full flex items-center justify-center border border-lt-border-subtle">
                    <Download size={24} className="text-lt-color-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-lt-text-primary">
                      Pasang Aplikasi
                    </h3>
                    <p className="text-xs text-lt-text-secondary">
                      Lambung Tenang di HP kamu
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="p-2 text-lt-text-muted hover:text-lt-text-primary transition-colors"
                  aria-label="Tutup"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lt-color-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-lt-color-primary/20">
                    <span className="text-lt-color-primary text-xs">✓</span>
                  </div>
                  <p className="text-sm text-lt-text-primary">
                    Akses offline tanpa internet
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lt-color-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-lt-color-primary/20">
                    <span className="text-lt-color-primary text-xs">✓</span>
                  </div>
                  <p className="text-sm text-lt-text-primary">
                    Icon di home screen seperti native app
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lt-color-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-lt-color-primary/20">
                    <span className="text-lt-color-primary text-xs">✓</span>
                  </div>
                  <p className="text-sm text-lt-text-primary">
                    Loading lebih cepat dan ringan
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-lt-color-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5 border border-lt-color-primary/20">
                    <span className="text-lt-color-primary text-xs">✓</span>
                  </div>
                  <p className="text-sm text-lt-text-primary">
                    Notifikasi pengingat tetap berfungsi
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInstallModal(false)}
                  className="flex-1 px-4 py-3 bg-lt-bg-subtle text-lt-text-primary rounded-full font-semibold text-sm transition-colors hover:bg-lt-bg-subtle/80"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    await install();
                    setShowInstallModal(false);
                  }}
                  className="flex-1 px-4 py-3 bg-lt-color-primary text-white rounded-full font-semibold text-sm transition-colors hover:bg-lt-color-primary/90 shadow-sm"
                >
                  Lanjutkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
