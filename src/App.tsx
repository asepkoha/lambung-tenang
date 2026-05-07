import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from '@/pages/Welcome';
import Onboarding from '@/pages/Onboarding';
import Assessment from '@/pages/Assessment';
import HomeScreen from '@/pages/Dashboard';
import DayDetail from '@/pages/DayDetail';
import CheckIn from '@/pages/CheckIn';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import SOSPage from '@/pages/SOSPage';
import CompletionPage from '@/pages/CompletionPage';
import { BottomNav } from '@/components/layout/BottomNav';
import PageTransition from '@/components/layout/PageTransition';
import { useProfile } from '@/hooks/useProfile';
import { initTheme } from '@/hooks/useTheme';

function App() {
  const location = useLocation();
  const { profile } = useProfile();

  useEffect(() => {
    initTheme();
  }, []);

  // Show bottom nav on main app pages
  const showNav = ['/dashboard', '/history', '/settings'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="min-h-screen bg-lt-bg-base text-lt-text-primary">
      <div className="mx-auto max-w-md min-h-screen relative">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
            <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
            <Route path="/assessment" element={<PageTransition><Assessment /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition>{profile ? <HomeScreen /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/day/:dayNumber" element={<PageTransition>{profile ? <DayDetail /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/checkin/:dayNumber" element={<PageTransition>{profile ? <CheckIn /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/history" element={<PageTransition>{profile ? <History /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/settings" element={<PageTransition>{profile ? <Settings /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/sos" element={<PageTransition><SOSPage /></PageTransition>} />
            <Route path="/completion" element={<PageTransition>{profile ? <CompletionPage /> : <Navigate to="/" />}</PageTransition>} />
          </Routes>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

export default App;
