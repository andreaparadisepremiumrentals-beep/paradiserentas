// -----------------------------------------------------------------------------
// webmcp.js — WebMCP: expone herramientas del sitio a agentes de IA en el navegador.
// Es un mejor esfuerzo (progressive enhancement): solo actúa si el navegador
// implementa navigator.modelContext.provideContext (experimental). Si no existe,
// la función no hace nada y no rompe el sitio.
// -----------------------------------------------------------------------------
export function setupWebMCP() {
  if (typeof window === 'undefined') return;
  const mc = window.navigator && window.navigator.modelContext;
  if (!mc || typeof mc.provideContext !== 'function') return;

  const tools = [
    {
      name: 'search_properties',
      description:
        'Abre el catálogo de apartamentos, fincas o experiencias náuticas de lujo disponibles en Medellín y Antioquia.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['apartments', 'fincas', 'water-vehicles'],
            description: 'Categoría de propiedad a consultar.',
          },
        },
      },
      execute: async (args) => {
        const cat = args && args.category ? args.category : 'apartments';
        const urls = { apartments: '/apartments', fincas: '/fincas', 'water-vehicles': '/water-vehicles' };
        return { url: urls[cat] || '/apartments' };
      },
    },
    {
      name: 'open_whatsapp',
      description:
        'Abre un chat de WhatsApp con un asesor de Paradise Premium para consultar disponibilidad.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({ url: 'https://wa.me/573015176590' }),
    },
    {
      name: 'medellin_guide',
      description:
        'Abre la guía local de Medellín con destinos y zonas recomendadas.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({ url: '/medellin-guide' }),
    },
    {
      name: 'pricing_reference',
      description:
        'Abre la página de datos y cifras con los precios de referencia por sector y tipo de propiedad.',
      inputSchema: { type: 'object', properties: {} },
      execute: async () => ({ url: '/datos' }),
    },
  ];

  try {
    mc.provideContext({ tools });
  } catch (_) {
    // navegador no soporta la API o el formato: ignorar silenciosamente
  }
}
