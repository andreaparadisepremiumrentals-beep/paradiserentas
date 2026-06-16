// --------------------------------------------------------
// HomePage — Paradise Premium Rentals — Hero Image & Orange Headers
// --------------------------------------------------------
import { useToast } from '../components/ToastProvider';
import { Search, Building2, Trees, Ship, Star, Award, MapPin, ChevronRight, Zap, MessageCircle, Phone } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CATEGORIES = [
  { id: 'apts', icon: Building2, to: '/apartments' },
  { id: 'fincas', icon: Trees, to: '/fincas' },
];

import { getProperties, removeProperty, isAuthorized } from '../lib/store';
import { Trash2 } from 'lucide-react';
import PartnerAuthModal from '../components/PartnerAuthModal';

export default function HomePage() {
  const { lang, t } = useOutletContext();
  const { addToast } = useToast();
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    getProperties().then(props => setRecentProperties(props.slice(0, 6)));
  }, []);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
 
  const handleDeleteTrigger = (id) => {
    setPendingDeleteId(id);
    setIsAuthModalOpen(true);
  };
 
  const onConfirmAuthDelete = async (rawEmail) => {
    setIsAuthModalOpen(false);
     
    if (!isAuthorized(rawEmail)) {
      addToast(t.partner_unauthorized, 'error');
      return;
    }
 
    if (confirm(t.delete_confirm)) {
      try {
        await removeProperty(pendingDeleteId, rawEmail);
        const props = await getProperties();
        setRecentProperties(props.slice(0, 6));
        addToast(lang === 'es' ? 'Propiedad eliminada.' : 'Property deleted.');
      } catch (err) {
        addToast(err.message, 'error');
      } finally {
        setPendingDeleteId(null);
      }
    }
  };

  const CAT_INFO = [
    { title: t.cat_apartments, count: '30+' },
    { title: t.cat_fincas, count: '15+' },
  ];

  return (
    <div className="flex flex-col animate-fade-in relative">
      
      {/* ─── Hero Section with Medellín Image ─── */}
      <section className="relative min-h-[93vh] flex items-center px-6 md:px-12 pt-28 pb-20 md:pt-36 md:pb-22 overflow-hidden">
        {/* Background image instead of video */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/assets/hero-medellin.png" 
            alt="" 
            className="w-full h-full object-cover brightness-[0.50] hero-bg-animate"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paradise-950 via-paradise-950/60 to-paradise-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-paradise-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-3">
            <h1 className="text-5xl md:text-6xl lg:text-[5.2rem] text-paradise-50 leading-[1.05] mb-8 font-sans font-black tracking-tighter text-shadow-premium">
              {t.heroTitle_1} <br />
              <span className="text-emerald-400 font-sans font-black italic tracking-tighter text-shadow-premium">
                {t.heroTitle_2}
              </span> <br />
              {t.heroTitle_3}
            </h1>
            <p className="text-paradise-200 text-lg md:text-xl max-w-xl mb-12 leading-relaxed font-light tracking-wide text-shadow-subtle">
              {t.heroDesc}
            </p>

            <div className="glass p-2 rounded-[28px] flex items-center gap-2 max-w-2xl border border-white/10 shadow-3xl hover:border-emerald-500/30 transition-all group">
              <div className="flex-1 flex items-center gap-4 px-6">
                <Search size={22} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                <input
                  type="text"
                  placeholder={lang === 'es' ? '¿A dónde quieres ir hoy?' : 'Where to today?'}
                  className="w-full bg-transparent border-none text-paradise-50 placeholder:text-paradise-500 focus:outline-none text-base font-medium"
                />
              </div>
              <button 
                className="btn-emerald text-[11px] px-12 py-4 rounded-[22px]"
              >
                {t.btnSearch}
              </button>
            </div>
          </div>

          {/* MÉTRICAS */}
          <div className="lg:col-span-2 flex flex-col gap-12 items-end lg:pr-12">
            <div className="text-right">
               <p className="text-7xl font-black mb-1 tracking-tighter text-shadow-premium" style={{ color: '#10b981' }}>200+</p>
               <p className="text-[11px] text-paradise-300 font-bold uppercase tracking-[0.4em] opacity-80 text-shadow-subtle">{t.stats_premium}</p>
            </div>
            
            <div className="text-right translate-x-[-20%]">
               <p className="text-7xl font-black text-paradise-50 mb-1 tracking-tighter text-shadow-premium">98%</p>
               <p className="text-[11px] text-emerald-400/70 font-bold uppercase tracking-[0.4em] opacity-80 text-shadow-subtle">{t.stats_satisfaction}</p>
            </div>
 
            <div className="text-right">
               <p className="text-7xl font-black text-paradise-50 mb-1 tracking-tighter text-shadow-premium">12+</p>
               <p className="text-[11px] text-paradise-300 font-bold uppercase tracking-[0.4em] opacity-80 text-shadow-subtle">{t.stats_years}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categorías ─── */}
      <section className="px-6 md:px-12 -mt-8 relative z-20 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={i}
              to={cat.to}
              className="group flex flex-col items-center p-12 rounded-[50px] transition-all duration-700 hover:bg-white/[0.02] border border-transparent hover:border-emerald-500/10"
            >
              <div className="w-28 h-28 flex items-center justify-center text-paradise-400 mb-8 group-hover:scale-110 transition-transform">
                <cat.icon size={72} strokeWidth={0.75} className="group-hover:text-emerald-400 transition-colors" />
              </div>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.5em] mb-4 text-paradise-100 group-hover:text-emerald-400 transition-colors">{CAT_INFO[i].title}</h3>
              <p className="text-[10px] text-paradise-500 font-bold uppercase tracking-widest">{CAT_INFO[i].count} {t.cat_listings}</p>
            </Link>
          ))}
        </div>

        {/* PROPIEDADES DESTACADAS */}
        <div className="max-w-7xl mx-auto mt-32">
           <div className="flex justify-between items-end mb-16 border-b border-white/5 pb-10">
              <div>
                <h2 className="text-emerald-400 text-4xl md:text-5xl mb-3 tracking-tight" style={{ WebkitTextFillColor: 'unset' }}>
                  <span>{lang === 'es' ? 'Selección Exclusiva' : 'Exclusive Selection'}</span>
                </h2>
                <p className="text-paradise-400 text-lg font-light tracking-wide">{lang === 'es' ? 'Joyas ocultas en los mejores sectores.' : 'Hidden gems in the best areas.'}</p>
              </div>
              <Link 
                to="/apartments" 
                className="btn-emerald-outline text-[10px] px-8 py-3 rounded-full"
              >
                {lang === 'es' ? 'Ver Catálogo' : 'View Catalog'}
              </Link>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((prop) => (
                <div key={prop.id} className="group relative rounded-[32px] overflow-hidden shadow-2xl transition-all duration-1000 border border-white/5">
                   <Link 
                     to={`/property/${prop.id}`} 
                     className="block"
                   >
                     <div className="relative h-[420px] overflow-hidden">
                        <img src={prop.images?.[0]} alt={prop.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-paradise-950 via-paradise-950/20 to-transparent opacity-90" />
                        
                        <div className="absolute top-6 left-6">
                           <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/20 text-emerald-300 text-[9px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                             {prop.category}
                           </div>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                           <div className="flex flex-col gap-4 mb-4">
                              <div>
                                 <h3 className="text-xl font-black text-white mb-1 group-hover:text-emerald-400 transition-colors uppercase tracking-tighter line-clamp-1">
                                   {prop.isMock ? `(X) ${prop.title}` : prop.title}
                                 </h3>
                                 <p className="flex items-center gap-1.5 text-paradise-300 text-xs font-medium">
                                   <MapPin size={14} className="text-emerald-500" /> {prop.neighborhood || prop.location}
                                 </p>
                              </div>
                              <div className="flex justify-between items-end border-t border-white/10 pt-3">
                                 <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Desde</span>
                                 <p className="text-xl font-black text-white">
                                   {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(prop.price)}
                                 </p>
                              </div>
                           </div>
                           <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 rounded-full" />
                        </div>
                     </div>
                   </Link>

                   {/* Delete Trigger — Visible to Partners */}
                   <button 
                     onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteTrigger(prop.id); }}
                     className="absolute z-20 top-6 right-6 bg-red-500/80 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-2xl opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
           </div>

           {/* Direct Contact Section */}
           <div className="mt-20 bg-paradise-900/50 border border-emerald-500/20 backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl">
             <div className="text-center mb-10">
               <h2 className="text-3xl md:text-4xl font-black text-paradise-50 mb-3">{lang === 'es' ? '¿Necesitas asesoría personalizada?' : 'Need personalized assistance?'}</h2>
               <p className="text-paradise-300 text-lg font-light max-w-2xl mx-auto">{lang === 'es' ? 'Contacta directamente a nuestros socios fundadores para encontrar tu propiedad ideal o resolver cualquier duda.' : 'Contact our founding partners directly to find your ideal property or resolve any questions.'}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Andrea */}
                <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 flex flex-col items-center text-center gap-5 hover:border-emerald-500/30 transition-colors shadow-xl">
                  <img src="/assets/andrea.jpeg" alt="Andrea" className="w-24 h-24 rounded-full border-4 border-emerald-500/20 object-cover shadow-2xl" />
                  <div>
                    <h3 className="text-paradise-50 font-black text-2xl">Andrea</h3>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Socia Fundadora</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <a href="https://wa.me/573043399492" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black uppercase transition-all">
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a href="tel:573043399492" className="flex-1 flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 text-paradise-300 rounded-2xl text-xs font-black uppercase transition-all">
                      <Phone size={18} /> Llamar
                    </a>
                  </div>
                </div>

                {/* Gustavo */}
                <div className="glass-card p-8 rounded-3xl border-white/5 bg-white/5 flex flex-col items-center text-center gap-5 hover:border-emerald-500/30 transition-colors shadow-xl">
                  <img src="/assets/gustavo.jpg" alt="Gustavo" className="w-24 h-24 rounded-full border-4 border-emerald-500/20 object-cover shadow-2xl" />
                  <div>
                    <h3 className="text-paradise-50 font-black text-2xl">Gustavo</h3>
                    <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-1">Socio Fundador</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                    <a href="https://wa.me/573104507952" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-black uppercase transition-all">
                      <MessageCircle size={18} /> WhatsApp
                    </a>
                    <a href="tel:573104507952" className="flex-1 flex items-center justify-center gap-2 p-4 bg-white/5 hover:bg-white/10 text-paradise-300 rounded-2xl text-xs font-black uppercase transition-all">
                      <Phone size={18} /> Llamar
                    </a>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      <PartnerAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onConfirm={onConfirmAuthDelete}
        lang={lang}
      />
    </div>
  );
}
