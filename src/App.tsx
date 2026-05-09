import { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BottomNav } from '@/components/layout/BottomNav';
import PageTransition from '@/components/layout/PageTransition';
import { useProfile } from '@/hooks/useProfile';
import { initTheme } from '@/hooks/useTheme';

// Lazy-loaded pages — browser only downloads a page's bundle when needed
const Welcome = lazy(() => import('@/pages/Welcome'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Assessment = lazy(() => import('@/pages/Assessment'));
const HomeScreen = lazy(() => import('@/pages/Dashboard'));
const DayDetail = lazy(() => import('@/pages/DayDetail'));
const CheckIn = lazy(() => import('@/pages/CheckIn'));
const History = lazy(() => import('@/pages/History'));
const Settings = lazy(() => import('@/pages/Settings'));
const SOSPage = lazy(() => import('@/pages/SOSPage'));
const CompletionPage = lazy(() => import('@/pages/CompletionPage'));

// Minimal loading indicator shown during code-split chunk download
function PageLoader() {
  return (
    <div className="min-h-screen bg-lt-bg-base flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-lt-color-primary/30 border-t-lt-color-primary rounded-full animate-spin" />
    </div>
  );
}

function App() {
  const location = useLocation();
  const { profile } = useProfile();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initTheme();
    // Small delay to ensure profile is loaded from localStorage
    const timer = setTimeout(() => setIsInitialized(true), 50);
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return <PageLoader />;
  }

  // Show bottom nav on main app pages
  const showNav = ['/dashboard', '/history', '/settings'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <div className="min-h-screen bg-lt-bg-base text-lt-text-primary">
      <div className="mx-auto max-w-md min-h-screen relative">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

export default App;
