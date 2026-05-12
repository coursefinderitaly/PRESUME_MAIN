import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import ScrollToTop from './components/ScrollToTop';
import SmoothScrollLayout from './components/SmoothScrollLayout';
import { ThemeProvider } from './ThemeContext';
import NotFound from './components/NotFound';
import FPSMeter from './components/FPSMeter';
import './index.css';

import AuthModal from './components/AuthModal';

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <SmoothScrollLayout>
            <ScrollToTop />
            <FPSMeter />
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
              <Route path="/partner-registration" element={<BusinessPartnerForm />} />
              <Route path="/book-appointment" element={<AppointmentForm />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/our-story" element={<OurStoryPage />} />
              <Route path="/apple-academy" element={<AppleAcademyPage />} />
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
