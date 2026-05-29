// --------------------------------------------------------
// MedellinGuidePage — Interactive Map + Expanded Locations
// --------------------------------------------------------
import { MapPin, Compass, Navigation, ExternalLink } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

const PLACES = [
  { id: 'provenza', name: 'Provenza', img: '/assets/medellin/provenza.jpg', lat: 6.2088, lng: -75.5679 },
  { id: 'la70', name: 'La 70', img: '/assets/medellin/la70.jpg', lat: 6.2486, lng: -75.5936 },
  { id: 'comuna13', name: 'Comuna 13', img: '/assets/medellin/comuna13.jpg', lat: 6.2462, lng: -75.6128 },
  { id: 'guatape', name: 'Guatapé', img: '/assets/medellin/guatape.jpg', lat: 6.2325, lng: -75.1575 },
  { id: 'rioclaro', name: 'Río Claro', img: '/assets/medellin/rioclaro.jpg', lat: 5.9042, lng: -74.8567 },
  { id: 'sabaneta', name: 'Sabaneta', img: '/assets/medellin/sabaneta.jpg', lat: 6.1517, lng: -75.6167 },
  { id: 'parquearvi', name: 'Parque Arví', img: '/assets/medellin/parquearvi.jpg', lat: 6.2833, lng: -75.5000 },
  { id: 'jardin_botanico', name: 'Jardín Botánico', img: '/assets/medellin/jardin_botanico_real.jpg', lat: 6.2707, lng: -75.5638 },
  { id: 'pueblito_paisa', name: 'Pueblito Paisa', img: '/assets/medellin/pueblito_paisa_real.jpg', lat: 6.2364, lng: -75.5781 },
  { id: 'santafe', name: 'Santa Fe de Antioquia', img: '/assets/medellin/santafe.png', lat: 6.5561, lng: -75.8286 },
  { id: 'envigado', name: 'Envigado', img: '/assets/medellin/envigado.png', lat: 6.1711, lng: -75.5906 },
  { id: 'jardin', name: 'Jardín', img: '/assets/medellin/jardin.png', lat: 5.5986, lng: -75.8194 },
];

const CONTENT = {
  provenza: {
    es: 'La calle más cool del mundo. Un oasis de vegetación y lujo gourmet.',
    en: 'The coolest street in the world. An oasis of luxury greenery and gourmet dining.',
    tag: 'Trending'
  },
  la70: {
    es: 'El corazón de la fiesta paisa. Auténtica rumba de Medellín.',
    en: 'The heart of the paisa party. Authentic Medellin nightlife.',
    tag: 'Fiesta'
  },
  comuna13: {
    es: 'Historias de resiliencia y arte urbano espectacular.',
    en: 'Stories of resilience and spectacular urban art.',
    tag: 'Cultura'
  },
  guatape: {
    es: 'La mejor vista del mundo desde el Peñol.',
    en: 'The best view in the world from the Rock.',
    tag: 'Paisaje'
  },
  rioclaro: {
    es: 'Aventura en un cañón de mármol y aguas cristalinas.',
    en: 'Adventure in a marble canyon and crystal clear waters.',
    tag: 'Aventura'
  },
  sabaneta: {
    es: 'El municipio más pequeño de Colombia con la mejor vida nocturna.',
    en: 'Colombia\'s smallest municipality with the best nightlife.',
    tag: 'Local'
  },
  parquearvi: {
    es: 'Naturaleza y aventura a minutos del centro por metrocable.',
    en: 'Nature and adventure just minutes from downtown by cable car.',
    tag: 'Naturaleza'
  },
  jardin_botanico: {
    es: 'Un oasis natural de conservación vegetal en medio de la ciudad.',
    en: 'A natural oasis of plant conservation in the middle of the city.',
    tag: 'Jardines'
  },
  pueblito_paisa: {
    es: 'Una réplica pintoresca de un pueblo tradicional antioqueño en la cima del Cerro Nutibara.',
    en: 'A picturesque replica of a traditional Antioquian town atop Cerro Nutibara.',
    tag: 'Historia'
  },
  santafe: {
    es: 'Pueblo colonial patrimonio con clima cálido, puente de occidente y arquitectura histórica.',
    en: 'Colonial heritage town with warm climate, the Bridge of the West, and historic architecture.',
    tag: 'Colonial'
  },
  envigado: {
    es: 'Municipio residencial tranquilo con excelentes cafés, parques y cercanía a El Poblado.',
    en: 'Quiet residential municipality with excellent cafes, parks, and proximity to El Poblado.',
    tag: 'Residencial'
  },
  jardin: {
    es: 'Pueblo patrimonio rodeado de montañas verdes, café y avistamiento de aves de talla mundial.',
    en: 'Heritage town surrounded by green mountains, coffee farms, and world-class birdwatching.',
    tag: 'Patrimonio'
  }
};

