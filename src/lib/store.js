import { supabase, authorizeSupabase } from './supabase';

const INITIAL_PROPERTIES = [
  {
    id: '1',
    title: 'Penthouse Provenza Luxury',
    price: 12000000,
    location: 'Medellín',
    neighborhood: 'El Poblado',
    description: 'Vive la experiencia definitiva en el corazón de Provenza. Este penthouse de diseño minimalista ofrece vistas panorámicas de la ciudad, acabados en mármol y acceso privado.',
    bedrooms: 3,
    bathrooms: 4,
    area_m2: 280,
    capacity: 6,
    amenities: ['Jacuzzi Privado', 'Seguridad 24/7', 'Gimnasio', 'Piscina'],
    pet_friendly: true,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541123351-ad3ad22b314d?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    category: 'apartment',
    status: 'available',
    isMock: true,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Minimalist Loft Laureles',
    price: 4500000,
    location: 'Medellín',
    neighborhood: 'Laureles',
    description: 'Un espacio moderno y funcional en el barrio más tradicional de Medellín. Perfecto para nómadas digitales y parejas que buscan estilo y comodidad.',
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 65,
    capacity: 2,
    amenities: ['Fibra Óptica', 'Balcón', 'Cocina Integral', 'Lavandería'],
    pet_friendly: true,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    category: 'apartment',
    status: 'available',
    isMock: true,
    created_at: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: '3',
    title: 'Finca El Retiro Paradise',
    price: 8000000,
    location: 'Antioquia',
    neighborhood: 'El Retiro',
    description: 'Espectacular finca con clima perfecto, rodeada de bosque nativo. Diseño arquitectónico que integra la naturaleza con el confort moderno.',
    bedrooms: 5,
    bathrooms: 4,
    area_m2: 450,
    capacity: 12,
    amenities: ['Piscina Climatizada', 'Zona BBQ', 'Chimenea', 'Cancha Múltiple'],
    pet_friendly: true,
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    category: 'finca',
    status: 'available',
    isMock: true,
    created_at: new Date(Date.now() - 200000).toISOString()
  },
  {
    id: '4',
    title: 'Yate de Lujo 45ft Guatapé',
    price: 3500000,
    location: 'Antioquia',
    neighborhood: 'Guatapé',
    description: 'Disfruta de la mejor experiencia en la represa. Sistema de sonido JL Audio, capitán experimentado y todo el equipo para deportes acuáticos.',
    bedrooms: 1,
    bathrooms: 1,
    area_m2: 0,
    capacity: 15,
    amenities: ['Sistema de Sonido', 'Capitán Incluido', 'Bebidas', 'Asoleadoras'],
    pet_friendly: false,
    images: [
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80'
    ],
    videoUrl: '',
    category: 'vehicle',
    status: 'available',
    isMock: true,
    created_at: new Date(Date.now() - 300000).toISOString()
  }
];

const STORAGE_KEY = 'paradise_properties_v6';
const SYNC_KEY = 'paradise_last_sync_v6';

// Asynchronous LocalStorage Helpers
const storage = {
  get: () => new Promise(res => {
    const data = localStorage.getItem(STORAGE_KEY);
    res(data ? JSON.parse(data) : []);
  }),
  set: (data) => new Promise(res => {
    // Lightening images to prevent QuotaExceededError
    const lightData = data.map(p => ({
      ...p,
      images: (p.images && p.images.length > 0) ? [p.images[0]] : []
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lightData));
    res();
  })
};

export const getProperties = async () => {
  const cached = await storage.get();
  const lastSync = parseInt(localStorage.getItem(SYNC_KEY) || '0', 10);
  const CACHE_TTL = 1 * 60 * 1000; // 1 minute for now to ensure freshness

  const shouldFetch = cached.length === 0 || (Date.now() - lastSync > CACHE_TTL);

  if (shouldFetch) {
    try {
      const { data, error } = await supabase.from('properties').select('*').order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        await storage.set(data);
        localStorage.setItem(SYNC_KEY, Date.now().toString());
        return data;
      }
    } catch (err) {
      console.error('Supabase Fetch exception:', err);
    }
  }

  return cached.length > 0 ? cached : INITIAL_PROPERTIES;
};

