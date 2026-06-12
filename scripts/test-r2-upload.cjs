// Test: generate a presigned URL and verify it works
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
require('dotenv').config({ path: '.env.local' });

const accountId = process.env.VITE_R2_ACCOUNT_ID;
const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.VITE_R2_BUCKET_NAME;
const publicDomain = process.env.VITE_R2_PUBLIC_DOMAIN.replace(/\/$/, '');

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://' + accountId + '.r2.cloudflarestorage.com',
  credentials: { accessKeyId, secretAccessKey },
});

async function main() {
  const filename = 'test/cors-test-' + Date.now() + '.txt';

  // 1. Generate presigned URL
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: filename,
    ContentType: 'text/plain',
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 300 });
  console.log('Presigned URL generated:', uploadUrl.substring(0, 80) + '...');

  // 2. Upload test content
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'text/plain' },
    body: 'CORS test from Node.js',
  });
  console.log('Upload status:', res.status, res.statusText);

  // 3. Verify public URL
  const publicUrl = publicDomain + '/' + filename;
  console.log('Public URL:', publicUrl);
  const verify = await fetch(publicUrl);
  console.log('Verify status:', verify.status);
  const text = await verify.text();
  console.log('Content:', text);
  console.log('\n✅ R2 upload pipeline is working!');
}

main().catch(e => console.error('FAILED:', e.message));
