# How to Upload Videos to Vercel Blob

## Step 1: Get Your Blob Token

Visit your Vercel Blob store dashboard:
https://vercel.com/dashboard/stores/store_P3pmh1n6wU63K9Yi

### Option A: Link Store to Project (Recommended)

1. Go to your blob store page (link above)
2. Click "**Connect to Project**" or "**Link Project**"
3. Select your project: **ceyloe-web**
4. This will automatically add the token to your project

Then run:
```bash
vercel env pull .env.local
```

### Option B: Manual Token

1. Go to blob store page
2. Click "**.env.local**" tab
3. Copy the `BLOB_READ_WRITE_TOKEN` value
4. Use it in the upload command

## Step 2: Upload Videos

### If you linked the store (Option A):
```bash
vercel env pull .env.local
node --env-file=.env.local scripts/upload-to-vercel-blob.mjs
```

### If using manual token (Option B):
```powershell
$env:BLOB_READ_WRITE_TOKEN="your_token_here"
node scripts/upload-to-vercel-blob.mjs
```

## Step 3: Update Video Mappings

After upload completes, update your config to use Blob URLs:
```bash
node scripts/update-video-urls-blob.mjs
```

## What This Does

1. **Uploads** all 67 videos (~300-400 MB) to Vercel Blob
2. **Generates** a mapping file with all Blob URLs
3. **Updates** your code to use Blob URLs instead of local paths
4. **Deploys** without videos in the bundle

## Benefits

✅ No deployment size issues
✅ Fast CDN delivery
✅ Automatic caching
✅ Pay-per-use pricing (~$0.15/GB)

## Estimated Cost

- **Storage**: 0.4 GB × $0.15 = **~$0.06/month**
- **Bandwidth**: First 100 GB free, then $0.30/GB

For typical traffic, expect **$0.10-0.50/month**.
