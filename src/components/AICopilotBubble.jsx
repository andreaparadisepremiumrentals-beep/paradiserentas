// --------------------------------------------------------
// AICopilotBubble — Paradise Premium AI Assistant
// Fully trained with property knowledge, local expertise,
// and robust error handling with offline fallback.
// --------------------------------------------------------
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import ChatBubble from './ChatBubble';
import { deepseekModel } from '../lib/deepseek';

// ─── KNOWLEDGE BASE ─────────────────────────────────────
import kbData from '../data/knowledgeBase.json';

const { KNOWLEDGE_BASE, FALLBACK_RESPONSES } = kbData;

function getOfflineResponse(userMessage) {
  const msg = userMessage.toLowerCase();
  if (msg.match(/hola|hi|hey|buenos|buenas|saludos/)) {
    return FALLBACK_RESPONSES.greeting[Math.floor(Math.random() * FALLBACK_RESPONSES.greeting.length)];
  }
  if (msg.match(/apartament|casa|house|apt|loft|penthouse|residencia/)) return FALLBACK_RESPONSES.apartments;
  if (msg.match(/finca|retiro|campo|country|hacienda|weekend/)) return FALLBACK_RESPONSES.fincas;
  if (msg.match(/yate|lancha|boat|yacht|water|agua|acuatic/)) return FALLBACK_RESPONSES.vehicles;
  if (msg.match(/contact|whatsapp|reserve|reserv|book|agendar|hablar|llamar/)) return FALLBACK_RESPONSES.contact;
  if (msg.match(/medell[ií]n|ciudad|city|turism|visit|poblado|laureles|comuna|guatap/)) return FALLBACK_RESPONSES.medellin;
  return FALLBACK_RESPONSES.default;
}

// ─── SYSTEM PROMPT ───────────────────────────────────────
const SYSTEM_PROMPT = `Eres Paradise Copilot, el Asistente Virtual Oficial de Paradise Premium Rentals en Medellín, Colombia.

PERSONALIDAD:
- Profesional, amigable, cálido y conocedor de la ciudad.
- Hablas con confianza sobre Medellín, sus barrios, restaurantes y experiencias.
- Eres bilingüe: respondes en el mismo idioma que el usuario.

MISIÓN:
- Ayudar a los usuarios a encontrar propiedades ideales (Apartamentos, Fincas, Yates).
- Recomendar zonas, restaurantes y actividades en Medellín y alrededores.
- Facilitar el contacto con los socios fundadores: Andrea y Gustavo.
- Dar información sobre precios de referencia y servicios incluidos.

REGLAS:
1. Responde SIEMPRE en el idioma del usuario. Si habla español, responde en español. Si habla inglés, en inglés.
2. Sé conciso. Máximo 3 párrafos cortos.
3. No inventes precios exactos. Usa rangos del knowledge base o refiere al catálogo.
4. Para reservar, siempre indica que deben contactar a Andrea o Gustavo.
5. Si te preguntan algo que no sabes, redirige amablemente al soporte o al catálogo.
6. Usa emojis ocasionalmente para ser más amigable (🏠 🌴 🚤).

${KNOWLEDGE_BASE}`;

export default function AICopilotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: '¡Hola! 👋 Soy el asistente de Paradise Premium. Puedo ayudarte a encontrar el apartamento, finca o experiencia perfecta en Medellín. ¿En qué te puedo ayudar?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input.trim() };
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setInput('');
    setLoading(true);

    try {
      // If Gemini is not configured, use offline fallback
      if (!deepseekModel) {
        const fallback = getOfflineResponse(userMsg.content);
        setMessages(prev => [...prev, { role: 'ai', content: fallback }]);
        return;
      }

      // Build conversation context from last 10 messages
      const historyContext = currentHistory.slice(-10).map(m =>
        `${m.role === 'user' ? 'Usuario' : 'Paradise Copilot'}: ${m.content}`
      ).join('\n');

      const prompt = `${SYSTEM_PROMPT}

CONVERSACIÓN:
${historyContext}

Instrucción: Genera la respuesta del Paradise Copilot. Sé útil, conciso y profesional.`;

      const result = await deepseekModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        setMessages(prev => [...prev, { role: 'ai', content: text }]);
        setRetryCount(0);
      } else {
        throw new Error('Empty response');
      }
    } catch (error) {
      console.error('Copilot Error:', error);

      // Use intelligent offline fallback instead of generic error
      const fallback = getOfflineResponse(userMsg.content);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: fallback
      }]);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'ai',
      content: '¡Chat reiniciado! 🔄 ¿En qué te puedo ayudar? Puedo recomendarte propiedades, zonas de Medellín, restaurantes, o ayudarte a contactar a nuestro equipo.'
    }]);
    setRetryCount(0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[520px] bg-paradise-950/85 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-fade-in border border-accent-500/30">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-deep to-paradise-900 p-4 flex items-center justify-between border-b border-accent-500/20">
            <div className="flex items-center gap-2">
               <div className="bg-accent-500/20 p-1.5 rounded-lg text-accent-400">
                 <Sparkles size={16} />
               </div>
                <div>
                  <p className="text-xs font-bold text-paradise-50 uppercase tracking-widest">Paradise Copilot</p>
                  <p className="text-[9px] text-emerald-400 font-bold uppercase">
                    {deepseekModel ? '● Online' : '● Offline Mode'}
                  </p>
                </div>
             </div>
             <div className="flex items-center gap-2">
               <button
                 onClick={clearChat}
                 className="text-paradise-400 hover:text-paradise-100 transition-colors p-1.5 rounded-lg hover:bg-white/5"
                 title="Reiniciar Chat"
               >
                 <RotateCcw size={16} />
               </button>
               <button onClick={() => setIsOpen(false)} className="text-paradise-400 hover:text-paradise-100 transition-colors p-1.5 rounded-lg hover:bg-white/5">
                 <X size={20} />
               </button>
             </div>
           </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} />
            ))}
            {loading && (
               <div className="flex gap-2 text-accent-400 animate-pulse text-xs font-bold px-4">
                 <Loader2 size={14} className="animate-spin" /> Copiloto pensando...
               </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {['🏠 Apartamentos', '🌴 Fincas', '🗺️ Guía Medellín', '📞 Contacto'].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q.replace(/^[^\s]+\s/, '')); }}
                  className="text-[10px] font-bold bg-white/5 border border-white/10 text-paradise-300 px-3 py-1.5 rounded-full hover:bg-accent-500/10 hover:text-accent-400 hover:border-accent-500/20 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-paradise-950/70">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Pregúntame lo que necesites..."
                className="w-full bg-paradise-900/60 border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm focus:border-accent-500 focus:bg-paradise-900/80 outline-none text-paradise-100 placeholder-paradise-500 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-2 p-1.5 bg-accent-500 rounded-xl text-white hover:bg-accent-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 group ${
          isOpen ? 'bg-paradise-800 rotate-90 scale-90' : 'bg-gradient-to-br from-accent-500 to-accent-600 hover:scale-110 hover:shadow-accent-500/40'
        }`}
      >
        {isOpen ? (
          <X size={28} className="text-accent-400" />
        ) : (
          <div className="relative">
            <MessageSquare size={28} className="text-white group-hover:animate-bounce" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-glow rounded-full border-2 border-accent-600 animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
}
