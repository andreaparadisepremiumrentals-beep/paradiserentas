// Configure CORS on the R2 bucket to allow browser uploads
const { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config({ path: '.env.local' });

const accountId = process.env.VITE_R2_ACCOUNT_ID;
const accessKeyId = process.env.VITE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.VITE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.VITE_R2_BUCKET_NAME;

console.log('Account ID:', accountId ? 'present' : 'MISSING');
console.log('Bucket:', bucketName);

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://' + accountId + '.r2.cloudflarestorage.com',
  credentials: { accessKeyId, secretAccessKey },
});

async function main() {
  // Check current CORS
  try {
    const current = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
    console.log('Current CORS rules:', JSON.stringify(current.CORSRules, null, 2));
  } catch (e) {
    console.log('No existing CORS rules:', e.Code || e.name || e.message);
  }

  // Set CORS rules
  const corsConfig = {
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: [
            'https://paradiserentas.com',
            'https://www.paradiserentas.com',
            'http://localhost:5173',
            'http://localhost:4173',
          ],
          AllowedMethods: ['GET', 'PUT', 'HEAD'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  };

  try {
    await client.send(new PutBucketCorsCommand(corsConfig));
    console.log('\n✅ CORS rules set successfully!');

    // Verify
    const verify = await client.send(new GetBucketCorsCommand({ Bucket: bucketName }));
    console.log('Verified CORS:', JSON.stringify(verify.CORSRules, null, 2));
  } catch (e) {
    console.error('Failed to set CORS:', e.message);
    console.error('Full error:', JSON.stringify(e, null, 2));
  }
}

main();
