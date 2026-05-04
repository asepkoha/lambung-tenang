import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getStorageItem } from '@/hooks/useStorage';
import { Leaf } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();
  const profile = getStorageItem('lt-profile');
  const hasVisited = getStorageItem('lt-first-visit');

  const handleStart = () => {
    if (profile) {
      navigate('/dashboard');
    } else if (hasVisited) {
      navigate('/assessment');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="page-container h-[100dvh] flex flex-col justify-between relative overflow-hidden pt-8 pb-4 px-6">
      {/* Background decorative circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#E8E2D5] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-80px] w-[250px] h-[250px] rounded-full bg-[#A8D5A8]/30 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="flex flex-col items-center flex-1 justify-center z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="w-16 h-16 bg-[#8FBC8F]/10 rounded-full flex items-center justify-center mb-4"
        >
          <Leaf size={32} className="text-[#8FBC8F]" strokeWidth={1.5} />
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="w-full max-w-[240px] max-h-[35vh] sm:max-h-[280px] rounded-3xl overflow-hidden mb-6 shadow-lg flex-shrink-0"
        >
          <img
            src="/hero-splash.webp"
            alt="Ilustrasi tenang"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center my-2"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-[#3D322B] mb-2">Lambung Tenang</h1>
          <p className="text-[#6B5B4F] text-base sm:text-lg font-handwritten leading-relaxed">
            14 hari menemanimu, <br /> tanpa buru-buru.
          </p>
        </motion.div>
      </motion.div>

      {/* CTA Container */}
      <div className="w-full z-10 flex flex-col items-center pb-2">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={handleStart}
          className="btn-primary w-full mb-3"
        >
          {profile ? 'Lanjutkan Perjalanan' : 'Mulai Perjalanan'}
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-[#B5ADA0] text-xs"
        >
          Pendamping pasif untuk GERD-Anxiety
        </motion.p>
      </div>
    </div>
  );
}
