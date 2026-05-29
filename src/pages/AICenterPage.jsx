// --------------------------------------------------------
// AICenterPage — Limpieza de Copiloto (Ahora es Global)
// --------------------------------------------------------
import { useState, useEffect } from 'react';
import {
  ImagePlus,
  FileText,
  TrendingUp,
  Sparkles,
  Lock,
  Layers,
  BarChart3,
  ShieldCheck,
  Scale
} from 'lucide-react';

import VirtualStaging from '../modules/VirtualStaging';
import DescriptionGenerator from '../modules/DescriptionGenerator';
import ValuationAI from '../modules/ValuationAI';
import FinancialCalculator from '../modules/FinancialCalculator';
import InventoryManager from '../modules/InventoryManager';
import LegalManager from '../modules/LegalManager';
import { isAuthorized } from '../lib/store';
import PartnerAuthModal from '../components/PartnerAuthModal';
import { useOutletContext } from 'react-router-dom';

export default function AICenterPage() {
  const { lang, t } = useOutletContext();
  const [activeTab, setActiveTab] = useState('staging');
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('paradise_admin_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => {
    return localStorage.getItem('paradise_admin_auth') !== 'true';
  });

  const onConfirmAuth = (rawEmail) => {
    if (isAuthorized(rawEmail)) {
      setIsAdmin(true);
      setIsAuthModalOpen(false);
      localStorage.setItem('paradise_admin_auth', 'true');
    } else {
      alert(lang === 'es' 
        ? 'Acceso restringido. Solo socios autorizados.' 
        : 'Restricted access. Authorized partners only.');
      window.location.href = '/';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('paradise_admin_auth');
    setIsAdmin(false);
    setIsAuthModalOpen(true);
  };

  const TABS = [
    { id: 'staging', label: 'Staging Virtual', icon: ImagePlus, component: VirtualStaging, adminOnly: false },
    { id: 'description', label: 'Generador IA', icon: FileText, component: DescriptionGenerator, adminOnly: true },
    { id: 'legal', label: 'Documentos Legales', icon: Scale, component: LegalManager, adminOnly: true },
    { id: 'valuation', label: 'Tasación Renta', icon: TrendingUp, component: ValuationAI, adminOnly: false },
    { id: 'calculator', label: 'Calculadora Pro', icon: BarChart3, component: FinancialCalculator, adminOnly: false },
    { id: 'manager', label: 'Gestión Inventario', icon: Layers, component: InventoryManager, adminOnly: true },
  ];

  const visibleTabs = TABS.filter(tab => !tab.adminOnly || (tab.adminOnly && isAdmin));
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.component || VirtualStaging;

  return (
    <div className="p-6 md:p-10 animate-fade-in w-full flex flex-col items-center">
      {/* Header Container - Reverted to original wide layout max-w-8xl */}
      <div className="mb-10 w-full max-w-8xl px-4 md:px-0">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-paradise-900 to-accent-600 flex items-center justify-center border border-accent-500/30">
            <Sparkles size={24} className="text-accent-400" />
          </div>
          <div>
            <h1 className="heading-display text-3xl md:text-4xl text-paradise-50">
              Centro IA
            </h1>
            <p className="text-paradise-400 text-sm font-medium tracking-wide">
              Herramientas inteligentes para propietarios y agentes.
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-paradise-500 hover:text-red-400 hover:bg-red-400/5 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <Lock size={12} /> Salir
            </button>
          )}
        </div>
      </div>

      {/* Menu Container - Significantly wider (max-w-8xl) to allow full text width without wrapping */}
      <div className="mb-10 w-full max-w-8xl px-4 md:px-0">
        <div className="flex flex-row overflow-x-auto justify-start xl:justify-center gap-3 w-full pb-3 scroll-smooth no-scrollbar">
          {visibleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-[10px] lg:text-xs font-bold uppercase tracking-widest transition-all duration-300 border shrink-0 whitespace-nowrap text-center cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent-500/20 text-accent-400 border-accent-500/40 shadow-xl scale-[1.02] z-10'
                  : 'text-paradise-500 bg-paradise-900/40 border-paradise-800 hover:text-paradise-200 hover:border-paradise-700/60'
              }`}
            >
              <tab.icon size={15} className="shrink-0" />
              <span>{tab.label}</span>
              {tab.adminOnly && <Lock size={11} className="ml-1 opacity-60 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Active Component Container - Constrained to max-w-7xl to leave beautiful spacing on the sides */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-0">
        <ActiveComponent />
      </div>

      <PartnerAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => window.location.href = '/'} 
        onConfirm={onConfirmAuth}
        lang={lang}
      />
    </div>
  );
}
