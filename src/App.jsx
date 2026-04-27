import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';
import AdminPortal from './components/AdminPortal';
import IdleTimeout from './components/IdleTimeout';
import StrictSessionManager from './components/StrictSessionManager';
import { ThemeProvider } from './ThemeContext';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <IdleTimeout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
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
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </IdleTimeout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
