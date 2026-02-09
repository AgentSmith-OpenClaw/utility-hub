import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import EMICalculatorPage from './pages/EMICalculatorPage';
import './index.css';

// ── Google Analytics helpers (GA4: G-8ZXGEHK3C0) ───────────────────────────
const GA_ID = 'G-8ZXGEHK3C0';

/** Send a page_view event to GA4 */
function trackPageView(path: string) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_ID, { page_path: path });
  }
}

/** Hook that fires a page view on every route change */
function useGoogleAnalytics() {
  const location = useLocation();
  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);
}

// ── Route tracker wrapper ───────────────────────────────────────────────────
const RouteTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useGoogleAnalytics();
  return <>{children}</>;
};

// ── App ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <Router>
        <RouteTracker>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/emi-calculator" element={<EMICalculatorPage />} />
          </Routes>
        </RouteTracker>
      </Router>
    </HelmetProvider>
  );
}

export default App;
