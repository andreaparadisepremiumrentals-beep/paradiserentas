// --------------------------------------------------------
// main.jsx — Application entry point
// --------------------------------------------------------
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { setupWebMCP } from './lib/webmcp';

// One-time cleanup: remove oversized localStorage keys left by older versions.
// Properties are now cached in-memory only; localStorage is never used for them.
['paradise_properties_v5', 'paradise_properties_v6', 'paradise_last_sync_v6'].forEach(key => {
  try { localStorage.removeItem(key); } catch (_) {}
});

// GitHub Pages sirve /fincas redirigiendo a /fincas/ (directorio con index.html).
// Normalizamos la barra final ANTES de montar la app para que React Router
// reciba la ruta sin el slash final y renderice la página correcta.
try {
  const p = window.location.pathname;
  if (p.length > 1 && p.endsWith('/')) {
    window.history.replaceState(null, '', p.slice(0, -1) + window.location.search + window.location.hash);
  }
} catch (_) {}

// Registra las herramientas del sitio para agentes de IA en el navegador
// (solo actúa si el navegador implementa navigator.modelContext).
setupWebMCP();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
