import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  setDoc
} from "firebase/firestore";

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
      const q = query(collection(db, "properties"), orderBy("created_at", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (data.length > 0) {
        await storage.set(data);
        localStorage.setItem(SYNC_KEY, Date.now().toString());
        return data;
      }
    } catch (err) {
      console.error('Firebase Fetch exception:', err);
    }
  }

  return cached.length > 0 ? cached : INITIAL_PROPERTIES;
};

export const getProperty = async (id) => {
  try {
    const docRef = doc(db, "properties", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
  } catch (err) {
    console.error('Firebase getProperty error:', err);
  }
  
  const all = await storage.get();
  return all.find(p => String(p.id) === String(id));
};

export const isAuthorized = (rawEmail) => {
  const partnerEmail = (rawEmail || '').trim().toLowerCase();
  const AUTHORIZED_NAMES = ['marlon', 'andrea', 'gustavo', 'david'];
  return AUTHORIZED_NAMES.some(name => partnerEmail.includes(name)) || 
         partnerEmail.endsWith('@paradiserentas.com');
};

export const addProperty = async (prop) => {
  try {
    const docRef = await addDoc(collection(db, "properties"), {
      ...prop,
      created_at: new Date().toISOString()
    });
    const newData = { id: docRef.id, ...prop };
    const all = await storage.get();
    await storage.set([newData, ...all]);
    return newData;
  } catch (e) {
    throw new Error(e.message);
  }
};

export const removeProperty = async (id, email) => {
  if (!isAuthorized(email)) throw new Error('No autorizado');
  try {
    await deleteDoc(doc(db, "properties", id));
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
    const docRef = doc(db, "properties", id);
    await updateDoc(docRef, updates);
    const all = await storage.get();
    const idx = all.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      await storage.set(all);
    }
    return all;
  } catch (e) {
    throw e;
  }
};

export const saveSignedContract = async (contractData) => {
  try {
    const docRef = await addDoc(collection(db, "signed_contracts"), {
      ...contractData,
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...contractData };
  } catch (e) {
    console.error('Error saving contract:', e);
    throw e;
  }
};

export const getPendingContract = async (id) => {
  try {
    const docRef = doc(db, "pending_contracts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
  } catch (e) {
    console.error('Error fetching pending contract:', e);
  }
  return null;
};

export const createPendingContract = async (contractData) => {
  try {
    const docRef = await addDoc(collection(db, "pending_contracts"), {
      ...contractData,
      status: 'PENDING',
      created_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (e) {
    console.error('Error creating pending contract:', e);
    throw e;
  }
};

export const saveInventory = async (propertyId, inventoryData) => {
  try {
    const docRef = doc(db, "inventories", propertyId);
    await setDoc(docRef, {
      items: inventoryData,
      updated_at: new Date().toISOString()
    });
  } catch (e) {
    console.error('Error saving inventory:', e);
    throw e;
  }
};

export const getInventory = async (propertyId) => {
  try {
    const docRef = doc(db, "inventories", propertyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data().items;
  } catch (e) {
    console.error('Error fetching inventory:', e);
  }
  return null;
};
