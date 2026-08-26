import { Bot, User, MessageCircle, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChatBubble({ message }) {
  const isAI = message?.role === 'ai';
  const content = message?.content || (typeof message === 'string' ? message : '');
  const properties = message?.properties || [];
  const showContact = message?.showContact || false;

  return (
    <div className={`flex gap-3 animate-fade-in ${isAI ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          isAI
            ? 'bg-gradient-to-br from-emerald-500 to-accent-600 text-white shadow-lg'
            : 'bg-paradise-600 text-paradise-200'
        }`}
      >
        {isAI ? <Bot size={16} /> : <User size={16} />}
      </div>

      {/* Content Container */}
      <div className="max-w-[85%] space-y-3">
        {/* Bubble */}
        {content && (
          <div
            className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              isAI
                ? 'bg-paradise-900/90 text-paradise-100 rounded-tl-sm border border-white/10 shadow-xl'
                : 'bg-emerald-500/20 text-paradise-50 rounded-tr-sm border border-emerald-500/30'
            }`}
          >
            {content}
          </div>
        )}

        {/* Property Cards Carousel / Grid */}
        {properties.length > 0 && (
          <div className="space-y-3 pt-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 pl-1">
              ✨ Propiedades Recomendadas:
            </p>
            <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="bg-paradise-950/90 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all shadow-xl group flex flex-col"
                >
                  <div className="relative h-32 w-full overflow-hidden bg-paradise-900">
                    <img
                      src={prop.images?.[0] || '/placeholder.jpg'}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-500/90 backdrop-blur-md text-paradise-950 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {prop.category === 'apartment' ? 'Apartamento' : 'Finca'}
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <h4 className="text-sm font-bold text-paradise-50 line-clamp-1">
                      {prop.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-paradise-400">
                      <MapPin size={12} className="text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{prop.location || prop.neighborhood}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5">
                      <span className="text-xs font-black text-emerald-400">
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0
                        }).format(prop.price)}
                        <span className="text-[9px] font-normal text-paradise-400"> /noche</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to={`/property/${prop.id}`}
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white/10 hover:bg-white/20 text-paradise-100 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all text-center"
                      >
                        Ver Detalle <ArrowRight size={12} />
                      </Link>
                      <a
                        href={`https://wa.me/573015176590?text=${encodeURIComponent(`Hola, me interesa la propiedad sugerida por la IA: ${prop.title} (ID: ${prop.id})`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-paradise-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-center shadow-lg shadow-emerald-500/20"
                      >
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Agents Card */}
        {showContact && (
          <div className="bg-gradient-to-br from-paradise-900/90 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3.5 space-y-3 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Atención Directa Socios Fundadores
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://wa.me/573015176590?text=Hola%20Andrea,%20vengo%20del%20asistente%20IA%20de%20Paradise%20Premium."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all group"
              >
                <img src="/assets/andrea.jpeg" className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white line-clamp-1">Andrea</p>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">WhatsApp</p>
                </div>
              </a>
              <a
                href="https://wa.me/573015176590?text=Hola%20Gustavo,%20vengo%20del%20asistente%20IA%20de%20Paradise%20Premium."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2.5 bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 rounded-xl transition-all group"
              >
                <img src="/assets/gustavo.jpeg" className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-[11px] font-bold text-white line-clamp-1">Gustavo</p>
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">WhatsApp</p>
                </div>
              </a>
            </div>

            <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2">
               {(() => {
                 const hour = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota', hour: 'numeric', hour12: false });
                 const day = new Date().toLocaleString('en-US', { timeZone: 'America/Bogota', weekday: 'short' });
                 const isOnline = (day !== 'Sun') && (hour >= 8 && hour < 18);
                 
                 return isOnline ? (
                   <a
                     href="https://wa.me/573015176590?text=📞%20Hola,%20me%20gustar%C3%ADa%20recibir%20una%20llamada%20de%20un%20asesor."
                     target="_blank"
                     rel="noopener noreferrer"
                     className="col-span-2 flex items-center justify-center gap-2 p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                   >
                     📞 Solicitar Llamada (Asesor Llama)
                   </a>
                 ) : (
                   <a
                     href="https://wa.me/573015176590?text=📋%20Por%20favor%20devuélvanme%20la%20llamada%20en%20horario%20laboral."
                     target="_blank"
                     rel="noopener noreferrer"
                     className="col-span-2 flex items-center justify-center gap-2 p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                   >
                     📋 Agendar Llamada (Fuera de Horario)
                   </a>
                 );
               })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
