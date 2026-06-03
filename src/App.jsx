import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AdminPortal from './components/AdminPortal';
import IdleTimeout from './components/IdleTimeout';
import StrictSessionManager from './components/StrictSessionManager';
import ItalyStudyPage from './components/ItalyStudyPage';
import GenericCountryPage from './components/GenericCountryPage';
import BusinessPartnerForm from './components/BusinessPartnerForm';
import AppointmentForm from './components/AppointmentForm';
import ContactUsPage from './components/ContactUsPage';
import OurStoryPage from './components/OurStoryPage';
import AppleAcademyPage from './components/AppleAcademyPage';
import WorkVisaLandingPage from './components/WorkVisaLandingPage';
import GermanyWorkVisaPage from './components/GermanyWorkVisaPage';
import CzechRepublicWorkVisaPage from './components/CzechRepublicWorkVisaPage';
import SerbiaWorkVisaPage from './components/SerbiaWorkVisaPage';
import PolandWorkVisaPage from './components/PolandWorkVisaPage';
import PortugalWorkVisaPage from './components/PortugalWorkVisaPage';
import MoldovaWorkVisaPage from './components/MoldovaWorkVisaPage';
import ScrollToTop from './components/ScrollToTop';
import SmoothScrollLayout from './components/SmoothScrollLayout';
import { ThemeProvider } from './ThemeContext';
import NotFound from './components/NotFound';
import CouponPage from './coupon_generator/coupon';
import { API_BASE_URL } from './config';

import './index.css';

import AuthModal from './components/AuthModal';
import ErrorBoundary from './components/ErrorBoundary';

// ── Silent visitor tracker — fires once per unique page visit per session tab ─
function VisitorTracker() {
  const location = useLocation();
  const trackedPaths = useRef(new Set());

  useEffect(() => {
    let path = location.pathname;

    // Normalize: strip trailing slash (except for absolute root '/')
    if (path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    // Skip admin, dashboard, and login routes — don't count admin/logged-in browsing or logins
    if (path.startsWith('/admin') || path.startsWith('/dashboard') || path === '/login') return;

    // Define all currently available/valid frontend routes on the website
    const VALID_PATHS = new Set([
      '/',
      '/study-in-italy',
      '/study-in-australia',
      '/study-in-canada',
      '/study-in-france',
      '/study-in-germany',
      '/study-in-ireland',
      '/study-in-uk',
      '/study-in-usa',
      '/services/work-visa',
      '/services/work-visa/germany',
      '/services/work-visa/czech-republic',
      '/services/work-visa/serbia',
      '/services/work-visa/poland',
      '/services/work-visa/portugal',
      '/services/work-visa/moldova',
      '/partner-registration',
      '/book-appointment',
      '/contact',
      '/our-story',
      '/apple-academy',
      '/coupon'
    ]);

    // If page is not in our active pages, default track it as '/' root
    if (!VALID_PATHS.has(path)) {
      path = '/';
    }

    // Deduplicate: only track each path once per browser tab session
    if (trackedPaths.current.has(path)) return;
    trackedPaths.current.add(path);

    // Fire-and-forget — never block the UI
    try {
      const referrer = document.referrer || 'Direct';
      fetch(`${API_BASE_URL}/visitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: path, referrer }),
        keepalive: true, // survives page unload
      }).catch(() => {}); // silently ignore network errors
    } catch (_) {}
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <VisitorTracker />
          <SmoothScrollLayout>
            <ScrollToTop />

            <IdleTimeout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<AuthModal type="login" onClose={() => window.location.href = '/'} />} />
              <Route path="/dashboard" element={
                <StrictSessionManager>
                  <Dashboard />
                </StrictSessionManager>
              } />
              <Route path="/admin" element={
                <StrictSessionManager>
                  <AdminPortal />
                </StrictSessionManager>
              } />
              <Route path="/study-in-italy" element={<ItalyStudyPage />} />
              <Route path="/study-in-australia" element={<GenericCountryPage countryId="australia" />} />
              <Route path="/study-in-canada" element={<GenericCountryPage countryId="canada" />} />
              <Route path="/study-in-france" element={<GenericCountryPage countryId="france" />} />
              <Route path="/study-in-germany" element={<GenericCountryPage countryId="germany" />} />
              <Route path="/study-in-ireland" element={<GenericCountryPage countryId="ireland" />} />
              <Route path="/study-in-uk" element={<GenericCountryPage countryId="uk" />} />
              <Route path="/study-in-usa" element={<GenericCountryPage countryId="usa" />} />
              
              {/* Work Visa Routes */}
              <Route path="/services/work-visa" element={<WorkVisaLandingPage />} />
              <Route path="/services/work-visa/germany" element={<GermanyWorkVisaPage />} />
              <Route path="/services/work-visa/czech-republic" element={<CzechRepublicWorkVisaPage />} />
              <Route path="/services/work-visa/serbia" element={<SerbiaWorkVisaPage />} />
              <Route path="/services/work-visa/poland" element={<PolandWorkVisaPage />} />
              <Route path="/services/work-visa/portugal" element={<PortugalWorkVisaPage />} />
              <Route path="/services/work-visa/moldova" element={<MoldovaWorkVisaPage />} />

              <Route path="/partner-registration" element={<BusinessPartnerForm />} />
              <Route path="/book-appointment" element={<AppointmentForm />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/apple-academy" element={<AppleAcademyPage />} />
              <Route path="/coupon" element={<CouponPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </IdleTimeout>
          </SmoothScrollLayout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
