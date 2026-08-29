import { useState, useEffect } from 'react';
import { getProperties, removeProperty, isAuthorized } from '../lib/store';
import {
  Search, Trash2, Pencil, ExternalLink,
  CheckCircle2, AlertCircle, Loader2, ListOrdered, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReorderableListings from './ReorderableListings';
import PartnerAuthModal from '../components/PartnerAuthModal';

export default function ListingsManager() {
  const [properties, setLocalProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, mock, real
  const [reorderOpen, setReorderOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getProperties();
    setLocalProperties(data);
    setLoading(false);
  }

  const filtered = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.location?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' ||
                        (filter === 'mock' && p.isMock) ||
                        (filter === 'real' && !p.isMock);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta propiedad permanentemente?')) {
      try {
        await removeProperty(id, 'admin@paradise.com'); // Manager bypass or session email
        await loadData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const openReorder = () => setIsAuthModalOpen(true);

  const onConfirmReorder = (rawEmail) => {
    setIsAuthModalOpen(false);
    if (!isAuthorized(rawEmail)) {
      alert('No autorizado. Solo socios pueden reordenar los anuncios.');
      return;
    }
    setReorderOpen(true);
  };

  const closeReorder = async () => {
    setReorderOpen(false);
    await loadData();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
        <p className="text-paradise-400 font-medium">Cargando inventario...</p>
      </div>
    );
  }

  if (reorderOpen) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Reordenar anuncios</h2>
            <p className="text-sm text-paradise-500">El orden se refleja en el inicio y en cada categoría.</p>
          </div>
          <button
            onClick={closeReorder}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-paradise-300 hover:text-white hover:bg-white/10 transition-all text-xs font-bold"
          >
            <X size={16} /> Terminar
          </button>
        </div>

        <div className="rounded-3xl border border-white/10 bg-paradise-950/50 backdrop-blur-md p-4 md:p-6">
          <ReorderableListings items={properties} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-paradise-900/30 p-4 rounded-3xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-paradise-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-paradise-950/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:border-emerald-500/50 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-paradise-950 p-1 rounded-2xl border border-white/10">
            {['all', 'real', 'mock'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-emerald-500 text-white shadow-lg' : 'text-paradise-500 hover:text-paradise-200'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'real' ? 'Reales' : 'Mocks'}
              </button>
            ))}
          </div>

          <button
            onClick={openReorder}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <ListOrdered size={16} /> Reordenar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-paradise-950/50 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-paradise-400">Propiedad</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-paradise-400">Estado</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-paradise-400">Precio</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-paradise-400 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={p.image || p.images?.[0]} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                    <div>
                      <p className="font-bold text-sm text-white">{p.title}</p>
                      <p className="text-xs text-paradise-500">{p.location}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.isMock ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full border border-amber-500/20">
                      <AlertCircle size={12} /> MOCK
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={12} /> PUBLICADO
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-black text-white">
                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p.price)}
                  </p>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/publish?edit=${p.id}`)}
                      className="p-2.5 rounded-xl bg-white/5 text-paradise-400 hover:text-emerald-400 hover:bg-white/10 transition-all"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20"
                    >
                      <Trash2 size={18} />
                    </button>
                    <a
                      href={`/property/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 text-paradise-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-20 text-center text-paradise-500 text-sm italic">
                  No se encontraron propiedades que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PartnerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConfirm={onConfirmReorder}
        lang="es"
      />
    </div>
  );
}
