import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Cargar variables de entorno manualmente para evitar dependencias
function loadEnv() {
  const env = {};
  const envFiles = ['.env', '.env.local'];
  for (const file of envFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([^#\s=]+)\s*=\s*(.*)$/);
        if (match) {
          env[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
  }
  return env;
}

const env = loadEnv();

// Validar que las variables de entorno necesarias estén presentes
const requiredEnv = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_R2_ACCOUNT_ID',
  'VITE_R2_ACCESS_KEY_ID',
  'VITE_R2_SECRET_ACCESS_KEY',
  'VITE_R2_BUCKET_NAME',
  'VITE_R2_PUBLIC_DOMAIN'
];

for (const key of requiredEnv) {
  if (!env[key]) {
    console.error(`❌ Falta la variable de entorno obligatoria: ${key}`);
    process.exit(1);
  }
}

console.log('✅ Variables de entorno cargadas correctamente.');

// 2. Configurar el cliente de Cloudflare R2 (S3 compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.VITE_R2_SECRET_ACCESS_KEY
  }
});

// 3. Definición del mapeo de carpetas de OneDrive
const FOLDER_MAPPING = {
  "Finca Villa Valentina": "VILLA VALENTINA SAN JERÓNIMO",
  "Finca Hotel El Recreo": "FINCA HOTEL BARBOSA PARA DIAS DE SOL Y AMANECIDAS",
  "Finca Venecia": "Finca Venecia GIRARDOTA",
  "Finca Villa Margarita": "Finca Villa Margarita Girardota",
  "Casa Principal": "VILLA PALMA BARBOSA",
  "Finca de Recreo Villa Esteban": "Villa Esteban Sopetrán",
  "Finca El Abuelo": "EL PARAISO GIRARDOTA",
  "Finca Cristo Rey": "CRISTO REY SAN JERÓNIMO",
  "Finca Valsan": "VALSAN SAN JERÓNIMO",
  "El Paraíso": "EL PARAISO SANTA FE DE ANTIOQUIA",
  "Finca La Flor": "LA FLOR SAN JERÓNIMO"
};

const ONEDRIVE_BASE_PATH = "C:\\Users\\david\\OneDrive\\Desktop\\PROPIEDADES PARADISE RENTAS\\drive-download-20260529T002736Z-3-001";
const MD_FILE_PATH = path.join(ONEDRIVE_BASE_PATH, "Propiedades 1 .md");

// 4. Asignación de precios estimados base según la categoría/capacidad
function getEstimatedPrice(internalName, capacity) {
  if (internalName === 'Finca Hotel El Recreo') return 3500000; // Finca Hotel/Resort
  if (internalName === 'Finca Villa Margarita') return 2500000; // Lujo
  if (internalName === 'Finca Valsan') return 2800000; // Eventos Gigantes (35 pax)
  if (capacity >= 20) return 2200000;
  return 1800000; // Regular premium por noche
}

// 5. Mapear amenidades desde el texto
function detectAmenities(text) {
  const amenities = [];
  const lowercase = text.toLowerCase();
  
  if (lowercase.includes('piscina')) amenities.push('Piscina');
  if (lowercase.includes('jacuzzi')) amenities.push('Jacuzzi Privado');
  if (lowercase.includes('futbol') || lowercase.includes('cancha')) amenities.push('Canchas Deportivas');
  if (lowercase.includes('bbq') || lowercase.includes('asador') || lowercase.includes('carbón') || lowercase.includes('leña') || lowercase.includes('sancocho') || lowercase.includes('fogón')) amenities.push('Zona BBQ');
  if (lowercase.includes('wi-fi') || lowercase.includes('wifi') || lowercase.includes('internet') || lowercase.includes('conectividad')) amenities.push('Fibra Óptica');
  if (lowercase.includes('kiosco') || lowercase.includes('kiosko') || lowercase.includes('kiosco social')) amenities.push('Kiosco');
  if (lowercase.includes('billar')) amenities.push('Mesa de Billar');
  if (lowercase.includes('ping pong') || lowercase.includes('pingpong') || lowercase.includes('mesa de ping')) amenities.push('Mesa de Ping Pong');
  if (lowercase.includes('mascotas') || lowercase.includes('pet friendly') || lowercase.includes('mascota')) amenities.push('Pet Friendly');
  if (lowercase.includes('aire acondicionado') || lowercase.includes('climatizada') || lowercase.includes('climatizadas') || lowercase.includes('ventilador')) amenities.push('Aire Acondicionado');
  if (lowercase.includes('parqueadero') || lowercase.includes('vehículos') || lowercase.includes('carros') || lowercase.includes('estacionamiento')) amenities.push('Parqueadero Privado');
  if (lowercase.includes('turco') || lowercase.includes('sauna')) amenities.push('Sauna / Turco');
  if (lowercase.includes('cocina') || lowercase.includes('cocineta')) amenities.push('Cocina Integral');
  if (lowercase.includes('juegos infantiles') || lowercase.includes('niños') || lowercase.includes('diversión') || lowercase.includes('columpios')) amenities.push('Juegos Infantiles');
  if (lowercase.includes('vista') || lowercase.includes('mirador') || lowercase.includes('panorámica') || lowercase.includes('paisaje')) amenities.push('Vista Panorámica');
  if (lowercase.includes('fogata') || lowercase.includes('estrellas')) amenities.push('Zona de Fogatas');
  
  // Eliminar duplicados
  return [...new Set(amenities)];
}

