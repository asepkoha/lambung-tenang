import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'lt-theme';
const PWA_DISMISSED_KEY = 'lt-pwa-dismissed';

function applyTheme(dark: boolean) {
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (dark) {
    document.documentElement.classList.remove('light');
    if (metaTheme) metaTheme.setAttribute('content', '#1a1f1b'); // --lt-bg-base
  } else {
    document.documentElement.classList.add('light');
    if (metaTheme) metaTheme.setAttribute('content', '#f5f3ef'); // --lt-bg-base light
  }
}

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved !== 'light'; // Default to dark (true) if null or 'dark'
    } catch {
      return true;
    }
  });

  useEffect(() => {
    applyTheme(isDark);
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      } catch {}
      return next;
    });
  }, []);

  return { isDark, toggleTheme };
}

export function initTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    applyTheme(saved !== 'light');
  } catch {
    applyTheme(true);
  }
}

// PWA Install Hook
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(PWA_DISMISSED_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(PWA_DISMISSED_KEY, 'true');
    } catch {}
    setIsDismissed(true);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  return { canInstall: !!deferredPrompt && !isDismissed, install, dismiss };
}
