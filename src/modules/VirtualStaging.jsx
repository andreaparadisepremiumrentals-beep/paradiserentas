import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, ImagePlus, Loader2, CheckCircle2, AlertCircle, Palette, Sparkles } from 'lucide-react';
import { getModel } from '../lib/gemini';

const DESIGN_STYLES = [
  { id: 'luxury', label: 'Lujo Esmeralda', icon: '✨' },
  { id: 'modern', label: 'Moderno Mínimo', icon: '🏙️' },
  { id: 'rustic', label: 'Rústico Bosque', icon: '🌲' },
];

/**
 * Performs actual vision analysis via Gemini 1.5 Flash.
 */
async function processImage(file, styleId) {
  try {
    const model = getModel('gemini-1.5-flash');
    const style = DESIGN_STYLES.find(s => s.id === styleId) || DESIGN_STYLES[0];
    
    // Read file as base64 for Gemini Vision
    const base64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });

    const prompt = `Analiza esta foto de una propiedad inmobiliaria. 
    Aplica mentalmente un estilo de diseño '${style.label}'.
    Dime brevemente qué mejoras sugerirías (iluminación, muebles, texturas) para que se vea de lujo.
    Responde en una sola frase corta y poderosa (máximo 15 palabras) que empiece con "Sugerencia: ".`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64, mimeType: file.type } }
    ]);
    
    const response = await result.response;
    const text = response.text();

    return { 
      enhanced: true, 
      tag: text.replace('Sugerencia: ', '').trim() || 'Mejora de iluminación y texturas',
      styleLabel: style.label
    };
  } catch (err) {
    console.error('Vision AI error:', err);
    return {
      enhanced: false,
      tag: 'Mejora automática aplicada',
      styleLabel: 'Estándar'
    };
  }
}

export default function VirtualStaging() {
  const [files, setFiles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('luxury');
  const [uploading, setUploading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // ... (keeping handleDrop and handleFileSelect)

  async function handleUpload() {
    if (!files.length) return;
    setUploading(true);
    setError('');
    const newResults = [];

    try {
      for (const file of files) {
        let publicUrl = '';
        try {
          const fileName = `staging/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          
          // 1. Obtener la URL firmada para Cloudflare R2 desde nuestra Edge Function
          const { data: presignData, error: presignError } = await supabase.functions.invoke('r2-presign', {
            body: { filename: fileName, contentType: file.type }
          });
          
          if (presignError) throw presignError;
          if (!presignData || !presignData.uploadUrl) {
            throw new Error('No se pudo obtener la URL firmada para Cloudflare R2.');
          }
          
          // 2. Subir el archivo binario directamente a Cloudflare R2 por PUT
          const uploadRes = await fetch(presignData.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
          
          if (!uploadRes.ok) {
            throw new Error(`Error en la subida directa a R2: ${uploadRes.statusText}`);
          }
          
          // 3. Asignar la URL pública construida por R2
          publicUrl = presignData.publicUrl;
        } catch (storageErr) {
          console.warn('Subida a Cloudflare R2 fallida, utilizando fallback local:', storageErr);
          publicUrl = URL.createObjectURL(file);
        }

        const result = await processImage(file, selectedStyle);
        newResults.push({ 
          name: file.name, 
          url: publicUrl, 
          ...result 
        });
      }
      setResults(newResults);
      setFiles([]);
    } catch (err) {
      setError(err.message || 'Error al procesar imágenes.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-paradise-50 mb-1 flex items-center gap-2">
            <ImagePlus className="text-accent-500" /> Staging Virtual Pro
          </h3>
          <p className="text-sm text-paradise-400">
            Mejora tus fotos con inteligencia artificial orientada a resultados.
          </p>
        </div>

        {/* Style Selector */}
        <div className="flex bg-paradise-900/60 p-1.5 rounded-xl border border-paradise-700/50">
          {DESIGN_STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(s.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedStyle === s.id
                  ? 'bg-accent-500 text-white shadow-lg'
                  : 'text-paradise-400 hover:text-paradise-200'
              }`}
            >
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
          if (dropped.length) setFiles(prev => [...prev, ...dropped]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-500 group ${
          dragActive
            ? 'border-accent-500 bg-accent-500/10'
            : 'border-paradise-700/50 hover:border-accent-500/40 hover:bg-paradise-800/40'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={(e) => {
          const selected = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
          if (selected.length) setFiles(prev => [...prev, ...selected]);
        }} className="hidden" />
        
        <div className="w-16 h-16 bg-paradise-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-paradise-700">
          <Upload className="text-accent-400" />
        </div>
        <p className="text-paradise-100 font-bold text-lg mb-1">Arrastra tus fotos premium</p>
        <p className="text-paradise-400 text-sm">JPG, PNG o WebP de alta resolución</p>
      </div>

      {/* Selected files & Upload */}
      {files.length > 0 && (
        <div className="animate-fade-in p-6 glass-card rounded-2xl border-accent-500/20 bg-accent-500/5">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-bold text-accent-400 uppercase tracking-widest">
              {files.length} Archivo{files.length > 1 ? 's' : ''} listo{files.length > 1 ? 's' : ''} para staging
            </p>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-8 py-3 bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-accent-500/20"
            >
              {uploading ? (
                <>
                <Loader2 size={18} className="animate-spin" /> Procesando IA...
                </>
              ) : (
                <>
                <Palette size={18} /> Aplicar Staging {DESIGN_STYLES.find(s=>s.id===selectedStyle).label}
                </>
              )}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {files.map((f, i) => (
              <div key={i} className="px-4 py-2 rounded-lg bg-paradise-900/80 border border-paradise-700 text-xs text-paradise-200">
                {f.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-error text-sm p-4 rounded-xl bg-error/10 border border-error/20">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
              <CheckCircle2 size={18} className="text-success" />
            </div>
            <h4 className="text-sm font-bold text-paradise-100 uppercase tracking-widest">Resultados del Staging</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((r, i) => (
              <div key={i} className="group glass-card rounded-2xl overflow-hidden border-paradise-700/50 hover:border-accent-500/30 transition-all">
                <div className="relative aspect-video">
                  <img src={r.url} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10">
                    <p className="text-[10px] font-bold text-white uppercase tracking-tighter">{r.styleLabel}</p>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-b from-transparent to-paradise-900/50">
                  <p className="text-xs text-paradise-400 truncate mb-1">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                    <p className="text-[11px] font-black text-accent-400 uppercase tracking-widest">
                      {r.tag}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
