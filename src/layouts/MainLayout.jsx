// --------------------------------------------------------
// MainLayout — Paradise Premium Rentals — Logo & Orange Accents
// --------------------------------------------------------
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Building2, Trees, Ship, HeadphonesIcon,
  Sparkles, Menu, X, Map, Info, Globe, Gem
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import ContactWidget from '../components/ContactWidget';
import translations from '../lib/translations';

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'es');
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const t = translations[lang];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Check if at the very top
      setIsAtTop(currentScrollPos < 10);

      // Smart retractable header logic
      if (currentScrollPos < 50) {
        setVisible(true);
      } else {
        setVisible(prevScrollPos > currentScrollPos);
      }
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const handleLangChange = () => {
    const newLang = lang === 'es' ? 'en' : 'es';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const NAV_ITEMS = [
    { to: '/apartments', label: t.nav_apartments, icon: Building2 },
    { to: '/fincas', label: t.nav_fincas, icon: Trees },
    { to: '/medellin-guide', label: t.nav_medellin, icon: Map },
    { to: '/about', label: t.nav_about, icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-paradise-950 text-paradise-50 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <header className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-3 flex items-center justify-between shadow-2xl transition-all duration-500 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'} ${
        isAtTop
          ? 'bg-transparent border-b border-transparent shadow-none backdrop-blur-none' 
          : 'bg-paradise-950/80 backdrop-blur-2xl border-b border-white/5'
      }`}>
        {/* Column 1: Brand Logo (Left, aligned) */}
        <NavLink to="/" className="flex items-center gap-4 group flex-shrink-0">
          {/* Logo with blended background — no white box */}
          <div className="h-[45px] md:h-[60px] flex items-center overflow-hidden">
             <img 
               src="/assets/logoparadise.png?v=3" 
               alt="Paradise Premium Rentals"
               className="h-full object-contain transition-all group-hover:scale-105"
               onError={(e) => { 
                 e.target.onerror = null;
                 e.target.style.display = 'none';
                 e.target.nextSibling.style.display = 'flex';
               }}
             />
             <div className="hidden items-center gap-3" style={{ display: 'none' }}>
                <Gem className="text-orange-400" size={32} />
             </div>
          </div>
          {/* Brand name */}
          <div className="hidden md:flex flex-col leading-tight">
            <span className="font-extrabold text-base tracking-tight text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Paradise Premium
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-orange-400/80">
              Rentals & Sales
            </span>
          </div>
        </NavLink>

        {/* Column 2: Spacious, centered Navigation Links (No wrapping, well-spaced) */}
        <nav className="hidden xl:flex items-center gap-1.5 mx-auto px-4">
           {NAV_ITEMS.map((item) => (
             <NavLink
               key={item.to}
               to={item.to}
               className={({ isActive }) =>
                 `px-4 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300 border border-transparent whitespace-nowrap ${
                   isActive 
                    ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' 
                    : 'text-paradise-200 hover:text-orange-400 hover:bg-white/5'
                 }`
               }
             >
               {item.label}
             </NavLink>
           ))}
        </nav>
        
        {/* Column 3: Actions & Utilities (Right, flex-shrink-0) */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button 
            onClick={handleLangChange}
            className="p-3 rounded-full hover:bg-white/5 text-paradise-300 hover:text-orange-400 transition-all border border-transparent hover:border-white/10"
          >
            <Globe size={20} />
          </button>

          

          <button className="xl:hidden p-3 bg-white/10 rounded-full text-white" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Spacer for fixed header — only on non-home pages */}
      {!isHome && <div className="h-20 md:h-24" />}

      <main className="flex-1">
        <Outlet context={{ lang, t }} />
      </main>

      <Footer lang={lang} t={t} />

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] flex animate-fade-in shadow-3xl">
          <div className="fixed inset-0 bg-paradise-950/98 backdrop-blur-3xl" onClick={() => setMobileOpen(false)} />
          <nav className="relative z-210 w-full max-w-sm ml-auto bg-paradise-950 h-full border-l border-white/10 p-12 flex flex-col justify-center text-center">
            <button onClick={() => setMobileOpen(false)} className="absolute top-12 right-12 p-5 bg-white/5 rounded-full text-paradise-400"><X size={28} /></button>
            <div className="space-y-10">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="block text-3xl font-extrabold text-paradise-300 hover:text-orange-400 transition-all uppercase tracking-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Smart Contact Widget */}
      <ContactWidget lang={lang} />
    </div>
  );
}
