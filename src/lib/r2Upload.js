// --------------------------------------------------------
// R2 Direct Upload — presigns and uploads images to
// Cloudflare R2 directly from the browser, bypassing the
// broken Supabase Edge Function.
// --------------------------------------------------------
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// These are already exposed as VITE_ env vars (bundled into the client).
const R2_ACCOUNT_ID  = import.meta.env.VITE_R2_ACCOUNT_ID;
const R2_ACCESS_KEY  = import.meta.env.VITE_R2_ACCESS_KEY_ID;
const R2_SECRET_KEY  = import.meta.env.VITE_R2_SECRET_ACCESS_KEY;
const R2_BUCKET      = import.meta.env.VITE_R2_BUCKET_NAME;
const R2_PUBLIC_URL  = (import.meta.env.VITE_R2_PUBLIC_DOMAIN || '').replace(/\/$/, '');

let _s3 = null;

function getClient() {
  if (_s3) return _s3;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY || !R2_SECRET_KEY || !R2_BUCKET) {
    throw new Error('Missing R2 credentials in environment variables');
  }

  _s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY,
      secretAccessKey: R2_SECRET_KEY,
    },
  });

  return _s3;
}

/**
 * Upload a Blob/File to R2 and return the public URL.
 *
 * @param {Blob} blob        The image blob to upload
 * @param {string} filename  The desired key, e.g. "properties/1718142000-photo.jpg"
 * @param {string} contentType  MIME type, e.g. "image/jpeg"
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export async function uploadToR2(blob, filename, contentType = 'image/jpeg') {
  const client = getClient();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: filename,
    ContentType: contentType,
  });

  // Generate a presigned URL (valid for 5 minutes)
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });

  // Upload the blob directly to R2
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error(`R2 upload failed (${res.status}): ${await res.text()}`);
  }

  return `${R2_PUBLIC_URL}/${filename}`;
}