export const getProperty = async (id) => {
  try {
    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
    
    if (!error && data) {
      return data;
    }
  } catch (err) {
    console.error('Supabase getProperty error:', err);
  }
  
  const all = await storage.get();
  return all.find(p => String(p.id) === String(id));
};

export const isAuthorized = (rawEmail) => {
  const partnerEmail = (rawEmail || '').trim().toLowerCase();
  const AUTHORIZED_NAMES = ['marlon', 'andrea', 'gustavo', 'david'];
  const isAuth = AUTHORIZED_NAMES.some(name => partnerEmail.includes(name)) || 
         partnerEmail.endsWith('@paradiserentas.com');
  if (isAuth) authorizeSupabase('paradise-premium-secret-2024');
  return isAuth;
};

export const addProperty = async (prop) => {
  try {
    const propToInsert = { ...prop, created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('properties').insert([propToInsert]).select();
    if (error) throw new Error(error.message);
    const newData = data[0];
    const all = await storage.get();
    await storage.set([newData, ...all]);
    return newData;
  } catch (e) {
    throw new Error(e.message);
  }
};

const isUuid = (str) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
};

export const removeProperty = async (id, email) => {
  if (!isAuthorized(email)) throw new Error('No autorizado');
  try {
    if (isUuid(id)) {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
    }
    const all = await storage.get();
    const updated = all.filter(p => String(p.id) !== String(id));
    await storage.set(updated);
    return updated;
  } catch (e) {
    throw e;
  }
};

export const updateProperty = async (id, updates) => {
  try {
    let updatedProperty = null;
    if (isUuid(id)) {
      const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select();
      if (error) throw error;
      updatedProperty = data && data[0];
    }
    const all = await storage.get();
    const idx = all.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      all[idx] = updatedProperty || { ...all[idx], ...updates };
      await storage.set(all);
    } else if (!isUuid(id)) {
      const mockIdx = INITIAL_PROPERTIES.findIndex(p => String(p.id) === String(id));
      if (mockIdx !== -1) {
        const updatedMock = { ...INITIAL_PROPERTIES[mockIdx], ...updates };
        const mergedList = INITIAL_PROPERTIES.map(p => String(p.id) === String(id) ? updatedMock : p);
        await storage.set(mergedList);
      }
    }
    return all;
  } catch (e) {
    throw e;
  }
};

export const saveSignedContract = async (contractData) => {
  try {
    const contractToInsert = { ...contractData, created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('signed_contracts').insert([contractToInsert]).select();
    if (error) throw new Error(error.message);
    return data[0];
  } catch (e) {
    console.error('Error saving contract:', e);
    throw e;
  }
};

export const getPendingContract = async (id) => {
  try {
    const { data, error } = await supabase.from('pending_contracts').select('*').eq('id', id).single();
    if (!error && data) return data;
  } catch (e) {
    console.error('Error fetching pending contract:', e);
  }
  return null;
};

export const createPendingContract = async (contractData) => {
  try {
    const contractToInsert = { ...contractData, status: 'PENDING', created_at: new Date().toISOString() };
    const { data, error } = await supabase.from('pending_contracts').insert([contractToInsert]).select();
    if (error) throw new Error(error.message);
    return data[0].id;
  } catch (e) {
    console.error('Error creating pending contract:', e);
    throw e;
  }
};

export const saveInventory = async (propertyId, inventoryData) => {
  try {
    const { error } = await supabase.from('inventories').upsert({
      id: propertyId,
      items: inventoryData,
      updated_at: new Date().toISOString()
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error('Error saving inventory:', e);
    throw e;
  }
};

export const getInventory = async (propertyId) => {
  try {
    const { data, error } = await supabase.from('inventories').select('items').eq('id', propertyId).single();
    if (!error && data) return data.items;
  } catch (e) {
    console.error('Error fetching inventory:', e);
  }
  return null;
};
