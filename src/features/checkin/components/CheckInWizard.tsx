import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check, Moon, Coffee, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { MOOD_OPTIONS, SYMPTOM_LIST, ACTIVITY_LIST, WALMAGH_OPTIONS } from '@/config/checkinOptions';

interface CheckInWizardProps {
  onComplete: (data: {
    date: string;
    dayNumber: number;
    mood: number;
    anxiety: number;
    symptoms: string[];
    food: string;
    sleep: number;
    activities: string[];
    reflection: string;
    walmagh: 'sesuai' | 'tidak_sesuai' | 'belum';
  }) => void;
  dayNumber: number;
}

export function CheckInWizard({ onComplete, dayNumber }: CheckInWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimeout, setRecordingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [supportsSpeech] = useState(() => 
    typeof window !== 'undefined' && (!!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition)
  );
  const [showMicPermissionModal, setShowMicPermissionModal] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [formData, setFormData] = useState({
    mood: 3,
    anxiety: 5,
    symptoms: [] as string[],
    food: '',
    sleep: 7,
    activities: [] as string[],
    reflection: '',
    walmagh: 'belum' as 'sesuai' | 'tidak_sesuai' | 'belum',
  });

  // Check if dzikir/ruhiyah is selected
  const hasDzikir = formData.activities.includes('meditasi');

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 7));
  };
  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleFinish = () => {
    const checkInData = {
      date: new Date().toISOString(),
      dayNumber,
      ...formData
    };

    onComplete(checkInData);
  };

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Check browser support for Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        updateFormData('reflection', transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          console.warn('Speech recognition permission denied');
          alert('Izinkan akses mikrofon di pengaturan browser untuk menggunakan fitur ini.');
        } else if (event.error === 'no-speech') {
          console.warn('Speech recognition no speech detected');
          alert('Suara tidak terbaca dengan jelas. Coba lagi atau ketik manual.');
        } else {
          console.warn('Speech recognition unavailable:', event.error);
          alert('Maaf, tidak bisa mendengar. Silakan ketik manual.');
        }
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [recordingTimeout]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (recordingTimeout) {
        clearTimeout(recordingTimeout);
        setRecordingTimeout(null);
      }
    } else {
      // Show permission modal first
      setShowMicPermissionModal(true);
    }
  };

  const handleAllowMic = () => {
    setShowMicPermissionModal(false);
    
    try {
      recognitionRef.current.start();
      setIsRecording(true);

      // Auto-stop after 60 seconds
      const timeout = setTimeout(() => {
        recognitionRef.current.stop();
        setIsRecording(false);
      }, 60000);
      setRecordingTimeout(timeout);
    } catch (error: any) {
      if (error.name === 'NotAllowedError') {
        console.warn('Speech recognition permission denied');
        alert('Izinkan akses mikrofon di pengaturan browser untuk menggunakan fitur ini.');
      } else {
        console.warn('Speech recognition unavailable:', error);
        alert('Maaf, tidak bisa mendengar. Silakan ketik manual.');
      }
    }
  };

  const handleDenyMic = () => {
    setShowMicPermissionModal(false);
  };

  const toggleItem = (key: 'symptoms' | 'activities', item: string) => {
    setFormData((prev) => {
      const current = prev[key];
      if (item === 'none') return { ...prev, [key]: ['none'] };
      
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current.filter((i) => i !== 'none'), item];
      
      return { ...prev, [key]: next.length === 0 ? ['none'] : next };
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col h-full justify-center space-y-4 sm:space-y-8 py-2">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Bagaimana perasaanmu hari ini?</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Pilih emoji yang paling mewakili mood-mu.</p>
            </div>
            <div className="flex justify-between items-center gap-2 sm:gap-3 px-1 sm:px-2">
              {MOOD_OPTIONS.map((m) => (
                <motion.button
                  key={m.value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  animate={
                    formData.mood === m.value 
                      ? { y: [0, -6, 0], scale: 1.15 } 
                      : { y: 0, scale: 1 }
                  }
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 15,
                    y: { duration: 0.4 } 
                  }}
                  onClick={() => {
                    updateFormData('mood', m.value);
                    setTimeout(nextStep, 400);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 sm:gap-2 flex-1 transition-all duration-300",
                    formData.mood === m.value ? "scale-110" : "opacity-30 grayscale hover:opacity-100 hover:grayscale-0"
                  )}
                >
                  <span className="text-[40px] sm:text-5xl drop-shadow-md leading-none">{m.emoji}</span>
                  <span className={cn(
                    "text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter text-center transition-colors",
                    formData.mood === m.value ? "text-lt-color-primary" : "text-lt-text-muted"
                  )}>{m.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col h-full justify-center space-y-6 sm:space-y-10 py-2">
            <div className="text-center space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Tingkat Anxiety</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Seberapa cemas yang kamu rasakan (1-10)?</p>
            </div>
            <div className="px-4 sm:px-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-lt-text-secondary">1</span>
                <Slider
                  value={[formData.anxiety]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(val) => updateFormData('anxiety', val[0])}
                  className="flex-1 [&_[role=slider]]:active:scale-150 [&_[role=slider]]:transition-transform py-4"
                />
                <span className="text-lg font-bold text-lt-text-secondary">10</span>
              </div>
              <div className="text-center mt-2">
                <span className="text-3xl sm:text-4xl font-black text-lt-color-primary bg-lt-bg-subtle px-4 py-1 rounded-xl inline-block mb-2">{formData.anxiety}</span>
                <p className="text-xs sm:text-sm italic text-lt-text-secondary mt-1">
                  {formData.anxiety <= 3 ? "Cukup tenang & terkendali" : 
                   formData.anxiety <= 7 ? "Mulai terasa mengganggu" : 
                   "Sangat intens & butuh perhatian"}
                </p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col h-full space-y-4 py-2">
            <div className="text-center space-y-1 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Gejala Lambung</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Apa yang perutmu rasakan hari ini?</p>
            </div>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 px-1 content-start"
            >
              {SYMPTOM_LIST.map((s) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  key={s.id}
                  onClick={() => toggleItem('symptoms', s.id)}
                  className={cn(
                    "flex items-center space-x-2 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer h-full",
                    formData.symptoms.includes(s.id) ? "border-lt-color-primary bg-lt-bg-subtle" : "border-lt-border-subtle"
                  )}
                >
                  <Checkbox checked={formData.symptoms.includes(s.id)} className="shrink-0" />
                  <Label className="cursor-pointer text-[13px] sm:text-sm leading-tight flex-1 text-lt-text-primary">{s.label}</Label>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col h-full justify-center space-y-6 sm:space-y-8 py-2">
            <div className="text-center space-y-1 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Makan & Tidur</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Catat sedikit tentang fisikmu hari ini.</p>
            </div>
            <div className="space-y-5 flex-1">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm text-lt-text-primary">
                  <Coffee className="h-4 w-4 text-lt-color-primary" /> Makanan pemicu yang dikonsumsi?
                </Label>
                <Input 
                  placeholder="Misal: kopi, pedas, gorengan..." 
                  value={formData.food}
                  onChange={(e) => updateFormData('food', e.target.value)}
                  className="rounded-xl text-sm h-11 border-lt-border-subtle bg-lt-bg-surface text-lt-text-primary placeholder:text-lt-text-muted/50"
                />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center mb-1">
                  <Label className="flex items-center gap-2 text-sm text-lt-text-primary">
                    <Moon className="h-4 w-4 text-lt-color-primary" /> Jam tidur semalam
                  </Label>
                  <span className="text-lt-color-primary font-bold text-sm">{formData.sleep} jam</span>
                </div>
                <Slider
                  value={[formData.sleep]}
                  min={0}
                  max={12}
                  step={0.5}
                  onValueChange={(val) => updateFormData('sleep', val[0])}
                  className="py-2 [&_[role=slider]]:active:scale-150 [&_[role=slider]]:transition-transform"
                />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col h-full space-y-4 py-2">
            <div className="text-center space-y-1 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Sudah Minum Walmagh Hari ini?</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Catat konsistensi minum Walmagh harianmu.</p>
            </div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              className="flex flex-col gap-2 sm:gap-3 flex-1 px-1 content-start"
            >
              {WALMAGH_OPTIONS.map((opt) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  key={opt.id}
                  onClick={() => updateFormData('walmagh', opt.id)}
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer",
                    formData.walmagh === opt.id ? "border-lt-color-primary bg-lt-bg-subtle" : "border-lt-border-subtle"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full border shrink-0 flex items-center justify-center",
                    formData.walmagh === opt.id ? "border-lt-color-primary" : "border-lt-border-subtle"
                  )}>
                    {formData.walmagh === opt.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-lt-color-primary" />
                    )}
                  </div>
                  <Label className="cursor-pointer text-sm flex-1 text-lt-text-primary">{opt.label}</Label>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 6:
        return (
          <div className={cn(
            "flex flex-col h-full space-y-4 py-2",
            hasDzikir ? "bg-lt-color-primary/5 rounded-xl p-4 border border-lt-color-primary/20" : ""
          )}>
            <div className="text-center space-y-1 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Yang Menenangkan Hari ini</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Apa yang kamu lakukan untuk rileks?</p>
            </div>
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
              className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 px-1 content-start"
            >
              {ACTIVITY_LIST.map((a) => (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 5 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  key={a.id}
                  onClick={() => toggleItem('activities', a.id)}
                  className={cn(
                    "flex items-center space-x-2 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer h-full",
                    formData.activities.includes(a.id)
                      ? "border-lt-color-primary bg-lt-bg-subtle"
                      : "border-lt-border-subtle"
                  )}
                >
                  <Checkbox checked={formData.activities.includes(a.id)} className="shrink-0" />
                  <Label className="cursor-pointer text-[13px] sm:text-sm leading-tight flex-1 text-lt-text-primary">{a.label}</Label>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      case 7:
        return (
          <div className="flex flex-col h-full space-y-4 py-2">
            <div className="text-center space-y-1 shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-lt-text-primary">Refleksi Singkat</h2>
              <p className="text-xs sm:text-sm text-lt-text-secondary">Satu hal untuk dirimu sendiri.</p>
            </div>
            <div className="space-y-3 flex-1 flex flex-col">
              <div className="relative">
                <Textarea 
                  placeholder="Tuliskan di sini..."
                  className={cn(
                    "flex-1 max-h-[120px] rounded-2xl p-4 pr-16 pb-16 resize-none text-sm leading-relaxed transition-all",
                    isRecording ? "border-2 border-lt-color-primary" : "border border-lt-border-subtle bg-lt-bg-surface text-lt-text-primary"
                  )}
                  value={formData.reflection}
                  onChange={(e) => updateFormData('reflection', e.target.value)}
                />
                
                {/* Microphone button - only show if browser supports speech */}
                {supportsSpeech && (
                  <>
                    <button 
                      onClick={toggleRecording}
                      className={cn(
                        "absolute right-4 bottom-4 w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all",
                        isRecording
                          ? 'bg-red-500 animate-pulse'
                          : 'bg-lt-color-primary hover:bg-lt-color-primary-dark hover:scale-105'
                      )}
                      aria-label={isRecording ? 'Stop merekam' : 'Mulai merekam suara'}
                    >
                      {isRecording ? <Square className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                    </button>
                    
                    {/* Recording indicator */}
                    {isRecording && (
                      <span className="absolute right-4 bottom-20 text-[10px] text-lt-color-primary font-medium">
                        Mendengarkan...
                      </span>
                    )}
                  </>
                )}
              </div>
              <p className="text-center text-[10px] sm:text-[11px] text-lt-text-muted px-2 mt-auto">
                Refleksi membantu otak memproses emosi dan pengalaman dengan lebih tenang.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-md mx-auto w-full h-full flex flex-col px-4 sm:px-6">
      {/* Progress Bar */}
      <div className="flex gap-1.5 mb-4 shrink-0">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              i <= step ? "bg-lt-color-primary" : "bg-lt-bg-subtle border border-lt-border-subtle"
            )}
          />
        ))}
      </div>

      <div className="flex-1 relative overflow-y-auto overflow-x-hidden pb-4">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-full w-full"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-auto shrink-0 pb-2">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1 rounded-xl h-12 border border-lt-border-subtle bg-lt-bg-surface text-lt-text-primary">
            <ChevronLeft className="mr-1 h-5 w-5" />
          </Button>
        )}
        {step < 7 ? (
          <Button onClick={nextStep} className="flex-[3] rounded-xl h-12 text-base font-bold bg-lt-color-primary hover:bg-lt-color-primary-dark text-white shadow-lg shadow-lt-color-primary/20">
            Lanjut <ChevronRight className="ml-1 h-5 w-5" />
          </Button>
        ) : (
          <Button onClick={handleFinish} className="flex-[3] rounded-xl h-12 text-base font-bold bg-lt-color-primary hover:bg-lt-color-primary-dark text-white shadow-lg shadow-lt-color-primary/20">
            Selesai <Check className="ml-1 h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Mic Permission Modal */}
      {showMicPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-lt-bg-surface rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-lt-border-subtle"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-lt-bg-subtle rounded-full flex items-center justify-center border border-lt-border-subtle">
                <Mic size={32} className="text-lt-color-primary" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-lt-text-primary mb-2 text-center">Izinkan Akses Mikrofon?</h3>
            <p className="text-sm text-lt-text-secondary mb-6 text-center leading-relaxed">
              Kami akan menggunakan mikrofon untuk mengubah suara Anda menjadi teks di refleksi. Data Anda tetap aman dan tidak disimpan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDenyMic}
                className="flex-1 h-12 rounded-xl border border-lt-border-subtle text-lt-text-secondary font-medium hover:bg-lt-bg-subtle transition-colors"
              >
                Nanti
              </button>
              <button
                onClick={handleAllowMic}
                className="flex-1 h-12 rounded-xl bg-lt-color-primary text-white font-medium hover:bg-lt-color-primary-dark transition-colors"
              >
                Izinkan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