// 6. Subir una imagen a Cloudflare R2
async function uploadToR2(filePath, internalName) {
  const fileName = path.basename(filePath);
  const fileBuffer = fs.readFileSync(filePath);
  const key = `properties/${internalName.toLowerCase().replace(/\s+/g, '-')}/${fileName}`;
  
  const uploadParams = {
    Bucket: env.VITE_R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: 'image/jpeg'
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await r2Client.send(command);
    const publicUrl = `${env.VITE_R2_PUBLIC_DOMAIN}/${key}`;
    return publicUrl;
  } catch (err) {
    console.error(`❌ Error al subir ${fileName} a R2:`, err.message);
    throw err;
  }
}

// 7. Procesar imágenes de una carpeta en OneDrive
async function processFolderImages(internalName) {
  const folderName = FOLDER_MAPPING[internalName];
  if (!folderName) {
    console.warn(`⚠️ No hay mapeo de carpeta para la propiedad: ${internalName}`);
    return [];
  }

  const folderPath = path.join(ONEDRIVE_BASE_PATH, folderName);
  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️ Carpeta física no encontrada en OneDrive: ${folderPath}`);
    return [];
  }

  const files = fs.readdirSync(folderPath);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const imageFiles = files.filter(f => imageExtensions.includes(path.extname(f).toLowerCase()));

  console.log(`📸 Subiendo ${imageFiles.length} imágenes para "${internalName}" desde ${folderName}...`);
  const imageUrls = [];
  
  for (const file of imageFiles) {
    const filePath = path.join(folderPath, file);
    try {
      const publicUrl = await uploadToR2(filePath, internalName);
      imageUrls.push(publicUrl);
    } catch (e) {
      console.error(`⚠️ Omitiendo imagen por error en la subida: ${file}`);
    }
  }
  
  console.log(`✅ Subidas con éxito ${imageUrls.length} imágenes para "${internalName}".`);
  return imageUrls;
}

// 8. Parser principal del archivo Markdown
async function main() {
  console.log('📖 Iniciando lectura y parsing de Propiedades 1 .md...');
  
  if (!fs.existsSync(MD_FILE_PATH)) {
    console.error(`❌ No se encontró el archivo de descripciones en: ${MD_FILE_PATH}`);
    process.exit(1);
  }

  const mdContent = fs.readFileSync(MD_FILE_PATH, 'utf-8');
  
  // Dividir por cada bloque de propiedad (###)
  const sections = mdContent.split('###').map(s => s.trim()).filter(s => s.length > 0);
  
  const propertiesToInsert = [];

  for (const section of sections) {
    // Si no empieza con emoji de casa 🏡, puede ser cabecera
    if (!section.includes('🏡')) continue;

    const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const titleLine = lines[0];

    // Extraer título limpio y nombre de control interno
    // El título original es e.g., "**🏡 Finca Campestre en San Jerónimo (Finca Villa Valentina)**"
    // o "🏡 Finca Panorámica en Girardota (Finca Venecia)"
    const titleMatch = titleLine.match(/(?:\*\*🏡|🏡)\s*([^(]+?)\s*\(([^)]+)\)\s*\*\*?/);
    if (!titleMatch) {
      console.warn(`⚠️ No se pudo parsear el título en la línea: ${titleLine}`);
      continue;
    }

    const publicTitle = titleMatch[1].replace(/[\*\_]/g, '').trim();
    const internalName = titleMatch[2].replace(/[\*\_]/g, '').trim();

    console.log(`\n--------------------------------------------------`);
    console.log(`🏠 Procesando propiedad: "${publicTitle}" (Nombre interno: ${internalName})`);

    // Juntar el resto del contenido para la descripción y bullets
    const bodyContent = lines.slice(1).join('\n');

    // Extraer la descripción general (texto entre el título y las Características y Comodidades)
    let description = '';
    const descMatch = bodyContent.match(/^([\s\S]*?)(?:\*\*Características y Comodidades|\*\*Características y Comodidades)/i);
    if (descMatch) {
      description = descMatch[1].replace(/[\*\_\\]/g, '').trim();
    } else {
      description = bodyContent.replace(/[\*\_\\]/g, '').trim();
    }

    // Valores por defecto
    let capacity = 12;
    let bedrooms = 4;
    let bathrooms = 3;
    let location = 'Antioquia';
    let neighborhood = '';

    // Extraer capacidad
    const capacityMatch = bodyContent.match(/(?:Capacidad|Alojamiento):\*\*?\s*(?:Ideal para grupos grandes, hasta|Confortable espacio para hasta|Hasta|Espacio ideal para hasta)?\s*(\d+)/i);
    if (capacityMatch) {
      capacity = parseInt(capacityMatch[1]);
    }

    // Extraer habitaciones (bedrooms)
    const bedsMatch = bodyContent.match(/(\d+)\s*(?:amplias|confortables|espectaculares|grandes)?\s*(?:alcobas|habitaciones|habitación)/i);
    if (bedsMatch) {
      bedrooms = parseInt(bedsMatch[1]);
    }

    // Extraer baños (bathrooms)
    const bathsMatch = bodyContent.match(/(\d+(?:\.\d+)?)\s*baño/i);
    if (bathsMatch) {
      bathrooms = Math.round(parseFloat(bathsMatch[1]));
    } else {
      // Ajustar baños por defecto según habitaciones
      bathrooms = Math.max(2, bedrooms - 1);
    }

    // Determinar municipio (San Jerónimo, Barbosa, Girardota, Sopetrán, Santa Fe de Antioquia)
    const lowerBody = bodyContent.toLowerCase() + ' ' + publicTitle.toLowerCase() + ' ' + FOLDER_MAPPING[internalName].toLowerCase();
    if (lowerBody.includes('san jerónimo') || lowerBody.includes('san jeronimo')) {
      location = 'San Jerónimo';
      neighborhood = 'Sector Vía Principal';
    } else if (lowerBody.includes('barbosa')) {
      location = 'Barbosa';
      neighborhood = 'Sector Campestre';
    } else if (lowerBody.includes('girardota')) {
      location = 'Girardota';
      neighborhood = 'Sector Campestre';
    } else if (lowerBody.includes('sopetrán') || lowerBody.includes('sopetran')) {
      location = 'Sopetrán';
      neighborhood = 'Occidente Antioqueño';
    } else if (lowerBody.includes('santa fe de antioquia')) {
      location = 'Santa Fe de Antioquia';
      neighborhood = 'Sector Colonial';
    } else {
      location = 'Antioquia';
      neighborhood = 'Sector Rural';
    }

    // Determinar si acepta mascotas
    const petFriendly = lowerBody.includes('pet friendly') || lowerBody.includes('mascotas bienvenidas') || lowerBody.includes('mascotas bienvenido');

    // Mapear amenidades
    const amenities = detectAmenities(bodyContent);

    // Asignar precio estimado por noche
    const price = getEstimatedPrice(internalName, capacity);

    // Subir imágenes físicas de OneDrive a Cloudflare R2
    const images = await processFolderImages(internalName);

    // Si no se cargaron imágenes, poner una por defecto de Unsplash
    if (images.length === 0) {
      console.warn(`⚠️ No se encontraron imágenes para ${internalName}. Se usará una por defecto.`);
      images.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80');
    }

    const propertyRecord = {
      title: publicTitle,
      description: description,
      price: price,
      area_m2: bedrooms * 30 + 100, // Área estimada según habitaciones
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      location: location,
      neighborhood: neighborhood,
      category: 'finca',
      amenities: amenities,
      images: images,
      pet_friendly: petFriendly,
      status: 'available',
      capacity: capacity,
      isMock: false,
      videoUrl: ''
    };

    propertiesToInsert.push(propertyRecord);
    console.log(`📌 Registro mapeado con éxito: "${publicTitle}" (Capacidad: ${capacity} Pax, Alcobas: ${bedrooms}, Baños: ${bathrooms}, Mascotas: ${petFriendly ? 'Sí' : 'No'}, Amenidades: ${amenities.length}, Fotos: ${images.length})`);
  }

  // 9. Insertar registros masivos en Supabase a través del API de PostgREST
  console.log(`\n🚀 Insertando ${propertiesToInsert.length} propiedades en Supabase...`);
  
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  const endpoint = `${supabaseUrl}/rest/v1/properties`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`,
        'Prefer': 'return=representation',
        'x-partner-secret': 'paradise-premium-secret-2024'
      },
      body: JSON.stringify(propertiesToInsert)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error HTTP ${response.status}: ${errorText}`);
    }

    const insertedData = await response.json();
    console.log(`\n🎉 ¡PUBLICACIÓN EXITOSA! Se publicaron adecuadamente ${insertedData.length} fincas en la plataforma.`);
    
    console.log('\nListado de Fincas Publicadas con ID de Supabase:');
    insertedData.forEach((prop, index) => {
      console.log(`${index + 1}. [${prop.id}] ${prop.title} ($${prop.price.toLocaleString('es-CO')} COP/noche)`);
    });

  } catch (err) {
    console.error(`❌ Error fatal al insertar las propiedades en Supabase:`, err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('❌ Error no controlado en la ejecución:', err);
  process.exit(1);
});
