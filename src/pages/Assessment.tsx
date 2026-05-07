import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { allTrackContent } from '@/data/content';
import { useProfile } from '@/hooks/useProfile';
import { useEntries } from '@/hooks/useEntries';
import type { Track } from '@/types';
import { AssessmentWizard } from '@/features/assessment/components/AssessmentWizard';

export default function Assessment() {
  const navigate = useNavigate();
  const { updateProfile } = useProfile();
  const { setEntries } = useEntries();
  const [name, setName] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [track, setTrack] = useState<Track | null>(null);

  const handleAssessmentComplete = (selectedTrack: string) => {
    setTrack(selectedTrack as Track);
    setShowResult(true);
  };

  const finish = () => {
    if (track && name.trim()) {
      updateProfile({
        name: name.trim(),
        track: track,
        startDate: new Date().toISOString(),
        assessmentAnswers: [],
      });
      setEntries([]);
      navigate('/dashboard');
    }
  };

  if (showResult && track) {
    const info = allTrackContent[track];
    return (
      <div className="page-container min-h-screen flex flex-col justify-between pt-8 pb-24 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mt-4 mb-4 flex-1 flex flex-col justify-center"
        >
          <div
            className={cn(
              "w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 shadow-xl ring-4 ring-lt-bg-base shrink-0",
              track === 'A' ? 'border-track-A' : track === 'B' ? 'border-track-B' : 'border-track-C'
            )}
          >
            <img src={info.image} alt={info.name} className="w-full h-full object-cover bg-lt-bg-surface" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lt-text-secondary">Analisis Selesai</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-lt-text-primary leading-tight">
              {info.name}
            </h2>
          </div>
          <p className="text-lt-text-secondary text-xs sm:text-sm leading-relaxed px-4 mt-3 bg-lt-bg-subtle py-3 rounded-2xl italic border border-lt-border-subtle">
            "{info.description}"
          </p>
        </motion.div>

        <div className="w-full pb-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-soft p-4 mb-4 border border-lt-border-subtle shadow-lg"
          >
            <label className="block text-xs font-bold text-lt-text-secondary uppercase tracking-widest mb-2">
              Siapa namamu?
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik nama panggilanmu..."
              className="w-full h-14 px-4 rounded-xl border-lt-border-subtle bg-lt-bg-base focus-visible:border-[#0D5C4A] focus-visible:ring-[#0D5C4A]/25 text-base font-bold text-lt-text-primary transition-all placeholder:text-lt-text-muted/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  finish();
                }
              }}
              autoFocus
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.95 }}
            onClick={finish}
            disabled={!name.trim()}
            className="btn-primary w-full flex items-center justify-center"
          >
            Mulai Perjalanan
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container min-h-screen flex flex-col pt-6 pb-24 overflow-y-auto">
      <div className="mb-2 shrink-0 text-center">
        <h1 className="text-xl font-bold text-lt-text-primary">Asesmen Personal</h1>
        <p className="text-[10px] sm:text-xs text-lt-text-secondary">Bantu kami menyesuaikan program untukmu</p>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <AssessmentWizard onComplete={handleAssessmentComplete} />
      </div>
    </div>
  );
}