const HIDDEN_GEMS = [
  { 
    name: 'Pergamino Cafe', 
    type: 'Café de Especialidad', 
    desc: 'El epicentro de la cultura del café en El Poblado.',
    img: '/assets/pergamino_cafe.png'
  },
  { 
    name: 'El Social', 
    type: 'Bar Tradicional', 
    desc: 'Una esquina mítica donde la tradición paisa se encuentra con la modernidad.',
    img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80'
  },
  { 
    name: 'Oci.Mde', 
    type: 'Gastronomía Autor', 
    desc: 'Cocina lenta y sabores profundos en un ambiente industrial sofisticado.',
    img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'
  },
  {
    name: 'Carmen',
    type: 'Alta Cocina',
    desc: 'Fusión colombiana con técnicas internacionales. Uno de los mejores restaurantes de la ciudad.',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'
  },
  {
    name: 'Alambique',
    type: 'Coctelería Artesanal',
    desc: 'Cocteles de autor con ingredientes locales en un ambiente íntimo y sofisticado.',
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&q=80'
  },
  {
    name: 'Mercado del Río',
    type: 'Food Hall',
    desc: 'El mercado gastronómico más grande de Medellín. Más de 40 puestos con cocina del mundo.',
    img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
  }
];

// ─── MAP MARKERS ─────────────────────────────────────────
// Pin positions mapped to a percentage-based coordinate system
// relative to the Google Maps embed center (Medellín)
const MAP_PINS = PLACES.map(p => ({
  id: p.id,
  name: p.name,
  tag: CONTENT[p.id]?.tag || '',
}));

