import { useState, useEffect } from 'react';
import { Camera, Video, Plus, Trash2, Home, Building2, Ship, MapPin, DollarSign, ListChecks, Pencil, Star, ImagePlus } from 'lucide-react';
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom';
import { addProperty, getProperty, updateProperty, isAuthorized } from '../lib/store';
import { supabase } from '../lib/supabase';
import PartnerAuthModal from '../components/PartnerAuthModal';


export default function PublishPage() {
  const { lang, t } = useOutletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    neighborhood: '',
    description: '',
    category: 'apartment',
    videoUrl: '',
    bedrooms: '1',
    bathrooms: '1',
    area_m2: '',
    capacity: '2',
    amenities: [],
    status: 'available'
  });

  const [otherAmenity, setOtherAmenity] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);


  // Load property if editing
  useEffect(() => {
    if (editId) {
      const loadProperty = async () => {
        setLoading(true);
        try {
          const prop = await getProperty(editId);
          if (prop) {
            setFormData({
              title: prop.title || '',
              price: String(prop.price || ''),
              location: prop.location || '',
              neighborhood: prop.neighborhood || '',
              description: prop.description || '',
              category: prop.category || 'apartment',
              videoUrl: prop.videoUrl || '',
              bedrooms: String(prop.bedrooms || '0'),
              bathrooms: String(prop.bathrooms || '0'),
              area_m2: String(prop.area_m2 || ''),
              capacity: String(prop.capacity || '1'),
              amenities: prop.amenities || [],
              status: prop.status || 'available'
            });
            setImages(prop.images || []);
          }
        } catch (err) {
          console.error("Error loading property for edit:", err);
        } finally {
          setLoading(false);
        }
      };
      loadProperty();
    }
  }, [editId]);

  const AVAILABLE_AMENITIES = [
    'Piscina', 'Jacuzzi Privado', 'Gimnasio', 'Seguridad 24/7',
    'Smart Home', 'Terraza 360°', 'Balcón', 'Cocina Integral',
    'Fibra Óptica', 'Lavandería', 'Zona BBQ', 'Aire Acondicionado',
    'Parqueadero Privado', 'Ascensor', 'Canchas Deportivas', 'Sauna / Turco',
    'Pet Friendly', 'Sala de Cine', 'Coworking', 'Vista a la Ciudad'
  ];

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1000; 

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
      };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setLoading(true);
    try {
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const compressedBase64 = await compressImage(file);
        const res = await fetch(compressedBase64);
        const blob = await res.blob();
        
        const fileName = `properties/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { data: presignData, error: presignError } = await supabase.functions.invoke('r2-presign', {
          body: { filename: fileName, contentType: 'image/jpeg' }
        });
        
        if (presignError) throw presignError;
        if (!presignData || !presignData.uploadUrl) {
          throw new Error('Failed to get presigned URL');
        }
        
        const uploadRes = await fetch(presignData.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': 'image/jpeg' },
          body: blob
        });
        
        if (!uploadRes.ok) throw new Error('R2 upload failed');
        uploadedUrls.push(presignData.publicUrl);
      }
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Error al subir imágenes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const setAsMain = (index) => {
    if (index === 0) return;
    setImages(prev => {
      const newImages = [...prev];
      const selected = newImages.splice(index, 1)[0];
      return [selected, ...newImages];
    });
  };

  const CATEGORIES = [
    { id: 'apartment', label: t.nav_apartments, icon: Building2 },
    { id: 'finca', label: t.nav_fincas, icon: Home },
    { id: 'vehicle', label: t.nav_vehicles, icon: Ship },
  ];

  const AUTHORIZED_EMAILS = ['marlon', 'andrea', 'gustavo'];

  const manageQuota = () => {
    try {
      const all = JSON.parse(localStorage.getItem('paradise_properties_v5') || '[]');
      if (all.length > 60) {
        localStorage.setItem('paradise_properties_v5', JSON.stringify(all.slice(0, 60)));
      }
    } catch (e) {
      localStorage.clear();
    }
  };

  const toggleAmenity = (am) => {
    setFormData(prev => {
      const isIncluded = prev.amenities.includes(am);
      return {
        ...prev,
        amenities: isIncluded
          ? prev.amenities.filter(a => a !== am)
          : [...prev.amenities, am]
      };
    });
  };

  const handlePublish = () => {
    setIsAuthModalOpen(true);
  };

  const onConfirmAuth = async (rawEmail) => {
    setIsAuthModalOpen(false);
    
    if (!isAuthorized(rawEmail)) {
      alert(lang === 'es' 
        ? `No autorizado. (Identidad no reconocida)` 
        : `Unauthorized. (Identity not recognized)`);
      return;
    }

    setLoading(true);
    try {
      const priceClean = String(formData.price).replace(/\D/g, '');
      const propData = {
        title: formData.title || 'Propiedad sin título',
        price: parseInt(priceClean || 0),
        location: formData.location || 'Medellín',
        neighborhood: formData.neighborhood || formData.location || 'Medellín',
        description: formData.description || '',
        category: formData.category,
        videoUrl: formData.videoUrl,
        bedrooms: parseInt(formData.bedrooms || 0),
        bathrooms: parseInt(formData.bathrooms || 0),
        area_m2: parseInt(formData.area_m2 || 0),
        capacity: parseInt(formData.capacity || 0),
        amenities: formData.amenities,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
        status: formData.status || 'available'
      };

      if (editId) {
        // Fetch current property to ensure we don't lose extra fields during merge
        const currentProp = await getProperty(editId);
        const mergedData = { ...currentProp, ...propData };
        await updateProperty(editId, mergedData);
        alert(lang === 'es' ? '¡Propiedad actualizada con éxito!' : 'Property updated successfully!');
        navigate(`/property/${editId}`);
      } else {
        manageQuota();
        const created = await addProperty(propData, rawEmail);
        alert(lang === 'es' ? '¡Propiedad publicada con éxito!' : 'Property published successfully!');
        navigate(`/property/${created.id}`);
      }
    } catch (error) {
      console.error('Publish Error:', error);
      alert(lang === 'es' ? `Error: ${error.message || 'Error desconocido'}` : `Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 animate-fade-in max-w-5xl mx-auto pb-40">
      <div className="mb-10 text-center">
        <h1 className="heading-display text-4xl text-paradise-50 mb-3">
          {editId 
            ? (lang === 'es' ? 'Editar' : 'Edit') 
            : (lang === 'es' ? 'Publicar una Nueva' : 'Publish a New')
          } <span className="text-emerald-glow">{lang === 'es' ? 'Propiedad' : 'Property'}</span>
        </h1>
        <p className="text-paradise-400 font-medium">
          {editId ? (lang === 'es' ? 'Actualiza los detalles de tu anuncio.' : 'Update your listing details.') : (lang === 'es' ? 'Acceso exclusivo para socios.' : 'Exclusive access for partners.')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          
          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
             <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               {editId ? <Pencil size={16} /> : <Plus size={16} />} 1. {lang === 'es' ? 'Selecciona Categoría' : 'Select Category'}
             </h3>
             <div className="grid grid-cols-3 gap-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({...formData, category: cat.id})}
                    className={`flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all ${
                      formData.category === cat.id 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500/50' 
                      : 'bg-paradise-900/50 border-paradise-800 text-paradise-500 hover:border-paradise-700'
                    }`}
                  >
                    <cat.icon size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.label}</span>
                  </button>
                ))}
             </div>
          </section>

          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                <Camera size={16} /> 2. {lang === 'es' ? 'Galería de Imágenes' : 'Image Gallery'}
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border border-paradise-800 transition-all hover:border-emerald-500/50">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {index !== 0 && (
                      <button 
                        onClick={() => setAsMain(index)} 
                        className="p-3 bg-emerald-500 rounded-xl text-paradise-950 hover:bg-emerald-400 transition-colors shadow-lg"
                        title={lang === 'es' ? 'Poner como principal' : 'Set as main'}
                      >
                        <Star size={18} fill="currentColor" />
                      </button>
                    )}
                    <button 
                      onClick={() => removeImage(index)} 
                      className="p-3 bg-red-500/80 rounded-xl text-white hover:bg-red-600 transition-colors shadow-lg"
                      title={lang === 'es' ? 'Eliminar' : 'Remove'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Main Badge */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 text-paradise-950 text-[8px] font-black uppercase tracking-tighter rounded-lg shadow-lg flex items-center gap-1">
                      <Star size={10} fill="currentColor" />
                      {lang === 'es' ? 'PRINCIPAL' : 'MAIN'}
                    </div>
                  )}
                </div>
              ))}
              <label className="aspect-square rounded-2xl border-2 border-dashed border-paradise-800 hover:border-emerald-500/50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-paradise-900/30 group">
                <Plus size={24} className="text-paradise-600 group-hover:text-emerald-500" />
                <span className="text-[10px] font-bold text-paradise-600 group-hover:text-emerald-500 uppercase">Añadir Foto</span>
                <input type="file" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <MapPin size={16} /> 3. {lang === 'es' ? 'Información General' : 'General Information'}
            </h3>
            <div className="space-y-6">
              <input type="text" placeholder={lang === 'es' ? "Título del anuncio (ej. Penthouse en El Poblado)" : "Listing Title"} className="input-field" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div className="grid grid-cols-3 gap-4">
                <input type="text" placeholder={lang === 'es' ? "Precio (COP)" : "Price (COP)"} className="input-field col-span-1" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input type="text" placeholder={lang === 'es' ? "Ciudad" : "City"} className="input-field col-span-1" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                <input type="text" placeholder={lang === 'es' ? "Barrio / Sector" : "Neighborhood"} className="input-field col-span-1" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div>
                  <label className="block text-xs text-paradise-400 uppercase tracking-widest mb-2 font-bold">{lang === 'es' ? 'Habitaciones' : 'Beds'}</label>
                  <select className="input-field" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})}>
                     {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={n} className="bg-paradise-950">{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-paradise-400 uppercase tracking-widest mb-2 font-bold">{lang === 'es' ? 'Baños' : 'Baths'}</label>
                  <select className="input-field" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})}>
                     {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => <option key={n} value={n} className="bg-paradise-950">{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-paradise-400 uppercase tracking-widest mb-2 font-bold">{lang === 'es' ? 'Capacidad' : 'Capacity'}</label>
                  <select className="input-field" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})}>
                     {Array.from({length: 30}, (_, i) => i + 1).map(n => <option key={n} value={n} className="bg-paradise-950">{n} Pax</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-paradise-400 uppercase tracking-widest mb-2 font-bold">{lang === 'es' ? 'Área (m²)' : 'Area'}</label>
                  <input type="number" placeholder="Ej: 120" className="input-field" value={formData.area_m2} onChange={e => setFormData({...formData, area_m2: e.target.value})} />
                </div>
              </div>

              <textarea placeholder={lang === 'es' ? "Descripción detallada..." : "Detailed description..."} className="input-field min-h-[150px] mt-4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <ListChecks size={16} /> 4. {lang === 'es' ? 'Amenidades Adicionales' : 'Amenities'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               {AVAILABLE_AMENITIES.map(am => (
                 <label key={am} className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <input type="checkbox" checked={formData.amenities.includes(am)} onChange={() => toggleAmenity(am)} className="accent-emerald-500 w-4 h-4" />
                    <span className="text-paradise-200 text-sm font-medium">{am}</span>
                 </label>
               ))}
               {formData.amenities.filter(am => !AVAILABLE_AMENITIES.includes(am)).map(am => (
                 <label key={am} className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 cursor-pointer transition-colors">
                    <input type="checkbox" checked={true} onChange={() => toggleAmenity(am)} className="accent-emerald-500 w-4 h-4" />
                    <span className="text-emerald-400 text-sm font-bold">{am}</span>
                 </label>
               ))}
               <form 
                 onSubmit={(e) => {
                   e.preventDefault();
                   if (otherAmenity.trim()) {
                     toggleAmenity(otherAmenity.trim());
                     setOtherAmenity('');
                   }
                 }}
                 className="flex flex-col gap-2 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 group focus-within:border-emerald-500/50 transition-all"
               >
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{lang === 'es' ? 'Otro' : 'Other'}</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ej: Helipuerto" 
                      className="bg-transparent border-b border-emerald-500/30 text-white text-sm outline-none w-full py-1" 
                      value={otherAmenity}
                      onChange={e => setOtherAmenity(e.target.value)}
                    />
                    <button 
                      type="submit"
                      className="p-1.5 bg-emerald-500 rounded-lg text-white hover:scale-110 active:scale-95 transition-transform"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
               </form>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Video size={16} /> {lang === 'es' ? 'Link de Video' : 'Video Link'}
            </h3>
            <input type="text" placeholder="YouTube or Vimeo URL" className="input-field" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
          </section>

          <section className="glass-card p-8 rounded-3xl border-emerald-500/20">
            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <DollarSign size={16} /> {lang === 'es' ? 'Estado' : 'Status'}
            </h3>
            <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
               <option value="available" className="bg-paradise-950">Disponible</option>
               <option value="rented" className="bg-paradise-950">Arrendado</option>
               <option value="sold" className="bg-paradise-950">Vendido</option>
               <option value="maintenance" className="bg-paradise-950">Mantenimiento</option>
            </select>
          </section>
          
          <button 
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-paradise-950 py-6 rounded-3xl text-sm uppercase tracking-[0.3em] font-black shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 ring-1 ring-emerald-400/50"
          >
            {loading ? (lang === 'es' ? 'Guardando...' : 'Saving...') : (editId ? (lang === 'es' ? 'Guardar Cambios' : 'Save Changes') : (lang === 'es' ? 'Publicar Anuncio' : 'Publish Listing'))}
          </button>
        </div>
      </div>
      <PartnerAuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onConfirm={onConfirmAuth}
        lang={lang}
      />

    </div>
  );
}
