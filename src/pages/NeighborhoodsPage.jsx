// -----------------------------------------------------------------------------
// NeighborhoodsPage — Guía de sectores: barrios de Medellín y municipios
// -----------------------------------------------------------------------------
import { useOutletContext, Link } from 'react-router-dom';
import { MapPin, Building2, Mountain, Tag, CheckCircle2 } from 'lucide-react';
import { BARRIOS, MUNICIPIOS, SECTORES_META } from '../data/neighborhoods';
import { Seo } from '../lib/seo';

function SectorCard({ s }) {
  return (
    <div className="group glass-card rounded-[32px] overflow-hidden border border-white/5 hover:border-emerald-500/20 transition-all duration-700 flex flex-col">
      <div className="relative h-52 overflow-hidden">
        <img src={s.image} alt={s.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110 brightness-[0.8] group-hover:brightness-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-paradise-950/90 via-paradise-950/20 to-transparent" />
        <div className="absolute top-4 left-4 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 text-emerald-300 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
          {s.type}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tighter mb-2">{s.name}</h3>
        <p className="text-paradise-400 text-sm leading-relaxed flex-1 mb-4">{s.description}</p>
        <div className="space-y-2 text-[11px]">
          <p className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-widest"><CheckCircle2 size={14} /> {s.priceRange}</p>
          <p className="text-paradise-300">{s.bestFor}</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-widest text-paradise-400">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NeighborhoodsPage() {
  const { lang = 'es' } = useOutletContext() || {};

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      <Seo
        title={lang === 'es' ? 'Guía de Sectores y Barrios de Medellín' : 'Medellín Neighborhood Guide'}
        description="Guía de sectores de Medellín y el Área Metropolitana: El Poblado, Laureles, Envigado, Sabaneta y municipios cercanos con precios, ambiente y recomendaciones."
        path="/sectores"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Sectores', path: '/sectores' }]}
      />

      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          {lang === 'es' ? 'Guía de' : 'Guide to'}{' '}
          <span className="heading-orange">{lang === 'es' ? 'Sectores' : 'Neighborhoods'}</span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {lang === 'es'
            ? 'Los sectores premium de Medellín y los municipios cercanos donde operamos, con precios de referencia y para quién es ideal cada zona.'
            : 'The premium sectors of Medellín and nearby municipalities where we operate, with reference prices and who each area is ideal for.'}
        </p>
      </div>

      {/* Barrios */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-10">
          <Building2 size={26} className="text-emerald-400" />
          <h2 className="text-3xl font-black text-paradise-50 uppercase tracking-tighter">{SECTORES_META.barriosTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BARRIOS.map((s) => <SectorCard key={s.id} s={s} />)}
        </div>
      </section>

      {/* Municipios */}
      <section>
        <div className="flex items-center gap-3 mb-10">
          <Mountain size={26} className="text-emerald-400" />
          <h2 className="text-3xl font-black text-paradise-50 uppercase tracking-tighter">{SECTORES_META.municipiosTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MUNICIPIOS.map((s) => <SectorCard key={s.id} s={s} />)}
        </div>
      </section>

      <div className="max-w-3xl mx-auto mt-20 bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 text-center">
        <MapPin size={26} className="text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-paradise-50 mb-3">
          {lang === 'es' ? '¿No sabes qué sector elegir?' : 'Not sure which area to choose?'}
        </h3>
        <p className="text-paradise-400 mb-6">
          {lang === 'es'
            ? 'Cuéntanos tu presupuesto y estilo de vida y te recomendamos el sector ideal para vivir o invertir.'
            : 'Tell us your budget and lifestyle and we will recommend the ideal area to live or invest.'}
        </p>
        <Link to="/support" className="btn-emerald inline-block px-8 py-3 rounded-full text-[11px]">
          {lang === 'es' ? 'Solicitar asesoría' : 'Request advice'}
        </Link>
      </div>
    </div>
  );
}
