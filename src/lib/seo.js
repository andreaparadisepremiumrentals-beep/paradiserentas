// -----------------------------------------------------------------------------
// seo.js — Gestor de SEO para la SPA (head + Open Graph + Twitter + JSON-LD)
// -----------------------------------------------------------------------------
import { useEffect } from 'react';
import { SITE, absoluteUrl } from './site';

/* ---------- Helpers de DOM ---------- */
function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertHreflang(lang, href) {
  let el = document.head.querySelector(`link[hreflang="${lang}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'alternate');
    el.setAttribute('hreflang', lang);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/* ---------- Esquemas reutilizables ---------- */
export const breadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

/* ---------- Aplicador principal ---------- */
export function applySeo({
  title,
  description,
  path = '/',
  image = SITE.image,
  type = 'website',
  noindex = false,
  jsonLd = [],
  breadcrumb = null,
}) {
  const fullTitle = title ? `${title} | Paradise Premium` : SITE.name;
  const url = absoluteUrl(path);
  const img = absoluteUrl(image);

  document.title = fullTitle;

  upsertMeta('name', 'description', description);
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  upsertMeta('name', 'author', SITE.name);
  upsertMeta('name', 'geo.region', 'CO-ANT');
  upsertMeta('name', 'geo.placename', 'Medellín');
  upsertMeta('name', 'geo.position', `${SITE.geo.latitude};${SITE.geo.longitude}`);
  upsertMeta('name', 'ICBM', `${SITE.geo.latitude}, ${SITE.geo.longitude}`);

  // Open Graph
  upsertMeta('property', 'og:title', fullTitle);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:type', type);
  upsertMeta('property', 'og:site_name', SITE.name);
  upsertMeta('property', 'og:image', img);
  upsertMeta('property', 'og:locale', 'es_CO');
  upsertMeta('property', 'og:locale:alternate', 'en_US');

  // Twitter Card
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', fullTitle);
  upsertMeta('name', 'twitter:description', description);
  upsertMeta('name', 'twitter:image', img);

  upsertLink('canonical', url);
  upsertHreflang('es', url);
  upsertHreflang('en', url);
  upsertHreflang('x-default', url);

  // Datos estructurados específicos de la página
  const schemas = [];
  if (breadcrumb && breadcrumb.length) schemas.push(breadcrumbSchema(breadcrumb));
  const extra = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  schemas.push(...extra.filter(Boolean));

  let script = document.getElementById('seo-page-jsonld');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'seo-page-jsonld';
    document.head.appendChild(script);
  }
  if (schemas.length === 1) {
    script.textContent = JSON.stringify(schemas[0]);
  } else if (schemas.length > 1) {
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas,
    });
  } else {
    script.textContent = '';
  }
}

/* ---------- Componente declarativo ---------- */
export function Seo(props) {
  const serialized = JSON.stringify(props);
  useEffect(() => {
    applySeo(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
  return null;
}

/* ---------- Hook imperativo (para páginas dinámicas) ---------- */
export function useSeo(props) {
  const serialized = JSON.stringify(props);
  useEffect(() => {
    applySeo(props);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized]);
}
