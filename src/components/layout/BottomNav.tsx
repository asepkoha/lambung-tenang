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
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 h-16 flex items-center justify-center px-4"
      style={{ 
        background: 'rgba(21, 28, 24, 0.95)', 
        borderTop: '0.5px solid rgba(95, 255, 125, 0.08)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)'
      }}
    >
      <div className="mx-auto max-w-md w-full h-full">
        <nav className="flex justify-around items-center h-full px-2">
          {tabs.map((tab) => {
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all relative min-w-[70px] ${
                  isActive ? 'text-lt-color-primary' : 'text-lt-text-secondary'
                }`}
                style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(107, 142, 90, 0.5))' } : {}}
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
