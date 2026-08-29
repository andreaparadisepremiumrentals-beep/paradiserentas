// -----------------------------------------------------------------------------
// App.jsx — Router con SEO centralizado (datos estructurados + metadatos)
// -----------------------------------------------------------------------------
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Seo } from './lib/seo';
import { SITE } from './lib/site';
import { ToastProvider } from './components/ToastProvider';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ApartmentsPage from './pages/ApartmentsPage';
import FincasPage from './pages/FincasPage';
import WaterVehiclesPage from './pages/WaterVehiclesPage';
import SupportPage from './pages/SupportPage';
import AboutPage from './pages/AboutPage';
import MedellinGuidePage from './pages/MedellinGuidePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import ListingsManager from './modules/ListingsManager';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import FaqPage from './pages/FaqPage';
import NeighborhoodsPage from './pages/NeighborhoodsPage';
import FactsPage from './pages/FactsPage';
import { Loader2 } from 'lucide-react';

// Carga diferida (code-splitting) de las páginas más pesadas
const AICenterPage = lazy(() => import('./pages/AICenterPage'));
const PublishPage = lazy(() => import('./pages/PublishPage'));
const GuestSignPage = lazy(() => import('./pages/GuestSignPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-paradise-950">
      <Loader2 className="animate-spin text-emerald-500" size={40} />
    </div>
  );
}

// Rutas estáticas cuyo SEO se administra aquí (las páginas de contenido
// blog/faq/sectores/datos gestionan su propio SEO con <Seo> o useSeo).
const STATIC_SEO = {
  '/': {
    title: 'Rentas y Ventas de Lujo en Medellín y Antioquia',
    description: SITE.description,
    path: '/',
  },
  '/apartments': {
    title: 'Apartamentos y Casas Amoblados de Lujo en Medellín',
    description: 'Apartamentos y casas amobladas premium en El Poblado, Laureles, San Diego, La Frontera, Envigado y Sabaneta. Contratos formales bajo la Ley 820 de 2003.',
    path: '/apartments',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Apartamentos', path: '/apartments' }],
  },
  '/fincas': {
    title: 'Fincas Exclusivas para Eventos y Escapadas en Antioquia',
    description: 'Fincas de recreo con piscina, jacuzzi y zona BBQ en San Jerónimo, Sopetrán, El Retiro, Barbosa y Girardota. Ideales para eventos y escapadas cerca de Medellín.',
    path: '/fincas',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Fincas', path: '/fincas' }],
  },
  '/water-vehicles': {
    title: 'Yates y Botes en Guatapé',
    description: 'Renta de yates y botes con capitán autorizado y seguro en la represa de Guatapé. Vive la mejor experiencia náutica de Antioquia con grupos privados.',
    path: '/water-vehicles',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Vehículos Acuáticos', path: '/water-vehicles' }],
  },
  '/about': {
    title: 'Nosotros',
    description: 'Conoce la historia y visión de Paradise Premium Rentals & Sales: la agencia inmobiliaria y de hospitalidad de lujo que eleva el estándar en Medellín y Antioquia.',
    path: '/about',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Nosotros', path: '/about' }],
  },
  '/medellin-guide': {
    title: 'Guía de Medellín: Destinos Imperdibles y Zonas',
    description: 'Guía local de Medellín: Provenza, Comuna 13, Guatapé, Parque Arví y más. Los destinos imperdibles seleccionados por nuestros expertos locales.',
    path: '/medellin-guide',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Guía Medellín', path: '/medellin-guide' }],
  },
  '/support': {
    title: 'Soporte y Contacto',
    description: 'Centro de soporte y contacto de Paradise Premium. Resuelve tus dudas y comunícate con nuestros asesores en Medellín, Colombia.',
    path: '/support',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Soporte', path: '/support' }],
  },
  '/privacy': {
    title: 'Política de Privacidad',
    description: 'Política de privacidad y tratamiento de datos personales de Paradise Premium Rentals & Sales.',
    path: '/privacy',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Privacidad', path: '/privacy' }],
  },
  '/terms': {
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso de los servicios de Paradise Premium Rentals & Sales.',
    path: '/terms',
    breadcrumb: [{ name: 'Inicio', path: '/' }, { name: 'Términos', path: '/terms' }],
  },
  '/ai-center': {
    title: 'Centro de Innovación IA',
    description: 'Herramientas de IA para el sector inmobiliario premium.',
    path: '/ai-center',
    noindex: true,
  },
  '/publish': {
    title: 'Portal de Socios',
    description: 'Portal de publicación para propietarios y agentes.',
    path: '/publish',
    noindex: true,
  },
  '/manage': {
    title: 'Gestión de Propiedades',
    description: 'Panel de gestión de propiedades.',
    path: '/manage',
    noindex: true,
  },
};

function SEOController() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    document.documentElement.lang = localStorage.getItem('lang') || 'es';
  }, [path]);

  const config =
    STATIC_SEO[path] ||
    (path.startsWith('/sign/')
      ? { title: 'Firma de Contrato', description: 'Firma electrónica de contrato.', path, noindex: true }
      : null);
  if (!config) return null; // La página gestiona su propio SEO (blog, faq, sectores, datos, propiedades)
  return <Seo {...config} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <SEOController />
      <ToastProvider>
        <Suspense fallback={<PageLoader />}>
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
            <Route path="manage" element={<ListingsManager />} />
            <Route path="property/:id" element={<PropertyDetailPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="sign/:id" element={<GuestSignPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="sectores" element={<NeighborhoodsPage />} />
            <Route path="datos" element={<FactsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          </Routes>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
}
