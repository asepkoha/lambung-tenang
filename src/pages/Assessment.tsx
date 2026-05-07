import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 overflow-hidden border-4 shadow-xl ring-4 ring-white shrink-0"
            style={{ borderColor: info.color }}
          >
            <img src={info.image} alt={info.name} className="w-full h-full object-cover bg-white" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-sage-muted">Analisis Selesai</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-sage-text leading-tight">
              {info.name}
            </h2>
          </div>
          <p className="text-sage-muted text-xs sm:text-sm leading-relaxed px-4 mt-3 bg-white/50 py-3 rounded-2xl italic">
            "{info.description}"
          </p>
        </motion.div>

        <div className="w-full pb-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-soft p-4 mb-4 border-2 border-transparent shadow-lg"
          >
            <label className="block text-xs font-bold text-sage-muted uppercase tracking-widest mb-2">
              Siapa namamu?
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ketik nama panggilanmu..."
              className="w-full px-3 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:border-gray-400 focus:ring-4 focus:ring-gray-100 text-base font-bold text-sage-text transition-all"
              onKeyDown={(e) => e.key === 'Enter' && finish()}
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
        <h1 className="text-xl font-bold text-sage-text">Asesmen Personal</h1>
        <p className="text-[10px] sm:text-xs text-sage-muted">Bantu kami menyesuaikan program untukmu</p>
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <AssessmentWizard onComplete={handleAssessmentComplete} />
      </div>
    </div>
  );
}
