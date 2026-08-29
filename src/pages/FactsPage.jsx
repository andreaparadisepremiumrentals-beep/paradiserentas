// -----------------------------------------------------------------------------
// FactsPage — Datos y cifras de Medellín, el mercado y Paradise Premium
// -----------------------------------------------------------------------------
import { useOutletContext } from 'react-router-dom';
import { Building2, TrendingUp, Gem, Map, Sparkles } from 'lucide-react';
import { FACT_GROUPS } from '../data/facts';
import { Seo } from '../lib/seo';

const ICONS = { City: Building2, TrendingUp: TrendingUp, Gem: Gem, Map: Map };

export default function FactsPage() {
  const { lang = 'es' } = useOutletContext() || {};

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      <Seo
        title={lang === 'es' ? 'Datos y Cifras de Medellín' : 'Medellín Facts & Figures'}
        description="Datos y cifras de Medellín y el mercado inmobiliario premium: clima, población, precios de arriendo por sector y los números de Paradise Premium."
        path="/datos"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'Datos', path: '/datos' }]}
      />

      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          {lang === 'es' ? 'Datos &' : 'Facts &'}{' '}
          <span className="heading-orange">{lang === 'es' ? 'Cifras' : 'Figures'}</span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {lang === 'es'
            ? 'Medellín y Antioquia en números: clima, mercado inmobiliario premium y la trayectoria de Paradise Premium.'
            : 'Medellín and Antioquia in numbers: climate, premium real estate market and Paradise Premium track record.'}
        </p>
      </div>

      <div className="space-y-16 max-w-6xl mx-auto">
        {FACT_GROUPS.map((group) => {
          const Icon = ICONS[group.icon] || Sparkles;
          return (
            <section key={group.title}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Icon size={20} className="text-emerald-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-paradise-50 uppercase tracking-tighter">{group.title}</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {group.items.map((item) => (
                  <div key={item.label} className="glass-card rounded-[28px] p-7 border-white/5 hover:border-emerald-500/20 transition-all duration-500">
                    <p className="text-4xl font-black text-emerald-400 mb-3 tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>{item.value}</p>
                    <p className="text-[10px] text-paradise-300 font-bold uppercase tracking-widest mb-3">{item.label}</p>
                    <p className="text-paradise-400 text-xs leading-relaxed font-light">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="max-w-3xl mx-auto mt-16 text-center text-[11px] text-paradise-500 leading-relaxed">
        {lang === 'es'
          ? '* Cifras generales y de referencia, redondeadas con fines de divulgación. Los precios pueden variar según disponibilidad y temporada.'
          : '* General and reference figures, rounded for informational purposes. Prices may vary by availability and season.'}
      </p>
    </div>
  );
}
