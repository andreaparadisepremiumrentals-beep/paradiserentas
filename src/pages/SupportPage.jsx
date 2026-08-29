// --------------------------------------------------------
// SupportPage — Help center with FAQ + Contact form
// --------------------------------------------------------
import { useState } from 'react';
import { ChevronDown, Mail, Phone, MapPin, Send } from 'lucide-react';

const FAQ = [
  {
    q: '¿Cómo puedo agendar una visita a una propiedad?',
    a: 'Haz clic en la propiedad que te interesa y selecciona "Agendar Visita". Un agente se comunicará contigo en las próximas 24 horas para coordinar la visita.',
  },
  {
    q: '¿Qué documentos necesito para arrendar?',
    a: 'Generalmente se requieren: cédula de ciudadanía, carta laboral, últimos 3 extractos bancarios y referencias personales. Cada propietario puede tener requisitos adicionales.',
  },
  {
    q: '¿Cómo funciona el Centro de Innovación IA?',
    a: 'Nuestro Centro de IA incluye herramientas exclusivas para propietarios y agentes: staging virtual, generación automática de descripciones, tasación predictiva y un copiloto conversacional para búsquedas avanzadas.',
  },
  {
    q: '¿Es segura la plataforma para realizar pagos?',
    a: 'Sí. Todas las transacciones están protegidas con encriptación de nivel bancario. No almacenamos datos de tarjetas de crédito en nuestros servidores.',
  },
  {
    q: '¿Puedo publicar mi propiedad en la plataforma?',
    a: 'Claro. Regístrate como agente o propietario y tendrás acceso al panel de publicación con nuestras herramientas de IA para optimizar tu anuncio.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-paradise-700/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-paradise-100 font-medium pr-4 group-hover:text-accent-400 transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`text-paradise-400 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-accent-400' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-40 pb-5' : 'max-h-0'
        }`}
      >
        <p className="text-paradise-400 text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // In production this would call a Firebase function or API
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: '', email: '', message: '' });
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in">
      <h1 className="heading-display text-3xl md:text-4xl text-paradise-50 mb-2">
        Centro de Soporte
      </h1>
      <p className="text-paradise-400 mb-10">Estamos aquí para ayudarte en lo que necesites</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* FAQ */}
        <section>
          <h2 className="text-lg font-semibold text-paradise-100 mb-6">Preguntas Frecuentes</h2>
          <div className="glass-card rounded-xl p-6">
            {FAQ.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-lg font-semibold text-paradise-100 mb-6">Contáctanos</h2>
          <div className="glass-card rounded-xl p-6">
            {/* Contact details */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-paradise-300">
                <Mail size={16} className="text-accent-500" />
                <span>info@paradiserentas.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-paradise-300">
                <Phone size={16} className="text-accent-500" />
                <span>+57 301 517 6590</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-paradise-300">
                <MapPin size={16} className="text-accent-500" />
                <span>Medellín, Colombia</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Tu nombre"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-paradise-800/60 border border-paradise-600/40 text-paradise-100 text-sm placeholder-paradise-500 outline-none focus:border-accent-500/50 transition-colors"
              />
              <input
                type="email"
                placeholder="Tu email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-paradise-800/60 border border-paradise-600/40 text-paradise-100 text-sm placeholder-paradise-500 outline-none focus:border-accent-500/50 transition-colors"
              />
              <textarea
                rows={4}
                placeholder="¿En qué podemos ayudarte?"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-paradise-800/60 border border-paradise-600/40 text-paradise-100 text-sm placeholder-paradise-500 outline-none resize-none focus:border-accent-500/50 transition-colors"
              />
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Send size={16} />
                {sent ? '¡Mensaje Enviado!' : 'Enviar Mensaje'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
