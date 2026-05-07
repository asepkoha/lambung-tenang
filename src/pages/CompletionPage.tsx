import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import { Trophy, Star, Sparkles, ArrowRight, RotateCcw, Heart } from 'lucide-react';

export default function CompletionPage() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { entries } = useEntries();

  // Generate confetti animation values once using lazy initialization
  const [confettiParticles] = useState(() => {
    return Array.from({ length: 20 }).map(() => ({
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
      rotate: Math.random() * 360,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      color: ['#8FCF97', '#8FCF97', '#E6F1E8', '#F2D8C9'][Math.floor(Math.random() * 4)],
    }));
  });

  if (!profile) return null;

  // Calculate stats
  const completedDays = entries.filter((e) => e.completed).length;
  const avgMood = entries.length > 0
    ? entries.reduce((acc, e) => acc + (e.checkInData?.mood || 0), 0) / entries.length
    : 0;
  const avgAnxiety = entries.length > 0
    ? entries.reduce((acc, e) => acc + (e.checkInData?.anxietyLevel || 0), 0) / entries.length
    : 0;

  // Streak calculation
  let streak = 0;
  for (let i = entries.length - 1; i >= 0; i--) {
    if (entries[i]?.completed) streak++;
    else break;
  }

  return (
    <div className="page-container min-h-screen flex flex-col pt-6 pb-24 overflow-y-auto">
      {/* Confetti Animation Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {confettiParticles.map((particle, i) => (
          <motion.div
            key={i}
            initial={{
              x: particle.x,
              y: -20,
              rotate: 0,
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 20 : 800,
              rotate: particle.rotate,
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'linear',
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              backgroundColor: particle.color,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex flex-col items-center justify-center text-center z-10 px-4"
      >
        {/* Trophy Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 bg-lt-color-primary/20 rounded-full flex items-center justify-center mb-6"
        >
          <Trophy size={48} className="text-lt-color-primary" />
        </motion.div>

        {/* Congratulations Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-lt-text-primary mb-3">
            Selamat, {profile.name}!
          </h1>
          <p className="text-lg text-lt-text-secondary leading-relaxed">
            Kamu telah menyelesaikan perjalanan<br />
            <span className="font-bold text-lt-color-primary">14 Hari Lambung Tenang</span>
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 gap-3 w-full max-w-xs mb-8"
        >
          <div className="bg-lt-bg-surface rounded-2xl p-4 shadow-sm border border-lt-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Star size={16} className="text-lt-color-primary" />
              <span className="text-xs text-lt-text-secondary">Hari Selesai</span>
            </div>
            <p className="text-2xl font-bold text-lt-text-primary">{completedDays}/14</p>
          </div>

          <div className="bg-lt-bg-surface rounded-2xl p-4 shadow-sm border border-lt-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-lt-color-primary" />
              <span className="text-xs text-lt-text-secondary">Streak</span>
            </div>
            <p className="text-2xl font-bold text-lt-text-primary">{streak} hari</p>
          </div>

          <div className="bg-lt-bg-surface rounded-2xl p-4 shadow-sm border border-lt-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Heart size={16} className="text-lt-color-primary" />
              <span className="text-xs text-lt-text-secondary">Mood Rata-rata</span>
            </div>
            <p className="text-2xl font-bold text-lt-text-primary">{avgMood.toFixed(1)}/5</p>
          </div>

          <div className="bg-lt-bg-surface rounded-2xl p-4 shadow-sm border border-lt-border-subtle">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-lt-color-primary" />
              <span className="text-xs text-lt-text-secondary">Anxiety Rata-rata</span>
            </div>
            <p className="text-2xl font-bold text-lt-text-primary">{avgAnxiety.toFixed(1)}/10</p>
          </div>
        </motion.div>

        {/* Encouragement Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-lt-bg-subtle rounded-2xl p-4 mb-8 max-w-xs border border-lt-border-subtle"
        >
          <p className="text-sm text-lt-text-secondary italic leading-relaxed">
            "Perjalanan ini bukanlah akhir, melainkan awal dari kebiasaan baik yang telah kamu bangun. Teruslah berproses dengan penuh kasih sayang pada dirimu sendiri."
          </p>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="w-full space-y-3 z-10 px-4"
      >
        <button
          onClick={() => navigate('/history')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          Lihat Riwayat Lengkap
          <ArrowRight size={18} />
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Kembali ke Dashboard
        </button>
      </motion.div>
    </div>
  );
}
