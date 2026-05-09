import { useState, useRef, useCallback, useEffect } from 'react';
import { getVoiceNotePath, getVoiceNoteTranscript } from '@/data/content';
import type { Track, VoiceContext } from '@/types';

interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  hasAudioFile: boolean;
}

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<AudioState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    hasAudioFile: false,
  });

  const checkAudioFile = useCallback(async (track: Track, day: number, context: VoiceContext): Promise<boolean> => {
    const path = getVoiceNotePath(track, day, context);
    try {
      const response = await fetch(path, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  const playTTS = useCallback((track: Track, day: number, context: VoiceContext) => {
    if (!window.speechSynthesis) return;

    const text = getVoiceNoteTranscript(track, day, context);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Try to find Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find((v) => v.lang.startsWith('id'));
    if (idVoice) utterance.voice = idVoice;

    utteranceRef.current = utterance;

    const estimatedDuration = text.length * 0.12; // rough estimate
    setState((s) => ({ ...s, duration: estimatedDuration, isPlaying: true, hasAudioFile: false }));

    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setState((s) => ({ ...s, currentTime: Math.min(elapsed, estimatedDuration) }));
    }, 500);

    utterance.onend = () => {
      setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
      if (timerRef.current) clearInterval(timerRef.current);
    };

    utterance.onerror = () => {
      setState((s) => ({ ...s, isPlaying: false }));
      if (timerRef.current) clearInterval(timerRef.current);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback(async (track: Track, day: number, context: VoiceContext) => {
    // Stop any current playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState((s) => ({ ...s, isLoading: true, isPlaying: false, currentTime: 0, duration: 0 }));

    const hasFile = await checkAudioFile(track, day, context);
    setState((s) => ({ ...s, hasAudioFile: hasFile, isLoading: false }));

    if (hasFile) {
      const path = getVoiceNotePath(track, day, context);
      const audio = new Audio(path);
      audioRef.current = audio;

      audio.addEventListener('loadedmetadata', () => {
        setState((s) => ({ ...s, duration: audio.duration }));
      });

      audio.addEventListener('ended', () => {
        setState((s) => ({ ...s, isPlaying: false, currentTime: 0 }));
        if (timerRef.current) clearInterval(timerRef.current);
      });

      audio.addEventListener('error', () => {
        // Fallback to TTS
        playTTS(track, day, context);
      });

      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, currentTime: audio.currentTime }));
      }, 500);

      audio.play().catch(() => playTTS(track, day, context));
      setState((s) => ({ ...s, isPlaying: true }));
    } else {
      playTTS(track, day, context);
    }
  }, [checkAudioFile, playTTS]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
    setState((s) => ({ ...s, isPlaying: false }));
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setState((s) => ({ ...s, isPlaying: true }));
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, currentTime: audioRef.current?.currentTime || s.currentTime }));
      }, 500);
    } else if (window.speechSynthesis) {
      window.speechSynthesis.resume();
      setState((s) => ({ ...s, isPlaying: true }));
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((s) => ({ ...s, currentTime: time }));
    }
    // TTS seeking is not really supported well by SpeechSynthesis
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setState({ isPlaying: false, isLoading: false, duration: 0, currentTime: 0, hasAudioFile: false });
  }, []);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    ...state,
    play,
    pause,
    resume,
    seek,
    stop,
  };
}

