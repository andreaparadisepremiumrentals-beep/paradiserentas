// -----------------------------------------------------------------------------
// FaqPage — Preguntas frecuentes (JSON-LD FAQPage)
// -----------------------------------------------------------------------------
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';
import { FAQ_GROUPS, FAQ_ALL } from '../data/faqs';
import { Seo } from '../lib/seo';

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-paradise-700/40 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 py-5 text-left group">
        <span className="text-paradise-100 font-medium group-hover:text-emerald-400 transition-colors">{q}</span>
        <ChevronDown size={18} className={`text-paradise-400 shrink-0 mt-1 transition-transform duration-300 ${open ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-paradise-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  const { lang = 'es' } = useOutletContext() || {};

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ALL.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="pt-2 md:pt-10 px-6 md:px-14 animate-fade-in bg-paradise-950 pb-40">
      <Seo
        title={lang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
        description="Resuelve tus dudas sobre arriendos premium en Medellín: reservas, documentos, pagos, fincas, experiencias náuticas y administración de propiedades."
        path="/faq"
        breadcrumb={[{ name: 'Inicio', path: '/' }, { name: 'FAQ', path: '/faq' }]}
        jsonLd={[faqSchema]}
      />

      <div className="text-center mb-16">
        <h1 className="heading-display text-4xl md:text-5xl lg:text-6xl text-paradise-50 mb-6">
          {lang === 'es' ? 'Preguntas' : 'Frequently Asked'}{' '}
          <span className="heading-orange">{lang === 'es' ? 'Frecuentes' : 'Questions'}</span>
        </h1>
        <p className="text-paradise-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          {lang === 'es'
            ? 'Todo lo que necesitas saber antes de reservar, arrendar o publicar tu propiedad con Paradise Premium.'
            : 'Everything you need to know before booking, renting or listing your property with Paradise Premium.'}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {FAQ_GROUPS.map((group) => (
          <section key={group.category} className="glass-card rounded-[32px] p-8 md:p-10 border-white/5">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-3">
              <HelpCircle size={18} /> {group.category}
            </h2>
            <div className="mt-2">
              {group.items.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-14 bg-emerald-500/5 border border-emerald-500/20 rounded-[32px] p-8 md:p-10 text-center">
        <MessageCircle size={28} className="text-emerald-400 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-paradise-50 mb-3">
          {lang === 'es' ? '¿No encontraste tu respuesta?' : 'Didn’t find your answer?'}
        </h3>
        <p className="text-paradise-400 mb-6">
          {lang === 'es'
            ? 'Nuestros socios fundadores Andrea y Gustavo te atienden personalmente por WhatsApp.'
            : 'Our founding partners Andrea and Gustavo will assist you personally via WhatsApp.'}
        </p>
        <a
          href="https://wa.me/573015176590?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20Paradise%20Premium"
          target="_blank"
          rel="noreferrer"
          className="btn-emerald inline-block px-8 py-3 rounded-full text-[11px]"
        >
          {lang === 'es' ? 'Chatear ahora' : 'Chat now'}
        </a>
      </div>
    </div>
  );
}
