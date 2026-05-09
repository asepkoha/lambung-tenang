import { useLocation } from 'react-router-dom';
import { Home, Calendar, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function BottomNav() {
  const location = useLocation();
  const { isDark } = useTheme();

  const isDashboard = location.pathname.startsWith('/dashboard');
  const isHistory = location.pathname.startsWith('/history');
  const isSettings = location.pathname.startsWith('/settings');

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[999] h-16 flex items-center justify-center px-4 glass-nav ${
        isDark
          ? 'bg-black/95 border-t border-lt-border-subtle'
          : 'bg-white/95 border-t border-gray-200'
      }`}
    >
      <div className="mx-auto max-w-md w-full h-full">
        <nav className="flex justify-around items-center h-full px-2">
          {/* Beranda */}
          <a
            href="#/dashboard"
            id="nav-dashboard"
            className={`flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] cursor-pointer ${
              isDashboard ? 'text-lt-color-primary' : isDark ? 'text-lt-text-secondary' : 'text-gray-600'
            }`}
          >
            <Home size={20} strokeWidth={isDashboard ? 2.5 : 2} fill={isDashboard ? 'currentColor' : 'none'} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Beranda</span>
          </a>

          {/* Riwayat */}
          <a
            href="#/history"
            id="nav-history"
            className={`flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] cursor-pointer ${
              isHistory ? 'text-lt-color-primary' : isDark ? 'text-lt-text-secondary' : 'text-gray-600'
            }`}
          >
            <Calendar size={20} strokeWidth={isHistory ? 2.5 : 2} fill={isHistory ? 'currentColor' : 'none'} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Riwayat</span>
          </a>

          {/* Profil */}
          <a
            href="#/settings"
            id="nav-settings"
            className={`flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] cursor-pointer ${
              isSettings ? 'text-lt-color-primary' : isDark ? 'text-lt-text-secondary' : 'text-gray-600'
            }`}
          >
            <User size={20} strokeWidth={isSettings ? 2.5 : 2} fill={isSettings ? 'currentColor' : 'none'} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">Profil</span>
          </a>
        </nav>
      </div>
    </div>
  );
}
