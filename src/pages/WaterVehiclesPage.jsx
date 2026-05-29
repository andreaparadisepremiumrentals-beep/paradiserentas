// --------------------------------------------------------
// WaterVehiclesPage — Boats, pontoons & water experiences
// --------------------------------------------------------
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties, removeProperty } from '../lib/store';
import PropertyCard from '../components/PropertyCard';
import { Search, Anchor } from 'lucide-react';

export default function WaterVehiclesPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchVehicles();
  }, []);

  async function fetchVehicles() {
    setLoading(true);
    try {
      const all = await getProperties();
      const data = all.filter(p => p.category === 'vehicle');
      setVehicles(data);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    const email = prompt('Autorización: Ingrese "andrea", "marlon" o "gustavo" para confirmar la eliminación:');
    if (!email) return;

    if (!confirm('¿Seguro que quieres borrar esta propiedad permanentemente?')) return;

    try {
      await removeProperty(id, email);
      alert('Propiedad eliminada correctamente.');
      fetchVehicles();
    } catch (e) {
      console.error(e);
      alert(`Error al eliminar: ${e.message}`);
    }
  };

  const handleEdit = (id) => {
    navigate(`/publish?edit=${id}`);
  };

  const filtered = vehicles.filter(
    (v) =>
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Anchor size={28} className="text-accent-400" />
          <h1 className="heading-display text-4xl md:text-5xl text-paradise-50">
            Vehículos Acuáticos
          </h1>
        </div>
        <p className="text-paradise-400">Botes, yates y pontones para experiencias náuticas premium</p>
      </div>

      <div className="glass rounded-xl p-3 flex items-center gap-3 mb-8">
        <Search size={18} className="text-paradise-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o ubicación..."
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
          {filtered.map((v) => (
            <PropertyCard 
              key={v.id} 
              property={v} 
              onDelete={handleDelete} 
              onEdit={handleEdit}
            />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-paradise-500 py-16">
              No se encontraron vehículos acuáticos.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
