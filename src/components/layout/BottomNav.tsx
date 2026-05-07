import { Link, useLocation } from 'react-router-dom';
import { Home, CalendarDays, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: Home, label: 'Beranda' },
    { path: '/history', icon: CalendarDays, label: 'Riwayat' },
    { path: '/settings', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-lt-bg-surface border-t border-lt-border-subtle h-16">
      <div className="mx-auto max-w-md h-full">
        <nav className="flex justify-around items-center h-full px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] ${
                  isActive
                    ? 'bg-lt-bg-subtle text-lt-color-primary rounded-xl px-2 py-2'
                    : 'text-lt-text-secondary hover:text-lt-color-primary/70 px-2 py-2'
                }`}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? 'currentColor' : 'none'} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
