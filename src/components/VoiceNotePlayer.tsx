import { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Track, DayEntry } from '@/types';
import { cn } from '@/lib/utils';
import { getTodayVoiceNote } from '@/utils/selectVoiceContext';
import { getStorageItem } from '@/hooks/useStorage';

interface VoiceNotePlayerProps {
  track: Track;
  day: number;
  checkinData?: any;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

export function VoiceNotePlayer({ track, day, checkinData, title, onComplete, className }: VoiceNotePlayerProps) {
  const previousEntries = getStorageItem<DayEntry[]>('lt-entries') || [];
  const { context } = getTodayVoiceNote(track, day, checkinData, previousEntries);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAudioFile, setHasAudioFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    
    try {
      audio = new Audio();
      audioRef.current = audio;
      
      const audioUrl = `/audio/${track}/${day}_${context}.mp3`;
      
      const handleLoadedMetadata = () => {
        try {
          setDuration(audio!.duration);
          setHasAudioFile(true);
          setIsLoading(false);
        } catch (e) {
          console.error('Error loading metadata:', e);
          setHasAudioFile(false);
          setIsLoading(false);
        }
      };
      
      const handleTimeUpdate = () => {
        try {
          setCurrentTime(audio!.currentTime);
        } catch (e) {
          console.error('Error updating time:', e);
        }
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        onComplete?.();
      };
      
      const handleError = (_e: Event) => {
        // Audio file doesn't exist - this is expected, will use TTS fallback
        setHasAudioFile(false);
        setIsLoading(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Try to load audio
      setIsLoading(true);
      audio.src = audioUrl;
      audio.load();

      return () => {
        if (audio) {
          audio.pause();
          audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          audio.src = '';
        }
      };
    } catch (e) {
      console.error('Error initializing audio:', e);
      setIsLoading(false);
      return () => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      };
    }
  }, [track, day, context]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = hasAudioFile && duration > 0 ? (currentTime / duration) * 100 : 0;
  const circumference = 2 * Math.PI * 24; // radius 24
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const handleTogglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (hasAudioFile) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        // Fallback TTS
        const utterance = new SpeechSynthesisUtterance(context);
        utterance.lang = 'id-ID';
        utterance.onend = () => {
          setIsPlaying(false);
          onComplete?.();
        };
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && hasAudioFile) {
      audioRef.current.currentTime = value[0];
    }
  };

  return (
    <div className={cn(
      context === 'comfort' || context === 'acknowledge' 
        ? "bg-[#f5f0e8] rounded-xl p-4 flex flex-col gap-3" 
        : "bg-[#F5F3EF] rounded-xl p-4 flex flex-col gap-3",
      className
    )}>
      {/* Top row: play button (left), label (center), timer (right top) */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {/* Circular progress ring */}
          {hasAudioFile && (
            <svg className="absolute inset-0 -rotate-90 w-12 h-12" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#EDE9E3"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="#6B8E5A"
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
          )}
          <button
            onClick={handleTogglePlay}
            disabled={isLoading}
            className="w-12 h-12 bg-[#6B8E5A] text-white rounded-full flex items-center justify-center hover:bg-[#5A7A4A] transition-colors"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white translate-x-0.5" />
            )}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <span className="text-xs uppercase font-bold text-[#6B6B6B] leading-relaxed">
              {title || 'Audio Pendamping: Pagi'}
            </span>
            <span className="text-xs text-[#A0A0A0] font-medium shrink-0 ml-2">
              {formatTime(currentTime)} / {hasAudioFile ? formatTime(duration) : '--:--'}
            </span>
          </div>
          
          {/* Progress bar always visible from label to timer */}
          <div className="mt-2">
            {hasAudioFile ? (
              <Slider
                value={[currentTime]}
                max={duration}
                step={0.1}
                className="w-full h-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2 [&_[role=slider]]:border-[#6B8E5A]"
                onValueChange={handleSliderChange}
                disabled={isLoading}
              />
            ) : (
              <div className="w-full h-1 bg-[#EDE9E3] rounded-full" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
