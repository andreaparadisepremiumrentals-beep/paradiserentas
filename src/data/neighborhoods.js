// -----------------------------------------------------------------------------
// neighborhoods.js — Guía de sectores: barrios de Medellín + municipios cercanos
// -----------------------------------------------------------------------------

export const BARRIOS = [
  {
    id: 'poblado',
    name: 'El Poblado',
    image: '/assets/medellin/provenza.jpg',
    type: 'Premium / Gourmet',
    description:
      'La zona más exclusiva de Medellín. Centro de la vida gastronómica, corporativa y de entretenimiento de la ciudad, con acceso a los mejores restaurantes, centros comerciales y vida nocturna.',
    priceRange: 'COP 4.000.000 – 15.000.000 / mes',
    vibe: 'Cosmopolita, moderna y segura',
    bestFor: 'Ejecutivos, nómadas digitales y quienes buscan el máximo estándar de lujo.',
    tags: ['Provenza', 'Gourmet', 'Vida nocturna', 'Seguridad 24/7'],
  },
  {
    id: 'laureles',
    name: 'Laureles',
    image: '/assets/medellin/la70.jpg',
    type: 'Tradicional / Gastronómico',
    description:
      'Un barrio residencial consolidado y tranquilo, famoso por la avenida La 70 (su corredor gastronómico y de rumba) y por su cercanía a universidades, estadio y zonas verdes.',
    priceRange: 'COP 3.000.000 – 8.000.000 / mes',
    vibe: 'Tradicional, vibrante y peatonal',
    bestFor: 'Familias, estudiantes de posgrado y viajeros que buscan autenticidad local.',
    tags: ['La 70', 'Gastronomía', 'Estadio', 'Ciclovías'],
  },
  {
    id: 'envigado',
    name: 'Envigado',
    image: '/assets/medellin/envigado.png',
    type: 'Residencial / Familiar',
    description:
      'Municipio del sur del Valle de Aburrá, contiguo a El Poblado. Destaca por su calidad de vida, parques, cafés de especialidad y una oferta residencial moderna y segura.',
    priceRange: 'COP 3.500.000 – 10.000.000 / mes',
    vibe: 'Tranquila, verde y familiar',
    bestFor: 'Familias y profesionales que quieren tranquilidad sin alejarse de El Poblado.',
    tags: ['Residencial', 'Cafés', 'Parques', 'Cercanía a Poblado'],
  },
  {
    id: 'sabaneta',
    name: 'Sabaneta',
    image: '/assets/medellin/sabaneta.jpg',
    type: 'Acogedor / Emergente',
    description:
      'El municipio más pequeño de Colombia, con una vida nocturna y gastronómica sorprendente alrededor de su parque principal. Muy conectado por el Metro.',
    priceRange: 'COP 2.800.000 – 7.000.000 / mes',
    vibe: 'Pueblerina, joven y en crecimiento',
    bestFor: 'Jóvenes profesionales y quienes buscan ambiente de pueblo con conexión a la ciudad.',
    tags: ['Parque principal', 'Vida nocturna', 'Metro', 'Emergente'],
  },
  {
    id: 'belen',
    name: 'Belén',
    image: '/assets/medellin/pueblito_paisa_real.jpg',
    type: 'Tradicional / Residencial',
    description:
      'Una de las comunas más grandes y tradicionales de Medellín. Residencial, con excelente acceso al occidente de la ciudad, centros comerciales y parques.',
    priceRange: 'COP 2.500.000 – 6.500.000 / mes',
    vibe: 'Auténtica, amplia y familiar',
    bestFor: 'Familias y quienes priorizan espacio, tranquilidad y conectividad con el occidente.',
    tags: ['Residencial', 'Comercio local', 'Parques', 'Occidente'],
  },
  {
    id: 'sandiego',
    name: 'San Diego',
    image: '/assets/medellin/jardin_botanico_real.jpg',
    type: 'Céntrico / Negocios',
    description:
      'Zona céntrica y estratégica, cerca del centro comercial San Diego, la Milla de Oro y los principales corredores de negocios de Medellín.',
    priceRange: 'COP 3.000.000 – 9.000.000 / mes',
    vibe: 'Ejecutiva, conectada y práctica',
    bestFor: 'Viajeros de negocios y quienes necesitan estar cerca de la Milla de Oro.',
    tags: ['Milla de Oro', 'Negocios', 'Centros comerciales', 'Céntrico'],
  },
  {
    id: 'la-frontera',
    name: 'La Frontera',
    image: '/assets/medellin/provenza.jpg',
    type: 'Premium / Residencial',
    description:
      'Sector premium ubicado en el límite entre Medellín y Envigado, con modernas torres residenciales, vías rápidas y cercanía a centros comerciales de alta gama.',
    priceRange: 'COP 4.000.000 – 12.000.000 / mes',
    vibe: 'Moderna, exclusiva y bien conectada',
    bestFor: 'Ejecutivos y familias que buscan torres nuevas con amenidades completas.',
    tags: ['Torres modernas', 'Premium', 'Amenidades', 'Sur'],
  },
];

