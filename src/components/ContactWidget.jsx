// --------------------------------------------------------
// ContactWidget — Smart Contact FAB with Business Hours Logic
// During hours: "Llámanos" (WhatsApp call request) + "Chatea"
// After hours: "Te Llamamos" (callback form) + "Chatea"
// Always: Online/Offline indicator, smooth animations
// --------------------------------------------------------
import { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, MessageCircle, Clock, X, Send, CheckCircle, ChevronUp } from 'lucide-react';

// Business hours configuration (Colombia timezone UTC-5)
const BUSINESS_HOURS = {
  start: 8,  // 8:00 AM
  end: 18,   // 6:00 PM
  timezone: 'America/Bogota',
  days: [1, 2, 3, 4, 5, 6] // Mon-Sat (0=Sun)
};

const WHATSAPP_NUMBER = '573015176590';
const PHONE_NUMBER = '+573015176590';

function isBusinessHours() {
  try {
    const now = new Date();
    const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: BUSINESS_HOURS.timezone }));
    const hour = colombiaTime.getHours();
    const day = colombiaTime.getDay();
    return BUSINESS_HOURS.days.includes(day) && hour >= BUSINESS_HOURS.start && hour < BUSINESS_HOURS.end;
  } catch {
    // Fallback: assume business hours
    const hour = new Date().getHours();
    return hour >= 8 && hour < 18;
  }
}

function getNextOpenTime(lang) {
  const now = new Date();
  const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: BUSINESS_HOURS.timezone }));
  const hour = colombiaTime.getHours();
  const day = colombiaTime.getDay();

  if (hour >= BUSINESS_HOURS.end) {
    // After hours today
    if (day === 6) return lang === 'es' ? 'Lunes 8:00 AM' : 'Monday 8:00 AM';
    return lang === 'es' ? 'Mañana 8:00 AM' : 'Tomorrow 8:00 AM';
  }
  if (day === 0) return lang === 'es' ? 'Lunes 8:00 AM' : 'Monday 8:00 AM';
  return lang === 'es' ? 'Hoy 8:00 AM' : 'Today 8:00 AM';
}

