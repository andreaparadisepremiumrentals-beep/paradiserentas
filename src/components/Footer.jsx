import { NavLink } from 'react-router-dom';
import { Mail, Instagram, Facebook, Youtube, MapPin, Gem } from 'lucide-react';

export default function Footer({ lang, t }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-paradise-950/40 backdrop-blur-3xl pt-20 pb-12 px-6 md:px-12 overflow-hidden">
      {/* Decorative Gradient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-y-12 md:gap-x-6 md:-translate-x-3">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col items-center text-center gap-6">
          <NavLink to="/" className="flex items-center group flex-shrink-0">
            <div className="h-[58px] md:h-[72px] flex items-center overflow-hidden">
              <img 
                src="/assets/logoparadise.png?v=3" 
                alt="Paradise Premium Rentals" 
                className="h-full object-contain transition-all group-hover:scale-105"
              />
            </div>
          </NavLink>
          <p className="text-sm text-paradise-400 font-light leading-relaxed max-w-[220px] mx-auto">
            {lang === 'es' 
              ? 'Elevando el estándar de las rentas vacacionales de lujo en Medellín y Antioquia.' 
              : 'Elevating the standard of luxury vacation rentals in Medellín and Antioquia.'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-paradise-300 hover:text-orange-400 hover:border-orange-500/30 transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-paradise-300 hover:text-orange-400 hover:border-orange-500/30 transition-all">
              <Facebook size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-paradise-300 hover:text-orange-400 hover:border-orange-500/30 transition-all">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-6 col-span-1 md:col-span-2 md:col-start-6 lg:col-span-2 lg:col-start-5">
          <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">
            {lang === 'es' ? 'Navegación' : 'Navigation'}
          </h4>
          <nav className="flex flex-col gap-4">
            <NavLink to="/apartments" className="text-sm text-paradise-300 hover:text-white transition-colors">{t.nav_apartments}</NavLink>
            <NavLink to="/fincas" className="text-sm text-paradise-300 hover:text-white transition-colors">{t.nav_fincas}</NavLink>
            <NavLink to="/medellin-guide" className="text-sm text-paradise-300 hover:text-white transition-colors">{t.nav_medellin}</NavLink>
            <NavLink to="/ai-center" className="text-sm text-paradise-300 hover:text-white transition-colors">{t.nav_ai}</NavLink>
          </nav>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col gap-6 col-span-1 md:col-span-3 md:col-start-8 lg:col-span-2 lg:col-start-8">
          <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">
            {lang === 'es' ? 'Legal' : 'Legal'}
          </h4>
          <nav className="flex flex-col gap-4">
            <NavLink to="/privacy" className="text-sm text-paradise-300 hover:text-white transition-colors">
              {lang === 'es' ? 'Privacidad' : 'Privacy Policy'}
            </NavLink>
            <NavLink to="/terms" className="text-sm text-paradise-300 hover:text-white transition-colors">
              {lang === 'es' ? 'Términos y Condiciones' : 'Terms & Conditions'}
            </NavLink>
            <NavLink to="/support" className="text-sm text-paradise-300 hover:text-white transition-colors">
              {lang === 'es' ? 'Soporte' : 'Support'}
            </NavLink>
          </nav>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-6 col-span-1 md:col-span-2 md:col-start-11 lg:col-span-2 lg:col-start-11 md:-translate-x-6">
          <h4 className="text-xs font-black text-orange-500 uppercase tracking-widest">
            {lang === 'es' ? 'Contacto' : 'Contact'}
          </h4>
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <MapPin size={18} className="text-orange-500 shrink-0 mt-1" />
              <div className="text-sm text-paradise-300 leading-relaxed font-light">
                El Poblado, Medellín<br />
                Antioquia, Colombia
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail size={18} className="text-orange-500" />
              <a href="mailto:info@paradiserentas.com" className="text-sm text-paradise-300 hover:text-white">info@paradiserentas.com</a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 md:-translate-x-3">
        <p className="text-[10px] font-bold text-paradise-500 uppercase tracking-[0.25em]">
          &copy; {currentYear} Paradise Premium Rentals. Todos los derechos reservados.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-bold text-paradise-600 uppercase tracking-widest italic">Luxury Defined</span>
        </div>
      </div>
    </footer>
  );
}
