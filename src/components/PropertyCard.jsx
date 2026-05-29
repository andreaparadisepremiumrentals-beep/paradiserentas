import { MapPin, Bed, Bath, Maximize, PawPrint, Trash2, Pencil, Gem } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function PropertyCard({ property, onDelete, onEdit }) {
  const {
    id,
    title,
    price,
    location,
    neighborhood,
    bedrooms,
    bathrooms,
    area_m2,
    pet_friendly,
    images,
    category,
    status,
    isMock
  } = property;

  const coverImage = images?.[0] || '/placeholder-property.jpg';

  const formatPrice = (val) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(val);

  const categoryLabels = {
    apartment: 'Apartamento',
    house: 'Casa',
    finca: 'Finca',
    vehicle: 'Vehículo Acuático',
    water_vehicle: 'Vehículo Acuático',
  };

  return (
    <article className="glass-card h-full rounded-[30px] overflow-hidden group border border-white/5 relative flex flex-col transition-all hover:border-emerald-500/30">
        {/* Actions Container */}
        <div className="absolute z-20 top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                onEdit(id);
              }}
              className="bg-emerald-600/90 backdrop-blur-md text-white p-3 rounded-full hover:bg-emerald-700 transition-all shadow-2xl scale-90 group-hover:scale-100 border border-white/20"
              title="Editar Propiedad"
            >
              <Pencil size={18} />
            </button>
          )}

          {onDelete && (
            <button 
              onClick={(e) => { 
                e.preventDefault(); 
                e.stopPropagation(); 
                if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad permanentemente?')) {
                  onDelete(id); 
                }
              }}
              className="bg-red-600/90 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-700 transition-all shadow-2xl scale-90 group-hover:scale-100 border border-white/20"
              title="Eliminar Propiedad"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <Link to={`/property/${id}`} className="block h-full flex flex-col">
          {/* Image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            {/* Category badge */}
            <span className="absolute top-4 left-4 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-paradise-950/80 text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
              {categoryLabels[category] || category}
            </span>
            {/* Status badge */}
            {status && status !== 'available' && (
              <span className="absolute top-4 right-16 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-error/90 text-white shadow-lg">
                {status === 'rented' ? 'Arrendado' : status === 'sold' ? 'Vendido' : 'Mantenimiento'}
              </span>
            )}
            {/* Price overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-paradise-950 to-transparent p-6 pt-12">
              <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Desde</p>
              <p className="text-2xl font-black text-white">{formatPrice(price)} COP</p>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col p-6 flex-1">
            <h3 className={`text-xl font-bold mb-3 line-clamp-1 transition-colors ${isMock ? 'text-paradise-200 opacity-60' : 'text-white group-hover:text-amber-400'}`}>
              {isMock ? `(MOCK) ${title}` : title}
              {!isMock && <span className="ml-2 inline-flex items-center text-[10px] text-emerald-400 font-black uppercase tracking-widest"><Gem size={12} className="mr-1" /> EXCLUSIVE</span>}
            </h3>
            <div className="flex items-center gap-2 text-paradise-300 text-sm font-medium mb-6">
              <MapPin size={16} className="text-emerald-500" />
              <span>{neighborhood || location}</span>
            </div>

            {/* Details row */}
            <div className="flex items-center gap-6 text-sm text-paradise-400 font-bold border-t border-white/5 pt-6 mt-auto">
              {bedrooms > 0 && (
                <span className="flex items-center gap-2">
                  <Bed size={16} className="text-emerald-500" /> {bedrooms}
                </span>
              )}
              {bathrooms > 0 && (
                <span className="flex items-center gap-2">
                  <Bath size={16} className="text-emerald-500" /> {bathrooms}
                </span>
              )}
              {area_m2 > 0 && (
                <span className="flex items-center gap-2">
                  <Maximize size={16} className="text-emerald-500" /> {area_m2} m²
                </span>
              )}
              {pet_friendly && (
                <span className="flex items-center gap-2 text-emerald-500 ml-auto">
                  <PawPrint size={16} />
                </span>
              )}
            </div>
          </div>
        </Link>
    </article>
  );
}
