// -----------------------------------------------------------------------------
// site.js — Configuración central del negocio (fuente única de verdad SEO/NAP)
// Se usa en index.html (datos estructurados), sitemap, seo.js y componentes.
// -----------------------------------------------------------------------------

export const SITE = {
  name: 'Paradise Premium Rentals & Sales',
  shortName: 'Paradise Premium',
  legalName: 'Paradise Premium Rentals & Sales',
  tagline: 'Rentas y ventas de propiedades premium en Medellín y Antioquia',
  description:
    'Paradise Premium Rentals & Sales: apartamentos de lujo, fincas exclusivas y experiencias náuticas premium en Medellín, el Área Metropolitana y Antioquia, Colombia. Potenciado por IA.',
  url: 'https://www.paradiserentas.com',
  email: 'info@paradiserentas.com',
  phoneDisplay: '+57 301 517 6590',
  phoneIntl: '+573015176590',
  whatsapp: '573015176590',
  foundingYear: '2014',
  priceRange: '$$$',
  logo: '/assets/logoparadise.png',
  image: '/assets/hero-medellin.png',

  address: {
    streetAddress: 'El Poblado',
    addressLocality: 'Medellín',
    addressRegion: 'Antioquia',
    postalCode: '050021',
    addressCountry: 'CO',
  },

  geo: { latitude: 6.2088, longitude: -75.5679 },
  areaServed: ['Medellín', 'Valle de Aburrá', 'Antioquia', 'Colombia'],

  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00',
      closes: '18:00',
    },
  ],

  social: {
    instagram: 'https://www.instagram.com/paradisepremium.co',
    facebook: 'https://www.facebook.com/paradisepremium.co',
    youtube: 'https://www.youtube.com/@paradisepremium',
  },

  founders: [
    { name: 'Andrea', role: 'Socia Fundadora' },
    { name: 'Gustavo', role: 'Socio Fundador' },
  ],
};

export const CATEGORIES = [
  { id: 'apartments', slug: 'apartments', label: 'Apartamentos & Casas', kind: 'apartamento' },
  { id: 'fincas', slug: 'fincas', label: 'Fincas Exclusivas', kind: 'finca' },
  { id: 'water-vehicles', slug: 'water-vehicles', label: 'Vehículos Acuáticos', kind: 'yate' },
];

export const absoluteUrl = (path = '/') => {
  if (/^https?:\/\//.test(path)) return path;
  const base = SITE.url.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
};
