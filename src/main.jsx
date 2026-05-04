import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Suppress skipped transition warnings
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && (event.reason.name === 'AbortError' || (event.reason.message && event.reason.message.includes('Transition was skipped')))) {
    event.preventDefault();
  }
});

const originalConsoleError = console.error;
console.error = (...args) => {
  if (args[0] && typeof args[0] === 'string' && (args[0].includes('Transition was skipped') || args[0].includes('AbortError'))) {
    return;
  }
  originalConsoleError(...args);
};

// CSRF Protection Interceptor
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  let [url, config] = args;
  if (typeof url === 'string' && (url.includes(':5000') || url.includes('/api/'))) {
    config = config || {};
    config.headers = config.headers || {};
    if (config.headers instanceof Headers) {
      config.headers.set('x-csrf-protected', '1');
    } else if (Array.isArray(config.headers)) {
      config.headers.push(['x-csrf-protected', '1']);
    } else {
      config.headers['x-csrf-protected'] = '1';
    }
  }
  return originalFetch(url, config);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
