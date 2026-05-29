// --------------------------------------------------------
// FincasPage — Country estates & recreational properties
// --------------------------------------------------------
import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getProperties, removeProperty } from '../lib/store';
import PropertyCard from '../components/PropertyCard';
import { Search, Mountain } from 'lucide-react';
import PartnerAuthModal from '../components/PartnerAuthModal';

export default function FincasPage() {
  const navigate = useNavigate();
  const { lang = 'es' } = useOutletContext() || {};
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [authModal, setAuthModal] = useState({ isOpen: false, propertyId: null });

  useEffect(() => {
    fetchFincas();
  }, []);

  async function fetchFincas() {
    setLoading(true);
    try {
      const all = await getProperties();
      const data = all.filter(p => p.category === 'finca');
      setProperties(data);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id) => {
    setAuthModal({ isOpen: true, propertyId: id });
  };

  const handleConfirmDelete = async (email) => {
    setAuthModal({ isOpen: false, propertyId: null });
    try {
      await removeProperty(authModal.propertyId, email);
      alert(lang === 'es' ? 'Propiedad eliminada correctamente.' : 'Property successfully deleted.');
      fetchFincas();
    } catch (e) {
      console.error(e);
      alert(`Error: ${e.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/publish?edit=${id}`);
  };

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Mountain size={28} className="text-accent-400" />
          <h1 className="heading-display text-4xl md:text-5xl text-paradise-50">Fincas Exclusivas</h1>
        </div>
        <p className="text-paradise-400">Retiros campestres y propiedades de recreo</p>
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-3 mb-8">
        <Search size={18} className="text-paradise-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar fincas por nombre o ubicación..."
          className="flex-1 bg-transparent text-paradise-100 text-sm placeholder-paradise-500 outline-none py-1"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-80 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PropertyCard 
              key={p.id} 
              property={p} 
              onDelete={handleDeleteClick} 
              onEdit={handleEdit} 
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-paradise-500 py-16">
              No se encontraron fincas.
            </p>
          )}
        </div>
      )}

      <PartnerAuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ isOpen: false, propertyId: null })} 
        onConfirm={handleConfirmDelete} 
        lang={lang} 
      />
    </div>
  );
}
