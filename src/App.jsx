// --------------------------------------------------------
// App.jsx — Router con nuevas rutas de detalle y publicación
// --------------------------------------------------------
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

function SEOUpdater() {
  const location = useLocation();

  useEffect(() => {
    const lang = localStorage.getItem('language') || 'es';
    document.documentElement.lang = lang;

    const titles = {
      '/': 'Paradise Premium | Luxury Rentals Medellín',
      '/apartments': 'Apartments & Houses | Paradise Premium',
      '/fincas': 'Exclusive Fincas | Paradise Premium',
      '/water-vehicles': 'Yachts & Boats | Paradise Premium',
      '/about': 'About Us | Paradise Premium',
      '/medellin-guide': 'Medellín Guide | Paradise Premium',
      '/support': 'Support & Contact | Paradise Premium',
      '/publish': 'Partner Portal | Paradise Premium'
    };

    const path = location.pathname;
    const title = titles[path] || 'Paradise Premium Rentals';
    document.title = title;

    const desc = 'Paradise Premium Rentals & Sales - Luxury furnished properties, estates, and yachts in Medellín and Antioquia, Colombia.';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = desc;

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = title;
    
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = desc;
  }, [location]);

  return null;
}
import { ToastProvider } from './components/ToastProvider';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ApartmentsPage from './pages/ApartmentsPage';
import FincasPage from './pages/FincasPage';
import WaterVehiclesPage from './pages/WaterVehiclesPage';
import SupportPage from './pages/SupportPage';
import AICenterPage from './pages/AICenterPage';
import AboutPage from './pages/AboutPage';
import MedellinGuidePage from './pages/MedellinGuidePage';
import PublishPage from './pages/PublishPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import GuestSignPage from './pages/GuestSignPage';

export default function App() {
  return (
    <BrowserRouter>
      <SEOUpdater />
      <ToastProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="apartments" element={<ApartmentsPage />} />
            <Route path="fincas" element={<FincasPage />} />
            <Route path="water-vehicles" element={<WaterVehiclesPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="medellin-guide" element={<MedellinGuidePage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="ai-center" element={<AICenterPage />} />
            <Route path="publish" element={<PublishPage />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="sign/:id" element={<GuestSignPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
