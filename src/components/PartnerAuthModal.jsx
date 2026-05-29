import { useState } from 'react';
import { Shield, Lock, X } from 'lucide-react';

export default function PartnerAuthModal({ isOpen, onClose, onConfirm, lang }) {
  const [key, setKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (key.trim()) {
      onConfirm(key.trim());
      setKey('');
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 animate-fade-in shadow-3xl">
      <div className="absolute inset-0 bg-paradise-950/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative w-full max-w-md glass-card p-10 rounded-[40px] border border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden">
        {/* Background glow Decor */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-paradise-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8 border border-emerald-500/20 group hover:border-emerald-500 transition-all">
            <Lock size={36} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>

          <h2 className="heading-display text-3xl mb-4">
            {lang === 'es' ? 'Acceso de' : 'Partner'} <span className="text-emerald-glow">{lang === 'es' ? 'Socio' : 'Access'}</span>
          </h2>
          
          <p className="text-paradise-400 font-medium mb-10 text-sm leading-relaxed">
            {lang === 'es' 
              ? 'Por favor ingrese su PIN o correo electrónico de socio para proceder con la publicación.' 
              : 'Please enter your partner PIN or email to proceed with the listing.'}
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative group">
              <Shield size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
              <input 
                type="password"
                autoFocus
                placeholder={lang === 'es' ? 'PIN de Acceso' : 'Access PIN'}
                className="input-field pl-16 py-6 text-center text-xl tracking-[0.5em] focus:border-emerald-400 transition-all"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-paradise-950 py-6 rounded-3xl text-[10px] uppercase font-black tracking-[0.3em] shadow-md transition-all active:scale-[0.98]"
            >
              {lang === 'es' ? 'Confirmar Identidad' : 'Confirm Identity'}
            </button>
          </form>

          <p className="mt-8 text-[10px] text-paradise-600 font-bold uppercase tracking-widest">
            {lang === 'es' ? 'Seguridad Paradise Premium' : 'Paradise Premium Security'}
          </p>
        </div>
      </div>
    </div>
  );
}