export const MUNICIPIOS = [
  {
    id: 'san-jeronimo',
    name: 'San Jerónimo',
    image: '/assets/medellin/santafe.png',
    type: 'Fincas / Clima cálido',
    description:
      'A solo 40-50 minutos de Medellín por el Túnel de Occidente. El destino predilecto para fincas con piscina, eventos familiares y escapadas de fin de semana.',
    priceRange: 'COP 800.000 – 3.000.000 / noche',
    vibe: 'Campestre, cálida y festiva',
    bestFor: 'Fincas de recreo, eventos y celebraciones familiares.',
    tags: ['Túnel de Occidente', 'Piscinas', 'Eventos', 'Clima cálido'],
  },
  {
    id: 'sopetran',
    name: 'Sopetrán',
    image: '/assets/medellin/santafe.png',
    type: 'Fincas / Occidente',
    description:
      'En el occidente antioqueño, con clima cálido y paisajes de montaña. Ideal para fincas amplias con zonas verdes y piscina, a ~1 hora de Medellín.',
    priceRange: 'COP 800.000 – 2.800.000 / noche',
    vibe: 'Natural, amplia y tranquila',
    bestFor: 'Retiros, reuniones de grupos grandes y contacto con la naturaleza.',
    tags: ['Occidente', 'Naturaleza', 'Grupos', 'Piscina'],
  },
  {
    id: 'el-retiro',
    name: 'El Retiro',
    image: '/assets/medellin/jardin.png',
    type: 'Fincas / Clima frío',
    description:
      'En el oriente antioqueño, con clima templado-frío y bosques de niebla. Famoso por su gastronomía, flores y fincas de descanso rodeadas de naturaleza.',
    priceRange: 'COP 1.000.000 – 3.000.000 / noche',
    vibe: 'Boscosa, elegante y de descanso',
    bestFor: 'Descanso, desconexión y celebraciones íntimas en clima fresco.',
    tags: ['Oriente', 'Bosques', 'Gastronomía', 'Clima frío'],
  },
  {
    id: 'barbosa',
    name: 'Barbosa',
    image: '/assets/medellin/guatape.jpg',
    type: 'Fincas / Norte',
    description:
      'Al norte del Valle de Aburrá, con clima cálido y amplias fincas de recreo. Perfecto para días de sol, piscina y amaneceres despejados.',
    priceRange: 'COP 900.000 – 3.000.000 / noche',
    vibe: 'Soleada, campestre y familiar',
    bestFor: 'Días de sol, piscina y celebraciones al aire libre.',
    tags: ['Norte', 'Sol', 'Piscina', 'Familiar'],
  },
  {
    id: 'girardota',
    name: 'Girardota',
    image: '/assets/medellin/comuna13.jpg',
    type: 'Fincas / Norte cercano',
    description:
      'Municipio cercano al norte de Medellín, de tradición campesina y clima cálido. Fincas amplias con fácil acceso desde la autopista Norte.',
    priceRange: 'COP 900.000 – 2.500.000 / noche',
    vibe: 'Tradicional, cercana y campestre',
    bestFor: 'Escapadas rápidas sin alejarse demasiado de la ciudad.',
    tags: ['Autopista Norte', 'Cercano', 'Campestre', 'Clima cálido'],
  },
  {
    id: 'santa-fe-antioquia',
    name: 'Santa Fe de Antioquia',
    image: '/assets/medellin/santafe.png',
    type: 'Patrimonio / Colonial',
    description:
      'Pueblo patrimonio de arquitectura colonial, con clima cálido, el emblemático Puente de Occidente y una oferta gastronómica y cultural única.',
    priceRange: 'COP 1.000.000 – 3.000.000 / noche',
    vibe: 'Colonial, cultural y cálida',
    bestFor: 'Turismo cultural, historia y escapadas con encanto patrimonial.',
    tags: ['Patrimonio', 'Colonial', 'Puente de Occidente', 'Cultura'],
  },
  {
    id: 'guatape',
    name: 'Guatapé',
    image: '/assets/medellin/guatape.jpg',
    type: 'Náutico / Turístico',
    description:
      'A orillas de la represa Peñol-Guatapé, famoso por sus zócalos coloridos, la Piedra del Peñol y sus experiencias náuticas. Destino imperdible de Antioquia.',
    priceRange: 'Yates desde COP 3.500.000 / jornada',
    vibe: 'Colorida, turística y acuática',
    bestFor: 'Experiencias náuticas, renta de yates y turismo de paisaje.',
    tags: ['Represa', 'Yates', 'Piedra del Peñol', 'Turismo'],
  },
];

export const SECTORES_META = {
  barriosTitle: 'Barrios de Medellín',
  barriosDesc:
    'Conoce los sectores premium de Medellín y el Área Metropolitana donde operamos, con sus precios de referencia, ambiente y para quién son ideales.',
  municipiosTitle: 'Municipios cercanos',
  municipiosDesc:
    'Fincas y experiencias a menos de 2 horas de Medellín: occidente, oriente y norte de Antioquia.',
};