export default function MedellinGuidePage() {
  const { lang = 'es' } = useOutletContext() || {};
  const [activePin, setActivePin] = useState(null);
  const [mapFilter, setMapFilter] = useState('all');

  const filteredPlaces = mapFilter === 'all' 
    ? PLACES 
    : PLACES.filter(p => {
        if (mapFilter === 'city') return ['provenza','la70','comuna13','jardin_botanico','pueblito_paisa','envigado'].includes(p.id);
        if (mapFilter === 'nature') return ['guatape','rioclaro','parquearvi','jardin'].includes(p.id);
        if (mapFilter === 'towns') return ['sabaneta','santafe'].includes(p.id);
        return true;
      });

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          {lang === 'es' ? 'Guía de' : 'Guide to'}{' '}
          <span className="heading-orange" style={{ WebkitTextFillColor: 'unset' }}>
            <span className="heading-orange">Medellín</span>
          </span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {lang === 'es' ? 'Los destinos imperdibles seleccionados por nuestros expertos locales.' : 'Unmissable destinations selected by our local experts.'}
        </p>
      </div>

      {/* ─── INTERACTIVE MAP SECTION ─── */}
      <section className="mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-paradise-50 uppercase tracking-tighter mb-3 flex items-center gap-3">
              <Navigation size={28} className="text-orange-500" />
              {lang === 'es' ? 'Mapa Interactivo' : 'Interactive Map'}
            </h2>
            <p className="text-paradise-400">
              {lang === 'es' ? 'Explora las zonas de Medellín y sus alrededores.' : 'Explore the areas of Medellín and surroundings.'}
            </p>
          </div>
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'all', label: lang === 'es' ? 'Todos' : 'All' },
              { key: 'city', label: lang === 'es' ? 'Ciudad' : 'City' },
              { key: 'nature', label: lang === 'es' ? 'Naturaleza' : 'Nature' },
              { key: 'towns', label: lang === 'es' ? 'Pueblos' : 'Towns' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setMapFilter(f.key)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  mapFilter === f.key
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                    : 'bg-white/5 text-paradise-400 border-white/10 hover:text-orange-400 hover:border-orange-500/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map Container */}
        <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
          {/* Google Maps Embed */}
          <div className="w-full h-[450px] md:h-[550px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d126779.72592584945!2d-75.5906052!3d6.2476376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa de Medellín"
            />
          </div>

          {/* Location Cards Overlay at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-paradise-950 via-paradise-950/95 to-transparent pt-16 pb-6 px-6">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {filteredPlaces.map((place) => (
                <a
                  key={place.id}
                  href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 hover:border-orange-500/30 hover:bg-orange-500/10 transition-all group cursor-pointer"
                >
                  <img src={place.img} alt={place.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{place.name}</p>
                    <p className="text-[10px] text-paradise-400 font-bold uppercase tracking-widest">{CONTENT[place.id].tag}</p>
                  </div>
                  <ExternalLink size={14} className="text-paradise-500 group-hover:text-orange-400 ml-1" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PLACES GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 mb-32">
        {PLACES.map((place, i) => (
          <div key={i} className="group relative rounded-[40px] overflow-hidden bg-paradise-900/10 border border-white/5 hover:border-orange-500/20 transition-all duration-1000">
            <div className="relative h-[550px] overflow-hidden">
               <img 
                 src={place.img} 
                 alt={place.name} 
                 className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105 brightness-[0.7] group-hover:brightness-95"
                 decoding="async"
                 loading="lazy"
               />
               
               <div className="absolute top-10 right-10">
                  <div className="bg-orange-500/20 backdrop-blur-md text-orange-300 text-[10px] font-bold px-6 py-2.5 rounded-full uppercase tracking-widest border border-orange-500/20">
                    {CONTENT[place.id].tag}
                  </div>
               </div>

               <div className="absolute inset-0 bg-gradient-to-t from-paradise-950 via-paradise-950/20 to-transparent" />

               <div className="absolute bottom-12 left-10 right-10">
                  <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">{place.name}</h3>
                  <p className="text-paradise-300 text-sm leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 max-w-[80%]">
                    {lang === 'es' ? CONTENT[place.id].es : CONTENT[place.id].en}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-orange-400 text-[10px] font-bold uppercase tracking-[0.4em] hover:tracking-[0.6em] transition-all"
                  >
                    {lang === 'es' ? 'Ver en Mapa' : 'View on Map'} <Compass size={18} />
                  </a>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Hidden Gems Section ─── */}
      <section className="max-w-7xl mx-auto border-t border-white/5 pt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-paradise-50 uppercase tracking-tighter mb-4">
              Hidden Gems <span className="text-orange-500 font-serif italic lowercase font-light">en El Poblado</span>
            </h2>
            <p className="text-paradise-400 max-w-xl">Donde los locales realmente pasan el tiempo. Una selección curada de spots exclusivos.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
            <MapPin size={18} className="text-orange-500" />
            <span className="text-xs font-bold text-paradise-200 uppercase tracking-widest">Secret Spots 2025</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {HIDDEN_GEMS.map((gem, i) => (
             <div key={i} className="group glass-card rounded-[32px] p-6 hover:bg-orange-500/5 hover:border-orange-500/30 transition-all duration-500">
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/5">
                  <img src={gem.img} alt={gem.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                </div>
                <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">{gem.type}</h4>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{gem.name}</h3>
                <p className="text-paradise-400 text-sm leading-relaxed">{gem.desc}</p>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
}
