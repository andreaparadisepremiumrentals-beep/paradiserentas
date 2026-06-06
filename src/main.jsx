// --------------------------------------------------------
// main.jsx — Application entry point
// --------------------------------------------------------
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// One-time cleanup: remove oversized localStorage keys left by older versions.
// Properties are now cached in-memory only; localStorage is never used for them.
['paradise_properties_v5', 'paradise_properties_v6', 'paradise_last_sync_v6'].forEach(key => {
  try { localStorage.removeItem(key); } catch (_) {}
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
