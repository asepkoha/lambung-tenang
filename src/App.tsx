import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Welcome from '@/pages/Welcome';
import Onboarding from '@/pages/Onboarding';
import Assessment from '@/pages/Assessment';
import Dashboard from '@/pages/Dashboard';
import DayDetail from '@/pages/DayDetail';
import CheckIn from '@/pages/CheckIn';
import History from '@/pages/History';
import Settings from '@/pages/Settings';
import { BottomNav } from '@/components/BottomNav';
import PageTransition from '@/components/PageTransition';
import { getStorageItem } from '@/hooks/useStorage';

function App() {
  const location = useLocation();
  const profile = getStorageItem('lt-profile');

  // Show bottom nav on main app pages
  const showNav = ['/dashboard', '/history', '/settings'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#2D2A26]">
      <div className="mx-auto max-w-md min-h-screen relative">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
            <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
            <Route path="/assessment" element={<PageTransition><Assessment /></PageTransition>} />
            <Route path="/dashboard" element={<PageTransition>{profile ? <Dashboard /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/day/:dayNumber" element={<PageTransition>{profile ? <DayDetail /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/checkin/:dayNumber" element={<PageTransition>{profile ? <CheckIn /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/history" element={<PageTransition>{profile ? <History /> : <Navigate to="/" />}</PageTransition>} />
            <Route path="/settings" element={<PageTransition>{profile ? <Settings /> : <Navigate to="/" />}</PageTransition>} />
          </Routes>
        </AnimatePresence>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

export default App;
