const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });
const crypto = require('crypto');

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.VITE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.VITE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.VITE_R2_SECRET_ACCESS_KEY,
  },
});

const bucketName = process.env.VITE_R2_BUCKET_NAME;
const publicDomain = process.env.VITE_R2_PUBLIC_DOMAIN.replace(/\/$/, '');

async function main() {
  console.log('Fetching properties...');
  const { data: properties, error } = await sb.from('properties').select('id, title, images');
  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  let totalUpdated = 0;
  let totalBase64Converted = 0;

  for (const property of properties) {
    if (!property.images || !Array.isArray(property.images)) continue;

    let needsUpdate = false;
    const newImages = [];

    for (let i = 0; i < property.images.length; i++) {
      const img = property.images[i];
      if (img.startsWith('data:image/')) {
        needsUpdate = true;
        totalBase64Converted++;

        // Parse base64
        const matches = img.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          console.error(`Failed to parse base64 for ${property.title} image ${i}`);
          newImages.push(img); // keep original
          continue;
        }

        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');
        
        const ext = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
        const safeName = (property.title || 'prop').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        const hash = crypto.randomBytes(4).toString('hex');
        const filename = `properties/${Date.now()}-${safeName}-${hash}.${ext}`;

        console.log(`Uploading ${filename} (${(buffer.length / 1024).toFixed(2)} KB)...`);
        
        await s3.send(new PutObjectCommand({
          Bucket: bucketName,
          Key: filename,
          Body: buffer,
          ContentType: mimeType,
        }));

        const publicUrl = `${publicDomain}/${filename}`;
        newImages.push(publicUrl);
      } else {
        newImages.push(img);
      }
    }

    if (needsUpdate) {
      console.log(`Updating property ${property.id} (${property.title}) with new image URLs...`);
      
      const response = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/properties?id=eq.${property.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`,
          'x-partner-secret': 'paradise-premium-secret-2024'
        },
        body: JSON.stringify({ images: newImages })
      });
      
      if (!response.ok) {
        console.error(`Failed to update ${property.title}:`, await response.text());
      } else {
        console.log(`Successfully updated ${property.title}.`);
        totalUpdated++;
      }
    }
  }

  console.log(`\nMigration complete!`);
  console.log(`Properties updated: ${totalUpdated}`);
  console.log(`Base64 images converted to R2: ${totalBase64Converted}`);
}

main().catch(console.error);
