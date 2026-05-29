// --------------------------------------------------------
// RealtyCopilot — Módulo D: Conversational property search
// --------------------------------------------------------
import { useState, useRef, useEffect } from 'react';
import { getModel } from '../lib/deepseek';
import { getProperties } from '../lib/store';
import ChatBubble from '../components/ChatBubble';
import PropertyCard from '../components/PropertyCard';
import { Send, Loader2, Bot } from 'lucide-react';

const INITIAL_MESSAGE = '¡Hola! Soy tu copiloto inmobiliario. Puedo ayudarte a encontrar la propiedad ideal. Describe lo que buscas en lenguaje natural, por ejemplo:\n\n"Busco un apartamento en El Poblado de menos de 2.000 millones que acepte mascotas"';

export default function RealtyCopilot() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: INITIAL_MESSAGE },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundProperties, setFoundProperties] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, foundProperties]);

  async function handleSend() {
    const query = input.trim();
    if (!query || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setLoading(true);
    setFoundProperties([]);

    try {
      // Step 1: Use Gemini to extract search filters from natural language
      const model = getModel();
      const extractionPrompt = `Eres un asistente inmobiliario experto en Medellín. El usuario quiere buscar una propiedad. Extrae los filtros de búsqueda del siguiente texto y devuelve SOLO un JSON válido con estos campos:
{
  "category": "apartment" | "finca" | "vehicle" | null,
  "max_price": number | null,
  "min_price": number | null,
  "neighborhood": string | null,
  "city": string | null,
  "bedrooms": number | null,
  "pet_friendly": boolean | null,
  "min_area": number | null
}

Reglas:
- Si el usuario menciona botes, yates o navegación, usa "vehicle".
- Si menciona fincas o casas de campo, usa "finca".
- Si menciona apartamentos o lofts, usa "apartment".
- Traduce barrios como "El Poblado", "Laureles", etc.

Texto del usuario: "${query}"

Responde SOLO con el JSON.`;

      const extractionResult = await model.generateContent(extractionPrompt);
      const resultText = await extractionResult.response.text();
      let filtersText = resultText.trim();

      // Clean potential markdown code fences
      filtersText = filtersText.replace(/```json?\s*/g, '').replace(/```/g, '').trim();

      let filters;
      try {
        filters = JSON.parse(filtersText);
      } catch (parseErr) {
        console.error('Extraction parse error:', parseErr, 'Raw text:', filtersText);
        filters = {};
      }

      // Step 2: Query Firebase
      const allProperties = await getProperties();
      
      const filtered = allProperties.filter(p => {
        if (filters.category && p.category !== filters.category) return false;
        if (filters.max_price && p.price > filters.max_price) return false;
        if (filters.min_price && p.price < filters.min_price) return false;
        if (filters.neighborhood && !p.neighborhood?.toLowerCase().includes(filters.neighborhood.toLowerCase())) return false;
        if (filters.city && !p.location?.toLowerCase().includes(filters.city.toLowerCase())) return false;
        if (filters.bedrooms && p.bedrooms < filters.bedrooms) return false;
        if (filters.pet_friendly === true && !p.pet_friendly) return false;
        if (filters.min_area && p.area_m2 < filters.min_area) return false;
        return true;
      }).slice(0, 6);

      const data = filtered;

      // Step 3: Generate a conversational response
      const filterSummary = Object.entries(filters)
        .filter(([, v]) => v !== null)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');

      const resultCount = data?.length || 0;

      const responsePrompt = `Eres un asistente inmobiliario amable y profesional. El usuario buscó: "${query}".
Filtros extraídos: ${filterSummary || 'ninguno específico'}.
Se encontraron ${resultCount} propiedades que coinciden.

Genera una respuesta breve y amable en español. Si hay resultados, menciona que se muestran abajo. Si no hay resultados, sugiere ampliar la búsqueda. Sé conciso (máximo 2-3 oraciones).`;

      const responseResult = await model.generateContent(responsePrompt);
      const aiResponse = responseResult.response.text();

      setMessages((prev) => [...prev, { role: 'ai', text: aiResponse }]);

      if (data?.length) {
        setFoundProperties(data);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: `Lo siento, hubo un error al procesar tu solicitud: ${err.message}. Verifica que tus claves API estén configuradas correctamente.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-paradise-50 mb-1 flex items-center gap-2">
          <Bot size={20} className="text-accent-400" />
          Copiloto Inmobiliario
        </h3>
        <p className="text-sm text-paradise-400">
          Busca propiedades usando lenguaje natural
        </p>
      </div>

      {/* Chat area */}
      <div className="glass-card rounded-xl overflow-hidden flex flex-col" style={{ height: '500px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} message={msg.text} isAI={msg.role === 'ai'} />
          ))}

          {/* Property results */}
          {foundProperties.length > 0 && (
            <div className="pt-2 animate-fade-in">
              <p className="text-xs text-accent-400 font-semibold uppercase tracking-widest mb-3">
                Propiedades Encontradas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {foundProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 text-paradise-400 text-sm">
              <Loader2 size={16} className="animate-spin" />
              <span>Buscando propiedades...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-paradise-700/50 p-4 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ej: Busco una finca en Rionegro con piscina..."
            className="flex-1 bg-transparent text-paradise-100 text-sm placeholder-paradise-500 outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-lg bg-accent-500/20 text-accent-400 hover:bg-accent-500/30 transition-colors disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
