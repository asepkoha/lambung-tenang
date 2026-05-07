import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import type { Track } from '@/types';
import { assessmentQuestions, determineTrack } from '@/data/content';
import { cn } from '@/lib/utils';

interface AssessmentWizardProps {
  onComplete: (track: string) => void;
}

export function AssessmentWizard({ onComplete }: AssessmentWizardProps) {
  const { updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isFinishing, setIsFinishing] = useState(false);

  const totalSteps = assessmentQuestions.length;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIndex;
    setAnswers(newAnswers);

    // Auto-advance after a short delay for better UX
    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setDirection(1);
        setCurrentStep(currentStep + 1);
      } else {
        handleFinish(newAnswers);
      }
    }, 400);
  };

  const handleFinish = (finalAnswers: number[]) => {
    setIsFinishing(true);
    const track = determineTrack(finalAnswers);
    
    // Simulate processing for "magical" feel
    setTimeout(() => {
      updateProfile({ track: track as Track, assessmentAnswers: finalAnswers });
      onComplete(track);
    }, 1500);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  if (isFinishing) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 space-y-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: 1 
          }}
          className="relative"
        >
          <div className="h-20 w-20 rounded-full bg-lt-color-primary/20 flex items-center justify-center border border-lt-border-subtle">
            <CheckCircle2 className="h-10 w-10 text-lt-color-primary animate-pulse" />
          </div>
          <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-lt-color-primary border-t-transparent animate-spin" />
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-lt-text-primary">Menganalisis Jawabanmu...</h2>
          <p className="text-lt-text-secondary">Kami sedang menyiapkan jalur terbaik untuk perjalanan 14 harimu.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = assessmentQuestions[currentStep];

  return (
    <div className="max-w-md mx-auto w-full h-full flex flex-col pt-2 pb-4 px-4 sm:px-6">
      {/* Header & Progress */}
      <div className="space-y-3 mb-4 shrink-0">
        <div className="flex items-center justify-between px-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            disabled={currentStep === 0}
            className="text-lt-text-secondary hover:text-lt-text-primary -ml-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-xs font-medium text-lt-text-secondary font-mono">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
        <div className="h-1.5 w-full bg-lt-bg-subtle border border-lt-border-subtle overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-lt-color-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide -mx-4 px-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full flex flex-col min-h-full pb-4"
          >
            <div className="mb-5 shrink-0">
              <h2 className="text-lg sm:text-xl font-bold leading-snug text-lt-text-primary mb-1">
                {currentQuestion.question}
              </h2>
              <p className="text-lt-text-secondary italic text-xs">
                Pilih jawaban yang paling mendekati perasaanmu saat ini.
              </p>
            </div>

            <div className="grid gap-2">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(index)}
                  className={cn(
                    "flex items-center justify-between p-3 sm:p-4 min-h-[48px] rounded-xl border transition-colors duration-200",
                    answers[currentStep] === index 
                      ? "border-lt-color-primary bg-lt-bg-subtle shadow-sm" 
                      : "border-lt-border-subtle hover:border-lt-color-primary/40 hover:bg-lt-bg-subtle/50"
                  )}
                >
                  <span className="text-sm sm:text-base font-medium leading-snug flex-1 pr-3 text-lt-text-primary">
                    {option.text}
                  </span>
                  <div className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 rounded-full border shrink-0 flex items-center justify-center",
                    answers[currentStep] === index 
                      ? "border-lt-color-primary bg-lt-color-primary" 
                      : "border-lt-border-subtle"
                  )}>
                    {answers[currentStep] === index && (
                      <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="pt-2 shrink-0 text-center">
        <p className="text-[10px] sm:text-xs text-lt-text-secondary opacity-70 leading-relaxed">
          Privat & aman. Hanya untuk menyesuaikan pendampingan.
        </p>
      </div>
    </div>
  );
}
