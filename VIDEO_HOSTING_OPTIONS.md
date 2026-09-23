# Video URLs for Production Deployment

## Issue
Video files (~300-400 MB total) cannot be deployed to Vercel due to size limits.

## Solutions

### Option 1: Keep Videos on ceyloe.com (Simplest - Already Working!)
Use the original ceyloe.com video URLs. Your videos are already there!

**Pros:**
- ✅ No setup needed
- ✅ Already working
- ✅ Free hosting

**Cons:**
- ⚠️ Depends on ceyloe.com availability
- ⚠️ No control over bandwidth/caching

### Option 2: Upload to Vercel Blob Storage (Recommended)
Vercel's built-in blob storage for assets.

**Cost:** ~$0.15/GB storage + $0.30/GB bandwidth
**Setup:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Create blob store
vercel blob create videos

# Upload videos (run this script):
node scripts/upload-to-vercel-blob.js
```

### Option 3: Use Cloudflare R2 (Best for High Traffic)
Free egress bandwidth!

**Cost:** $0.015/GB storage (first 10 GB free)
**Setup:** Requires Cloudflare account

### Option 4: Azure Blob Storage (Since you're on Azure)
Integrate with your existing Azure setup.

**Cost:** Very cheap, you're already on Azure

## Quick Deploy (Using ceyloe.com URLs)

Since your videos are already on ceyloe.com, I can update the config to use those URLs for production:

1. **Locally:** Videos load from `/videos/gemstones/`
2. **Production:** Videos load from `ceyloe.com`

Would you like me to:
1. **Deploy now** using ceyloe.com URLs (fastest)
2. **Set up Vercel Blob** storage (cleanest)
3. **Set up Azure Blob** storage (best long-term)
