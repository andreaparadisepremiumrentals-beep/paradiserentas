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
    display_order: 1,
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
    display_order: 2,
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
    display_order: 3,
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
    display_order: 4,
    created_at: new Date(Date.now() - 300000).toISOString()
  }
];

// ---------------------------------------------------------------------------
// In-memory cache — avoids localStorage quota errors caused by large image
// URL arrays. Data lives only for the current browser session (page refresh
// clears it), which is fine because Supabase is the source of truth.
// ---------------------------------------------------------------------------
const _cache = new Map(); // key: category|'all'  → { data, ts }
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function cacheGet(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL) { _cache.delete(key); return null; }
  return entry.data;
}
function cacheSet(key, data) {
  _cache.set(key, { data, ts: Date.now() });
}
function cacheInvalidate() {
  _cache.clear();
}

/**
 * Fetch properties from Supabase (or in-memory cache).
 * @param {string|null} category  Optional: 'finca' | 'apartment' | 'vehicle'
 */
export const getProperties = async (category = null) => {
  const cacheKey = category || 'all';
  const cached = cacheGet(cacheKey);
  if (cached) return cached;

  // Helper: fetch with a given ordering.
  const fetchWith = async (orderColumn, ascending) => {
    let query = supabase.from('properties').select('*')
      .order(orderColumn, { ascending })
      .order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    return query;
  };

  try {
    let { data, error } = await fetchWith('display_order', true);

    // If display_order column doesn't exist yet (migration not applied),
    // gracefully fall back to created_at ordering.
    if (error && /display_order|column|does not exist/i.test(error.message || '')) {
      ({ data, error } = await fetchWith('created_at', false));
    }

    if (!error && data && data.length > 0) {
      cacheSet(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.error('Supabase Fetch exception:', err);
  }

  // Fallback: mock data (only shown before any real data exists)
  return INITIAL_PROPERTIES.filter(p => !category || p.category === category);
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
    let display_order;
    try {
      // Assign display_order = max + 1 so new listings append at the end.
      const { data: existing } = await supabase.from('properties').select('display_order').order('display_order', { ascending: false }).limit(1);
      const maxOrder = existing && existing.length > 0 ? (existing[0].display_order || 0) : 0;
      display_order = maxOrder + 1;
    } catch {
      // display_order column not present yet — omit it, let the DB default.
      display_order = undefined;
    }

    const propToInsert = { ...prop, created_at: new Date().toISOString() };
    if (display_order !== undefined) propToInsert.display_order = display_order;

    const { data, error } = await supabase.from('properties').insert([propToInsert]).select();
    if (error) throw new Error(error.message);
    cacheInvalidate(); // bust cache so next fetch gets fresh data
    return data[0];
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
    cacheInvalidate(); // bust cache
    return true;
  } catch (e) {
    throw e;
  }
};

export const updateProperty = async (id, updates) => {
  try {
    if (isUuid(id)) {
      const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select();
      if (error) throw error;
      cacheInvalidate(); // bust cache so edited data appears on next visit
      return data && data[0];
    }
    // For non-UUID (mock) IDs there is nothing to persist server-side
    cacheInvalidate();
    return null;
  } catch (e) {
    throw e;
  }
};

/**
 * Persist a new ordering for a list of properties by updating each row's
 * display_order with a per-row UPDATE (a single upsert with partial columns
 * fails the not-null constraint on required fields like title).
 * @param {Array<{id: string}>} orderedItems  Property list in the new order.
 */
export const updateDisplayOrder = async (orderedItems) => {
  const rows = orderedItems
    .map((item, index) => ({ id: item.id, display_order: index + 1 }))
    .filter(row => isUuid(row.id)); // mock IDs are local-only, skip them

  if (rows.length === 0) {
    cacheInvalidate();
    return;
  }

  try {
    await Promise.all(rows.map(async (row) => {
      const { error } = await supabase
        .from('properties')
        .update({ display_order: row.display_order })
        .eq('id', row.id);
      if (error) throw error;
    }));
    cacheInvalidate(); // bust cache so ordering appears on next visit
  } catch (e) {
    console.error('Error updating display order:', e);
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