export default function ContactWidget({ lang = 'es' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(isBusinessHours());
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackSent, setCallbackSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', property: '' });
  const [pulse, setPulse] = useState(true);
  const menuRef = useRef(null);

  // Update online status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setIsOnline(isBusinessHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
        setShowCallbackForm(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Disable pulse after first interaction
  useEffect(() => {
    if (isOpen) setPulse(false);
  }, [isOpen]);

  const handleWhatsAppCall = () => {
    const message = lang === 'es'
      ? '📞 Hola, me gustaría recibir una llamada de un asesor de Paradise Premium.'
      : '📞 Hi, I would like to receive a call from a Paradise Premium advisor.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  const handleWhatsAppChat = () => {
    const message = lang === 'es'
      ? 'Hola, me interesa saber más sobre las propiedades de Paradise Premium.'
      : 'Hi, I am interested in learning more about Paradise Premium properties.';
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setIsOpen(false);
  };

  const handleDirectCall = () => {
    window.open(`tel:${PHONE_NUMBER}`, '_self');
    setIsOpen(false);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    // In a real implementation, this would POST to an API endpoint
    // For now, we send a WhatsApp message with the callback request
    const message = lang === 'es'
      ? `📋 Solicitud de Llamada:\n👤 Nombre: ${formData.name}\n📱 Teléfono: ${formData.phone}\n🏠 Interés: ${formData.property || 'General'}\n\nPor favor devuélvanme la llamada en horario laboral.`
      : `📋 Callback Request:\n👤 Name: ${formData.name}\n📱 Phone: ${formData.phone}\n🏠 Interest: ${formData.property || 'General'}\n\nPlease call me back during business hours.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    setCallbackSent(true);
    setTimeout(() => {
      setCallbackSent(false);
      setShowCallbackForm(false);
      setFormData({ name: '', phone: '', property: '' });
      setIsOpen(false);
    }, 3000);
  };

  const t = {
    es: {
      callUs: 'Llámanos',
      callUsDesc: 'Un asesor te llama por WhatsApp',
      directCall: 'Llamada directa',
      directCallDesc: 'Llamar al celular',
      chatWithUs: 'Chatea con nosotros',
      chatDesc: 'Respuesta inmediata por WhatsApp',
      callbackTitle: 'Te Llamamos',
      callbackDesc: 'Déjanos tus datos',
      online: 'En línea',
      offline: 'Fuera de horario',
      opensAt: 'Abrimos',
      name: 'Tu nombre',
      phone: 'Tu teléfono',
      property: '¿Qué propiedad te interesa?',
      send: 'Solicitar llamada',
      sent: '¡Listo! Te llamaremos pronto',
      schedule: 'Lun - Sáb: 8am - 6pm',
    },
    en: {
      callUs: 'Call Us',
      callUsDesc: 'An advisor calls you via WhatsApp',
      directCall: 'Direct call',
      directCallDesc: 'Call our mobile',
      chatWithUs: 'Chat with us',
      chatDesc: 'Instant reply via WhatsApp',
      callbackTitle: 'We Call You',
      callbackDesc: 'Leave your details',
      online: 'Online',
      offline: 'After hours',
      opensAt: 'We open',
      name: 'Your name',
      phone: 'Your phone',
      property: 'Which property interests you?',
      send: 'Request callback',
      sent: 'Done! We\'ll call you soon',
      schedule: 'Mon - Sat: 8am - 6pm',
    }
  }[lang] || {};

  return (
    <div ref={menuRef} className="fixed bottom-6 left-6 z-[90] flex flex-col items-start">
      {/* Expanded Menu */}
      {isOpen && !showCallbackForm && (
        <div className="mb-4 w-[300px] sm:w-[320px] animate-fade-in">
          {/* Status Header */}
          <div className="bg-paradise-950/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Online/Offline Banner */}
            <div className={`px-5 py-3 flex items-center justify-between border-b border-white/5 ${
              isOnline 
                ? 'bg-gradient-to-r from-emerald-500/10 to-transparent' 
                : 'bg-gradient-to-r from-orange-500/10 to-transparent'
            }`}>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {isOnline ? t.online : t.offline}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-paradise-400">
                <Clock size={12} />
                <span className="text-[10px] font-medium">
                  {isOnline ? t.schedule : `${t.opensAt}: ${getNextOpenTime(lang)}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-3 space-y-2">
              {isOnline ? (
                <>
                  {/* Call Us (WhatsApp voice request) */}
                  <button
                    onClick={handleWhatsAppCall}
                    className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                      <Phone size={20} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{t.callUs}</p>
                      <p className="text-[11px] text-paradise-400">{t.callUsDesc}</p>
                    </div>
                  </button>

                  {/* Direct Phone Call (mobile only) */}
                  <button
                    onClick={handleDirectCall}
                    className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group md:hidden"
                  >
                    <div className="w-11 h-11 rounded-xl bg-paradise-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Phone size={20} className="text-emerald-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{t.directCall}</p>
                      <p className="text-[11px] text-paradise-400">{t.directCallDesc}</p>
                    </div>
                  </button>
                </>
              ) : (
                /* After Hours: Callback Request */
                <button
                  onClick={() => setShowCallbackForm(true)}
                  className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 transition-all group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                    <PhoneOff size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{t.callbackTitle}</p>
                    <p className="text-[11px] text-paradise-400">{t.callbackDesc}</p>
                  </div>
                </button>
              )}

              {/* Chat (Always available) */}
              <button
                onClick={handleWhatsAppChat}
                className="w-full flex items-center gap-4 p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-paradise-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageCircle size={20} className="text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white">{t.chatWithUs}</p>
                  <p className="text-[11px] text-paradise-400">{t.chatDesc}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Callback Form */}
      {isOpen && showCallbackForm && (
        <div className="mb-4 w-[300px] sm:w-[320px] animate-fade-in">
          <div className="bg-paradise-950/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 flex items-center justify-between border-b border-white/5 bg-gradient-to-r from-orange-500/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <PhoneOff size={16} className="text-orange-400" />
                <span className="text-sm font-bold text-white">{t.callbackTitle}</span>
              </div>
              <button
                onClick={() => setShowCallbackForm(false)}
                className="text-paradise-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X size={16} />
              </button>
            </div>

            {callbackSent ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="text-sm font-bold text-white">{t.sent}</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="p-4 space-y-3">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t.name}
                  className="w-full bg-paradise-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-paradise-500 focus:border-orange-500/50 focus:bg-paradise-900/80 outline-none transition-all"
                />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder={t.phone}
                  className="w-full bg-paradise-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-paradise-500 focus:border-orange-500/50 focus:bg-paradise-900/80 outline-none transition-all"
                />
                <input
                  type="text"
                  value={formData.property}
                  onChange={(e) => setFormData(prev => ({ ...prev, property: e.target.value }))}
                  placeholder={t.property}
                  className="w-full bg-paradise-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-paradise-500 focus:border-orange-500/50 focus:bg-paradise-900/80 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
                >
                  <Send size={14} />
                  {t.send}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowCallbackForm(false);
        }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${
          isOpen
            ? 'bg-paradise-800 rotate-180 scale-90'
            : isOnline
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:scale-110 hover:shadow-emerald-500/40'
              : 'bg-gradient-to-br from-orange-500 to-orange-600 hover:scale-110 hover:shadow-orange-500/40'
        }`}
        aria-label={isOnline ? t.callUs : t.callbackTitle}
      >
        {isOpen ? (
          <ChevronUp size={24} className="text-white" />
        ) : (
          <>
            <Phone size={24} className="text-white group-hover:animate-bounce" />
            {/* Status dot */}
            <span className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${
              isOnline
                ? 'bg-emerald-400 border-emerald-600 animate-pulse'
                : 'bg-orange-400 border-orange-600'
            }`} />
            {/* Ripple effect */}
            {pulse && (
              <span className={`absolute inset-0 rounded-full animate-ping opacity-30 ${
                isOnline ? 'bg-emerald-400' : 'bg-orange-400'
              }`} />
            )}
          </>
        )}
      </button>
    </div>
  );
}
