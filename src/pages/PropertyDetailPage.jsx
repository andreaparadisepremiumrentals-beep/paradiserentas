// --------------------------------------------------------
// PropertyDetailPage — Con datos de ejemplo para evitar crash
// --------------------------------------------------------
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Bed, Bath, Maximize, CheckCircle, 
  MessageCircle, Phone, Star, ChevronLeft, 
  Wifi, Car, Tv, Wind, Coffee, Plus, X, ChevronRight, Loader2, Video
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { createPortal } from 'react-dom';

import { getProperty } from '../lib/store';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const { lang, t } = useOutletContext();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProp = async () => {
      const p = await getProperty(id);
      if (p) setProperty(p);
    };
    fetchProp();
  }, [id]);

  // Bloquear scroll del body cuando la galería esté abierta
  useEffect(() => {
    if (isGalleryOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isGalleryOpen]);

  // Soporte de navegación por teclado (Flechas y Escape)
  useEffect(() => {
    if (!isGalleryOpen || !property || !property.images) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setIsGalleryOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, property]);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-paradise-950 animate-fade-in">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold text-paradise-50">Cargando Propiedad...</h2>
        <Link to="/" className="text-emerald-500 mt-4 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="animate-fade-in pb-20 bg-paradise-950 min-h-screen">
      {/* Header / Nav Back */}
      <div className="absolute top-28 left-6 md:left-12 z-40">
        <Link to="/" className="glass-card p-4 rounded-full text-emerald-400 hover:scale-110 transition-transform bg-paradise-900/50 backdrop-blur-xl border border-emerald-500/20 flex items-center justify-center shadow-2xl group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Gallery Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] mb-12 rounded-[40px] overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => setIsGalleryOpen(true)}
        >
           <div className="relative h-full overflow-hidden bg-paradise-950/50">
             <img src={property.images?.[0] || '/placeholder.jpg'} alt="Prop" className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" />
             <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
           </div>
           <div className="hidden md:grid grid-rows-2 gap-4">
              <div className="relative h-full overflow-hidden rounded-tr-[40px] bg-paradise-950/50">
                <img src={property.images?.[1] || property.images?.[0]} alt="Prop" className="w-full h-full object-contain transition-transform duration-700 hover:scale-105" />
              </div>
              <div className="relative h-full overflow-hidden rounded-br-[40px] bg-paradise-950/50">
                <img src={property.images?.[2] || property.images?.[0]} alt="Prop" className="w-full h-full object-contain brightness-50 transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-black text-2xl uppercase tracking-widest gap-2">
                   <Plus size={32} />
                   <span>Ver Galería</span>
                   <span className="text-xs font-bold text-white/60">({property.images?.length || 0} FOTOS)</span>
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-emerald-500/20">
                  {property.category || 'Alquiler Premium'}
                </span>
                <div className="flex text-emerald-400">
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <h1 className="heading-display text-4xl md:text-5xl text-paradise-50 mb-4">
                {property.isMock ? `(X) ${property.title}` : property.title}
              </h1>
              <div className="flex items-center gap-2 text-paradise-400 font-medium">
                <MapPin size={20} className="text-emerald-500" /> {property.neighborhood || property.location}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 py-8 border-y border-white/5">
               <div className="flex flex-col items-center gap-2">
                 <Bed className="text-emerald-400" />
                 <span className="text-paradise-50 font-bold">{property.bedrooms || 0} Alcobas</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Bath className="text-emerald-400" />
                 <span className="text-paradise-50 font-bold">{property.bathrooms || 0} Baños</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <Maximize className="text-emerald-400" />
                 <span className="text-paradise-50 font-bold">{property.area_m2 || 0} m²</span>
               </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-paradise-50 mb-4 uppercase tracking-widest text-xs">Descripción</h3>
              <p className="text-paradise-300 leading-relaxed text-lg whitespace-pre-wrap">{property.description}</p>
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-paradise-50 mb-6 uppercase tracking-widest text-xs">Amenidades Exclusivas</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                   {property.amenities.map((am, i) => (
                     <div key={i} className="glass-card p-4 rounded-2xl flex flex-col items-center gap-3 border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                        <CheckCircle size={20} className="text-emerald-500" />
                        <span className="text-[10px] text-paradise-300 font-bold uppercase tracking-widest text-center">{am}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Panel */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="glass-card p-8 rounded-[40px] border-emerald-500/30 shadow-2xl relative overflow-hidden bg-paradise-900 border border-white/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[80px]" />
               <p className="text-[10px] text-paradise-400 font-black uppercase tracking-[0.3em] mb-4">Tarifa</p>
               <div className="flex items-end gap-2 mb-8">
                 <span className="text-5xl font-black text-paradise-50">
                    {formatPrice(property.price)}
                 </span>
               </div>

               <div className="space-y-4">
                 <p className="text-[10px] text-paradise-400 font-bold uppercase tracking-widest text-center mb-2">
                   {lang === 'es' ? 'Contacta a un Socio' : 'Contact a Partner'}
                 </p>
                 
                 <div className="grid grid-cols-1 gap-3">
                   {/* Andrea Contact */}
                   <div className="glass-card p-4 rounded-3xl border-white/5 bg-white/5 space-y-3">
                     <div className="flex items-center gap-3">
                       <img src="https://i.pravatar.cc/150?u=andrea1" className="w-10 h-10 rounded-full border border-emerald-500/30" />
                       <div>
                         <p className="text-paradise-50 font-bold text-sm">Andrea</p>
                         <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Socia Fundadora</p>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <a 
                         href={`https://wa.me/573043399492?text=${encodeURIComponent(`Hola Andrea, estoy interesado en la propiedad: ${property.title}.`)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase transition-all"
                       >
                         <MessageCircle size={14} /> WhatsApp
                       </a>
                       <a 
                         href="tel:573043399492"
                         className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-paradise-300 rounded-xl text-[10px] font-black uppercase transition-all"
                       >
                         <Phone size={14} /> Llamar
                       </a>
                     </div>
                   </div>

                   {/* Gustavo Contact */}
                   <div className="glass-card p-4 rounded-3xl border-white/5 bg-white/5 space-y-3">
                     <div className="flex items-center gap-3">
                       <img src="/assets/gustavo.jpg" className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover" />
                       <div>
                         <p className="text-paradise-50 font-bold text-sm">Gustavo</p>
                         <p className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Socio Fundador</p>
                       </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <a 
                         href={`https://wa.me/573104507952?text=${encodeURIComponent(`Hola Gustavo, estoy interesado en la propiedad: ${property.title}.`)}`}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black uppercase transition-all"
                       >
                         <MessageCircle size={14} /> WhatsApp
                       </a>
                       <a 
                         href="tel:573104507952"
                         className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 text-paradise-300 rounded-xl text-[10px] font-black uppercase transition-all"
                       >
                         <Phone size={14} /> Llamar
                       </a>
                     </div>
                   </div>
                 </div>

                 {/* Video Link if exists */}
                 {property.videoUrl && (
                   <a 
                     href={property.videoUrl} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="w-full flex items-center justify-center gap-3 p-5 bg-paradise-50 text-paradise-950 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-white/5"
                   >
                     <Video size={18} /> Ver Video Tour
                   </a>
                 )}
               </div>

               <div className="mt-8 pt-8 border-t border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      <img src="https://i.pravatar.cc/150?u=andrea1" className="w-10 h-10 rounded-full border-2 border-paradise-900" />
                      <img src="/assets/gustavo.jpg" className="w-10 h-10 rounded-full border-2 border-paradise-900 object-cover" />
                    </div>
                    <div>
                      <p className="text-paradise-50 font-bold text-xs">Andrea & Gustavo</p>
                      <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">SOCIOS FUNDADORES</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Gallery Modal / Carousel */}
      {isGalleryOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/96 flex flex-col justify-between select-none animate-fade-in backdrop-blur-md">
           {/* Ambient Glow Background - projected blur of the active image */}
           <div 
             className="absolute inset-0 z-0 bg-cover bg-center filter blur-[120px] opacity-30 scale-90 transition-all duration-[1000ms]"
             style={{ backgroundImage: `url(${property.images?.[activeImage]})` }}
           />

           {/* Floating glassmorphic top bar */}
           <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 bg-black/30 backdrop-blur-md">
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/80 hover:text-white transition-all active:scale-95 text-xs font-bold uppercase tracking-widest cursor-pointer"
              >
                <ChevronLeft size={16} />
                <span>Volver al Detalle</span>
              </button>
              
              {/* Central counter */}
              <div className="hidden sm:block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 font-semibold text-xs uppercase tracking-widest">
                Imagen {String(activeImage + 1).padStart(2, '0')} de {String(property.images?.length || 0).padStart(2, '0')}
              </div>

              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="p-3 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-full text-white/80 hover:text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
              >
                <X size={20} />
              </button>
           </div>
           
           {/* Main Viewer Area */}
           <div className="flex-1 relative flex items-center justify-center p-4 md:p-12 z-10">
              <div className="relative z-10 max-w-5xl max-h-[68vh] md:max-h-[72vh] flex items-center justify-center overflow-hidden rounded-[28px] shadow-3xl border border-white/10 bg-black/40">
                 <img 
                   key={activeImage} // Force fresh mount animation when active image changes!
                   src={property.images?.[activeImage]} 
                   alt="View fullscreen"
                   className="max-w-full max-h-[68vh] md:max-h-[72vh] object-contain transition-all duration-700 animate-fade-in"
                 />
              </div>
              
              {/* Previous Button */}
              <button 
                onClick={() => setActiveImage((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                className="absolute left-6 md:left-12 p-4 bg-black/40 hover:bg-emerald-500 border border-white/10 hover:border-emerald-400 backdrop-blur-md rounded-full text-white hover:text-paradise-950 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center"
              >
                <ChevronLeft size={28} />
              </button>
              
              {/* Next Button */}
              <button 
                onClick={() => setActiveImage((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-6 md:right-12 p-4 bg-black/40 hover:bg-emerald-500 border border-white/10 hover:border-emerald-400 backdrop-blur-md rounded-full text-white hover:text-paradise-950 transition-all duration-300 shadow-2xl hover:scale-110 active:scale-95 flex items-center justify-center"
              >
                <ChevronRight size={28} />
              </button>
           </div>

           {/* Bottom thumbnail selector */}
           <div className="relative z-10 p-6 bg-black/30 border-t border-white/5 backdrop-blur-md">
              <div className="flex gap-3 justify-center overflow-x-auto py-1 no-scrollbar max-w-4xl mx-auto">
                 {property.images.map((img, idx) => (
                   <button 
                     key={idx}
                     onClick={() => setActiveImage(idx)}
                     className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 cursor-pointer ${
                       activeImage === idx 
                         ? 'border-emerald-500 scale-105 shadow-lg shadow-emerald-500/30 opacity-100' 
                         : 'border-white/15 opacity-40 hover:opacity-75'
                     }`}
                   >
                     <img src={img} className="w-full h-full object-cover" />
                   </button>
                 ))}
              </div>
           </div>
        </div>,
        document.body
      )}
    </div>
  );
}
