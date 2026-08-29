// -----------------------------------------------------------------------------
// prerender.mjs — Genera un index.html físico por cada ruta pública
// -----------------------------------------------------------------------------
// GitHub Pages sirve contenido estático: /fincas, /apartments, /blog, etc. no
// existen como archivos y devuelven HTTP 404 (Google no indexa esas URLs, aunque
// el 404.html haga un redirect por JS para navegadores).
//
// Este script copia el index.html compilado (shell de la SPA) a cada ruta, con
// su <title>, <meta description>, canonical y Open Graph correctos "horneados".
// Así cada URL devuelve 200 + metadatos, y la SPA hidrata la vista al cargar.
// -----------------------------------------------------------------------------
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { BLOG_POSTS } from '../src/data/blogPosts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const SITE_URL = 'https://www.paradiserentas.com';
const APP_NAME = 'Paradise Premium';
const DEFAULT_IMAGE = '/assets/hero-medellin.png';

const template = readFileSync(join(DIST, 'index.html'), 'utf8');

const routes = [
  { path: 'apartments', title: 'Apartamentos y Casas Amoblados de Lujo en Medellín', description: 'Apartamentos y casas amobladas premium en El Poblado, Laureles, San Diego, La Frontera, Envigado y Sabaneta. Contratos formales bajo la Ley 820 de 2003.' },
  { path: 'fincas', title: 'Fincas Exclusivas para Eventos y Escapadas en Antioquia', description: 'Fincas de recreo con piscina, jacuzzi y zona BBQ en San Jerónimo, Sopetrán, El Retiro, Barbosa y Girardota. Ideales para eventos y escapadas cerca de Medellín.' },
  { path: 'water-vehicles', title: 'Yates y Botes en Guatapé', description: 'Renta de yates y botes con capitán autorizado y seguro en la represa de Guatapé. Vive la mejor experiencia náutica de Antioquia con grupos privados.' },
  { path: 'about', title: 'Nosotros', description: 'Conoce la historia y visión de Paradise Premium Rentals & Sales: la agencia inmobiliaria y de hospitalidad de lujo que eleva el estándar en Medellín y Antioquia.' },
  { path: 'medellin-guide', title: 'Guía de Medellín', description: 'Guía local de Medellín: Provenza, Comuna 13, Guatapé, Parque Arví y más. Los destinos imperdibles seleccionados por nuestros expertos locales.' },
  { path: 'support', title: 'Soporte y Contacto', description: 'Centro de soporte y contacto de Paradise Premium. Resuelve tus dudas y comunícate con nuestros asesores en Medellín, Colombia.' },
  { path: 'privacy', title: 'Política de Privacidad', description: 'Política de privacidad y tratamiento de datos personales de Paradise Premium Rentals & Sales.' },
  { path: 'terms', title: 'Términos y Condiciones', description: 'Términos y condiciones de uso de los servicios de Paradise Premium Rentals & Sales.' },
  { path: 'faq', title: 'Preguntas Frecuentes', description: 'Resuelve tus dudas sobre arriendos premium en Medellín: reservas, documentos, pagos, fincas, experiencias náuticas y administración de propiedades.' },
  { path: 'blog', title: 'Blog y Guías de Medellín', description: 'Artículos y guías sobre vivir, arrendar y disfrutar Medellín y Antioquia: barrios, precios, fincas, experiencias náuticas y consejos para propietarios.' },
  { path: 'sectores', title: 'Guía de Sectores y Barrios de Medellín', description: 'Guía de sectores de Medellín y el Área Metropolitana: El Poblado, Laureles, Envigado, Sabaneta y municipios cercanos con precios, ambiente y recomendaciones.' },
  { path: 'datos', title: 'Datos y Cifras de Medellín', description: 'Datos y cifras de Medellín y el mercado inmobiliario premium: clima, población, precios de arriendo por sector y los números de Paradise Premium.' },
];

for (const post of BLOG_POSTS) {
  routes.push({ path: `blog/${post.slug}`, title: post.title, description: post.metaDescription, image: post.image });
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function replaceOnce(html, regex, replacement, label) {
  if (!regex.test(html)) throw new Error(`No se encontró el patrón: ${label}`);
  return html.replace(regex, replacement);
}

function renderRoute({ title, description, image, url }) {
  const fullTitle = `${title} | ${APP_NAME}`;
  const img = image && image.startsWith('/') ? SITE_URL + image : SITE_URL + DEFAULT_IMAGE;
  const desc = escapeAttr(description);
  const ttl = escapeAttr(fullTitle);

  let html = template;
  html = replaceOnce(html, /<title>[\s\S]*?<\/title>/, `<title>${ttl}</title>`, 'title');
  html = replaceOnce(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${desc}" />`, 'description');
  html = replaceOnce(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical');
  html = replaceOnce(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${ttl}" />`, 'og:title');
  html = replaceOnce(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${desc}" />`, 'og:description');
  html = replaceOnce(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  html = replaceOnce(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${img}" />`, 'og:image');
  html = replaceOnce(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${ttl}" />`, 'twitter:title');
  html = replaceOnce(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${desc}" />`, 'twitter:description');
  html = replaceOnce(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${img}" />`, 'twitter:image');
  return html;
}

let count = 0;
for (const route of routes) {
  const url = `${SITE_URL}/${route.path}`;
  const html = renderRoute({ ...route, url });
  const dir = join(DIST, route.path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  count++;
}

console.log(`✅ Prerender completado: ${count} rutas generadas en dist/ (index.html por directorio).`);
