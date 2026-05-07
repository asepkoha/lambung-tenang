import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { ChevronRight } from 'lucide-react';

const slides = [
  {
    image: 'onboarding-1.webp',
    title: 'Teman Duduk, Bukan Dokter',
    text: 'Aplikasi ini adalah pendamping dari seorang mantan penderita. Bukan pengganti medis, tapi teman yang mengerti ritme pulihmu.',
  },
  {
    image: 'onboarding-2.webp',
    title: 'Check-in Harian, Bertahap',
    text: 'Setiap hari, kamu akan menulis perasaan, gejala, dan kegiatan. Tidak dikejar, tidak di-judge. Satu langkah kecil setiap hari.',
  },
  {
    image: 'onboarding-3.webp',
    title: 'Data Milikmu, di Hpmu',
    text: 'Semua yang kamu tulis tersimpan di perangkatmu. Tidak ada server, tidak ada yang membaca. Kamu punya kendali penuh.',
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { setHasVisited } = useSettings();
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1);
    } else {
      setHasVisited(true);
      navigate('/assessment');
    }
  };

  return (
    <div className="page-container min-h-screen flex flex-col pt-8 pb-24 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <div className="w-full max-w-[260px] max-h-[35vh] sm:max-h-[300px] rounded-3xl overflow-hidden shadow-xl mb-4 shrink-0">
              <img
                src={slides[current].image}
                alt={slides[current].title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3 shrink-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-lt-text-primary leading-tight">
                {slides[current].title}
              </h2>
              <p className="text-lt-text-secondary text-sm sm:text-base leading-relaxed px-4">
                {slides[current].text}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="w-full space-y-6 shrink-0 mt-6 pb-2">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 sm:w-8 bg-lt-color-primary' : 'w-1.5 sm:w-2 bg-lt-bg-subtle'}
              }`}
            />
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={next}
          className="btn-primary w-full flex items-center justify-center"
        >
          {current === slides.length - 1 ? 'Mulai Assessment' : 'Lanjut'}
          {current !== slides.length - 1 && <ChevronRight className="ml-2" />}
        </motion.button>
      </div>
    </div>
  );
}
