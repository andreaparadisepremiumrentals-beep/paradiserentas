// --------------------------------------------------------
// MedellinGuidePage — Interactive Map + Expanded Locations
// --------------------------------------------------------
import { MapPin, Compass, Navigation, ExternalLink } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

import placesData from '../data/places.json';

const { PLACES, CONTENT, HIDDEN_GEMS } = placesData;

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
