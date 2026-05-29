import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get Cloudflare R2 Credentials from environment variables
    const r2AccountId = Deno.env.get("R2_ACCOUNT_ID")
    const r2AccessKeyId = Deno.env.get("R2_ACCESS_KEY_ID")
    const r2SecretAccessKey = Deno.env.get("R2_SECRET_ACCESS_KEY")
    const r2BucketName = Deno.env.get("R2_BUCKET_NAME")
    const r2PublicDomain = Deno.env.get("R2_PUBLIC_DOMAIN")

    if (!r2AccountId || !r2AccessKeyId || !r2SecretAccessKey || !r2BucketName || !r2PublicDomain) {
      throw new Error("Missing Cloudflare R2 environment variables in Deno environment / Supabase secrets.")
    }

    // 2. Parse request body
    const { filename, contentType } = await req.json()
    if (!filename || !contentType) {
      throw new Error("Missing 'filename' or 'contentType' in request body.")
    }

    // 3. Create S3 client for Cloudflare R2
    const s3Client = new S3Client({
      region: "auto",
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKeyId,
        secretAccessKey: r2SecretAccessKey,
      },
    })

    // 4. Generate presigned PUT URL
    const command = new PutObjectCommand({
      Bucket: r2BucketName,
      Key: filename,
      ContentType: contentType,
    })

    // URL expires in 300 seconds (5 minutes)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    // 5. Construct public URL
    // Ensure public domain doesn't end with a slash, then append filename
    const cleanPublicDomain = r2PublicDomain.endsWith('/') ? r2PublicDomain.slice(0, -1) : r2PublicDomain
    const publicUrl = `${cleanPublicDomain}/${filename}`

    return new Response(
      JSON.stringify({ uploadUrl, publicUrl }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
