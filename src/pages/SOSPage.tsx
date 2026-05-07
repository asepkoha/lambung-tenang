import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Wind, Shield } from 'lucide-react';

type BreathPhase = 'inhale' | 'hold' | 'exhale';

const PHASE_DURATIONS: Record<BreathPhase, number> = {
  inhale: 4000,
  hold: 4000,
  exhale: 6000,
};

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Tarik napas...',
  hold: 'Tahan sebentar...',
  exhale: 'Buang perlahan...',
};

const VALIDATION_MESSAGES = [
  'Kamu aman di sini',
  'Ini hanya asam lambung, ia akan segera lewat',
  'Napas pelan-pelan, tidak perlu buru-buru',
  'Tubuhmu sedang bekerja keras, beri waktu',
  'Kamu tidak sendiri dalam momen ini',
];

export default function SOSPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [messageIndex, setMessageIndex] = useState(0);

  // Breathing cycle: 4-4-6
  useEffect(() => {
    const sequence: BreathPhase[] = ['inhale', 'hold', 'exhale'];
    let currentIndex = 0;

    const runCycle = () => {
      const currentPhase = sequence[currentIndex];
      setPhase(currentPhase);
      const duration = PHASE_DURATIONS[currentPhase];

      const timeout = setTimeout(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        runCycle();
      }, duration);

      return timeout;
    };

    const timeout = runCycle();
    return () => clearTimeout(timeout);
  }, []);

  // Rotate validation messages every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % VALIDATION_MESSAGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Circle size based on phase
  const circleScale = phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 0.8;
  const circleDuration = PHASE_DURATIONS[phase] / 1000;

  return (
    <div className="fixed inset-0 bg-[#0D1117] text-white flex flex-col overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#2D5F5F]/20 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-white/60 hover:text-white/90 transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={20} />
          <span className="text-sm">Kembali</span>
        </button>
        <div className="flex items-center gap-2 text-white/50">
          <Shield size={14} />
          <span className="text-[11px] uppercase tracking-widest">Ruang Aman</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Breathing circle */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-10">
          {/* Outer glow */}
          <motion.div
            animate={{ scale: circleScale, opacity: phase === 'exhale' ? 0.3 : 0.6 }}
            transition={{ duration: circleDuration, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-[#5EB3B3]/30 blur-2xl"
          />
          {/* Middle ring */}
          <motion.div
            animate={{ scale: circleScale }}
            transition={{ duration: circleDuration, ease: 'easeInOut' }}
            className="absolute w-48 h-48 rounded-full bg-gradient-to-br from-[#5EB3B3]/40 to-[#2D5F5F]/40 backdrop-blur-sm"
          />
          {/* Inner circle */}
          <motion.div
            animate={{ scale: circleScale * 0.9 }}
            transition={{ duration: circleDuration, ease: 'easeInOut' }}
            className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#7FC7C7] to-[#5EB3B3] shadow-[0_0_60px_rgba(126,199,199,0.5)] flex items-center justify-center"
          >
            <Wind size={32} className="text-white/80" />
          </motion.div>
        </div>

        {/* Phase label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-light text-[#7FC7C7] tracking-wide mb-3"
          >
            {PHASE_LABELS[phase]}
          </motion.p>
        </AnimatePresence>

        {/* Validation message - fixed height agar breathing circle tidak naik turun */}
        <div className="h-10 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="text-xs text-white/70 text-center max-w-[240px] leading-snug italic"
            >
              "{VALIDATION_MESSAGES[messageIndex]}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="relative z-10 px-5 pb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-lt-color-primary hover:bg-lt-color-primary-dark text-white font-bold transition-all shadow-lg active:scale-[0.98]"
        >
          <span>Saya Sudah Tenang</span>
        </button>
      </div>
    </div>
  );
}
