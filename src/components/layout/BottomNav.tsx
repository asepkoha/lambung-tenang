import { Link, useLocation } from 'react-router-dom';
import { Home, GitCommit, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const tabs = [
    { path: '/dashboard', icon: Home, label: 'Beranda' },
    { path: '/history', icon: GitCommit, label: 'Riwayat' },
    { path: '/settings', icon: User, label: 'Profil' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-dark-surface border-t border-sage-light dark:border-dark-disabled h-16">
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
                    ? 'bg-sage-light dark:bg-dark-disabled text-sage dark:text-dark-primary-light rounded-xl px-2 py-2'
                    : 'text-sage-muted dark:text-dark-muted hover:text-sage/70 dark:hover:text-dark-primary px-2 py-2'
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
