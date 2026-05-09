import { useEffect, useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import type { Track } from '@/types';
import { cn } from '@/lib/utils';
import { getTrackAudio } from '@/data/voiceNotes';

interface VoiceNotePlayerProps {
  track: Track;
  day: number;
  audioType?: 'morning' | 'response';
  checkinData?: any;
  title?: string;
  onComplete?: () => void;
  className?: string;
}

const SPEED_OPTIONS = [1, 1.25, 1.5, 0.75];

export function VoiceNotePlayer({ track, day, audioType = 'morning', checkinData: _checkinData, title, onComplete, className }: VoiceNotePlayerProps) {
  const audioData = getTrackAudio(track, day);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasAudioFile, setHasAudioFile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [speedIndex, setSpeedIndex] = useState(0);

  // Initialize audio
  useEffect(() => {
    if (!audioData) {
      setHasAudioFile(false);
      setIsLoading(false);
      return;
    }

    let audio: HTMLAudioElement | null = null;

    try {
      audio = new Audio();
      audioRef.current = audio;

      const audioUrl = audioData.morningAudioUrl;

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

      const handleError = (e: Event) => {
        console.warn('Audio load error, falling back to SpeechSynthesis:', e);
        setHasAudioFile(false);
        setIsLoading(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      setIsLoading(true);
      audio.src = audioUrl;
      // Pre-check if URL is valid (basic)
      if (!audioUrl) {
        setHasAudioFile(false);
        setIsLoading(false);
        return;
      }
      
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
      setHasAudioFile(false);
      setIsLoading(false);
      return () => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      };
    }
  }, [track, day, audioData]);

  // Apply playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEED_OPTIONS[speedIndex];
    }
  }, [speedIndex]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (!audioRef.current && !hasAudioFile) {
       // Manual fallback if ref is null but we want to play
    }

    if (isPlaying) {
      if (hasAudioFile && audioRef.current) {
        audioRef.current.pause();
      } else {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    } else {
      if (hasAudioFile && audioRef.current) {
        audioRef.current.play().catch(err => {
          console.error("Playback failed, falling back:", err);
          setHasAudioFile(false);
          handleTogglePlay(); // Retry with fallback
        });
        setIsPlaying(true);
      } else {
        const textToSpeak = audioData?.morningTitle || 'Audio Pendamping';
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'id-ID';
        utterance.onend = () => {
          setIsPlaying(false);
          onComplete?.();
        };
        utterance.onerror = () => {
          setIsPlaying(false);
        };
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleRewind = () => {
    if (audioRef.current && hasAudioFile) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const handleForward = () => {
    if (audioRef.current && hasAudioFile) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 15);
    }
  };

  const handleCycleSpeed = () => {
    setSpeedIndex((i) => (i + 1) % SPEED_OPTIONS.length);
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current && hasAudioFile) {
      audioRef.current.currentTime = value[0];
    }
  };

  // Sage palette colors
  const playBg = 'bg-lt-color-primary hover:bg-lt-color-primary-dark';
  const labelColor = 'text-lt-color-primary';
  const timerColor = 'text-lt-text-secondary';
  const sliderActive = '[&_[role=slider]]:border-lt-color-primary';
  const ctrlBtn = 'text-lt-text-secondary hover:text-lt-text-primary';
  const speedBtn = 'bg-lt-bg-subtle text-lt-text-primary hover:bg-lt-bg-subtle/70';

  const containerBg = 'bg-lt-bg-subtle border border-lt-border-subtle';

  const playerHeading = title ?? (audioType === 'morning'
    ? audioData?.morningTitle || 'Audio Pendamping · Pagi'
    : 'Pesan untuk Hari Ini');

  return (
    <div className={cn(containerBg, 'rounded-xl p-4 flex flex-col gap-3', className)}>
      {/* Top: label + timer */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className={cn('text-[10px] uppercase font-bold tracking-wider', audioType === 'morning' ? labelColor : timerColor)}>
            {playerHeading}
          </span>
          {!hasAudioFile && !isLoading && (
            <span className="text-[9px] text-lt-color-primary font-medium opacity-70 italic">
              Menggunakan AI Voice
            </span>
          )}
        </div>
        <span className={cn('text-xs font-medium', timerColor)}>
          {formatTime(currentTime)} / {hasAudioFile ? formatTime(duration) : '--:--'}
        </span>
      </div>

      {/* Progress bar */}
      <div>
        {hasAudioFile ? (
          <Slider
            value={[currentTime]}
            max={duration}
            step={0.1}
            className={cn(
              'w-full h-1 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:bg-white [&_[role=slider]]:border-2',
              sliderActive
            )}
            onValueChange={handleSliderChange}
            disabled={isLoading}
          />
        ) : (
          <div className="w-full h-1 bg-lt-bg-subtle rounded-full" />
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1 justify-center">
          <button
            onClick={handleRewind}
            disabled={!hasAudioFile || isLoading}
            aria-label="Mundur 15 detik"
            className={cn('flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-40', ctrlBtn)}
          >
            <RewindIcon />
            <span>15</span>
          </button>

          <button
            onClick={handleTogglePlay}
            disabled={isLoading}
            aria-label={isPlaying ? 'Jeda' : 'Putar'}
            className={cn('w-12 h-12 text-white rounded-full flex items-center justify-center transition-colors shadow-sm', playBg)}
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5 fill-white" />
            ) : (
              <Play className="h-5 w-5 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleForward}
            disabled={!hasAudioFile || isLoading}
            aria-label="Maju 15 detik"
            className={cn('flex items-center gap-1 text-xs font-medium transition-colors disabled:opacity-40', ctrlBtn)}
          >
            <span>15</span>
            <ForwardIcon />
          </button>
        </div>

        <button
          onClick={handleCycleSpeed}
          aria-label="Ganti kecepatan"
          className={cn('text-[11px] font-bold px-2 py-1 rounded-md transition-colors shrink-0', speedBtn)}
        >
          {SPEED_OPTIONS[speedIndex]}x
        </button>
      </div>
    </div>
  );
}

function RewindIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 19 2 12 11 5 11 19" />
      <polygon points="22 19 13 12 22 5 22 19" />
    </svg>
  );
}

function ForwardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 19 22 12 13 5 13 19" />
      <polygon points="2 19 11 12 2 5 2 19" />
    </svg>
  );
}
