import { useState } from 'react';
import { getModel } from '../lib/deepseek';
import { Sparkles, Loader2, Copy, Check, Users } from 'lucide-react';

const AMENITIES_OPTIONS = [
  'Piscina', 'Gimnasio', 'Parqueadero', 'Seguridad 24h', 'Zona BBQ',
  'Balcón', 'Terraza', 'Jacuzzi', 'Zona de Juegos', 'Lobby Premium',
  'Coworking', 'Sauna', 'Pet-Friendly', 'Vista Panorámica',
];

const AUDIENCES = [
  { id: 'investors', label: 'Inversionistas', desc: 'Enfoque en ROI y plusvalía' },
  { id: 'families', label: 'Familias VIP', desc: 'Enfoque en confort y seguridad' },
  { id: 'nomads', label: 'Nómadas Digitales', desc: 'Enfoque en conectividad y estilo' },
];

export default function DescriptionGenerator() {
  const [form, setForm] = useState({
    bedrooms: '',
    bathrooms: '',
    area: '',
    neighborhood: '',
    city: '',
    amenities: [],
    style: 'luxury',
    audience: 'investors',
    custom_info: ''
  });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // ... (keeping toggleAmenity)

  async function generateDescription() {
    setLoading(true);
    setError('');
    setDescription('');

    try {
      const model = getModel();
      const audienceLabel = AUDIENCES.find(a => a.id === form.audience)?.label || 'Inversionistas';

      const fullPrompt = `Toma el rol de un copywriter experto en bienes raíces de ultra-lujo en Medellín. 
Escribe una descripción persuasiva y evocadora para la siguiente propiedad, orientada específicamente a: ${audienceLabel}.

DETALLES DE LA PROPIEDAD:
- Habitaciones: ${form.bedrooms || 'No especificado'}
- Baños: ${form.bathrooms || 'No especificado'}
- Área: ${form.area ? form.area + ' m²' : 'No especificado'}
- Barrio: ${form.neighborhood || 'No especificado'}
- Ciudad: ${form.city || 'No especificado'}
- Amenidades: ${form.amenities.length ? form.amenities.join(', ') : 'No especificadas'}
- Estilo: ${form.style === 'luxury' ? 'Elegancia Clásica' : form.style === 'modern' ? 'Minimalista Moderno' : 'Acogedor'}
- Información Extra (Libre): ${form.custom_info || 'Ninguna'}
- Objetivo: Convencer a ${audienceLabel} de por qué esta es su mejor opción.

REQUISITOS DEL OUTPUT:
- 3 a 4 párrafos sofisticados.
- Tono aspiracional y exclusivo.
- Optimización SEO natural.
- Español colombiano fluido.
- Emojis mínimos y elegantes.
- NO inventes datos técnicos adicionales.

Genera el copy ahora:`;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();
      
      if (!text) throw new Error('La IA no devolvió contenido.');
      
      setDescription(text);
    } catch (err) {
      console.error('AI Generation Error:', err);
      setError('Error al generar la descripción. Intente nuevamente en unos segundos o verifique su conexión.');
    } finally {
      setLoading(false);
    }
  }

  // ... (keeping handleCopy)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/10 flex items-center justify-center border border-accent-500/20">
          <Sparkles className="text-accent-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-paradise-50">Generador de Copy IA</h3>
          <p className="text-sm text-paradise-400">Escritura persuasiva optimizada para el mercado de lujo</p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest ml-1">Habitaciones</label>
          <input type="number" value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })} placeholder="3" className="w-full px-4 py-3 rounded-xl bg-paradise-800/60 border border-paradise-700/50 text-paradise-100 outline-none focus:border-accent-500/50 transition-all shadow-inner" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest ml-1">Baños</label>
          <input type="number" value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })} placeholder="2" className="w-full px-4 py-3 rounded-xl bg-paradise-800/60 border border-paradise-700/50 text-paradise-100 outline-none focus:border-accent-500/50 transition-all shadow-inner" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest ml-1">Área m²</label>
          <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="150" className="w-full px-4 py-3 rounded-xl bg-paradise-800/60 border border-paradise-700/50 text-paradise-100 outline-none focus:border-accent-500/50 transition-all shadow-inner" />
        </div>
      </div>

      {/* Free Info Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest ml-1 flex items-center gap-2">
          Información Libre <span className="text-paradise-500 font-normal lowercase">(detalles únicos, historia, vistas...)</span>
        </label>
        <textarea
          value={form.custom_info}
          onChange={(e) => setForm({ ...form, custom_info: e.target.value })}
          placeholder="Ej: Tiene vista directa al Parque Lleras, remodelado el año pasado, mármol italiano en la cocina..."
          className="w-full h-24 px-4 py-3 rounded-xl bg-paradise-800/60 border border-paradise-700/50 text-paradise-100 outline-none focus:border-accent-500/50 transition-all shadow-inner resize-none text-sm"
        />
      </div>

      {/* Audience Selector */}
      <div className="space-y-3">
        <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest flex items-center gap-2">
          <Users size={12} /> Público Objetivo
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {AUDIENCES.map((a) => (
            <button
              key={a.id}
              onClick={() => setForm({ ...form, audience: a.id })}
              className={`p-3 rounded-xl text-left border transition-all ${
                form.audience === a.id
                  ? 'border-accent-500 bg-accent-500/10 ring-1 ring-accent-500/50'
                  : 'border-paradise-700 bg-paradise-900/40 hover:border-paradise-500/30'
              }`}
            >
              <p className={`text-xs font-bold mb-1 ${form.audience === a.id ? 'text-accent-400' : 'text-paradise-100'}`}>{a.label}</p>
              <p className="text-[10px] text-paradise-400 leading-tight">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Style & Amenities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest">Estilo de Tono</label>
          <div className="flex gap-2">
            {['luxury', 'modern', 'cozy'].map((s) => (
              <button
                key={s}
                onClick={() => setForm({ ...form, style: s })}
                className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all ${
                  form.style === s
                    ? 'bg-paradise-100 text-paradise-900'
                    : 'bg-paradise-800/50 text-paradise-400 border border-paradise-700/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold text-accent-400 uppercase tracking-widest">Amenidades Destacadas</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_OPTIONS.slice(0, 8).map((a) => (
              <button
                key={a}
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    amenities: prev.amenities.includes(a) ? prev.amenities.filter(x => x !== a) : [...prev.amenities, a]
                  }))
                }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  form.amenities.includes(a)
                    ? 'bg-accent-500/20 text-accent-400 border border-accent-500/40'
                    : 'bg-paradise-800/40 text-paradise-500 border border-paradise-700/30'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action */}
      <button
        onClick={generateDescription}
        disabled={loading}
        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-md disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Redactando...
          </>
        ) : (
          <>
            <Sparkles size={20} /> Generar Copy de Alto Impacto
          </>
        )}
      </button>

      {/* Result Area */}
      {description && (
        <div className="animate-fade-in relative group min-h-[300px]">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative glass-card rounded-2xl p-8 border-accent-500/30">
            <button onClick={() => { navigator.clipboard.writeText(description); setCopied(true); setTimeout(()=>setCopied(false), 2000); }} className="absolute top-6 right-6 p-2 rounded-xl bg-paradise-800 border border-paradise-700 text-paradise-400 hover:text-accent-400 transition-colors">
              {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-accent-500/10 text-accent-400 rounded-full text-[10px] font-black uppercase tracking-widest">Draft Generado</div>
              <div className="w-1 h-1 rounded-full bg-paradise-600"></div>
              <div className="text-[10px] text-paradise-500 uppercase font-bold tracking-widest">Español Co</div>
            </div>
            <div className="text-paradise-100 text-sm leading-[1.8] whitespace-pre-wrap pr-12 font-medium italic">
              {description}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
