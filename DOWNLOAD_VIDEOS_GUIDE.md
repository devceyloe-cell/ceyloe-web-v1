# Download All Sapphire Videos from Ceyloe.com

## Quick Start

Run this single command to download all videos and update mappings:

```bash
node scripts/download-all-sapphire-videos.js
```

This will:
1. ✅ Fetch all 73+ sapphire products from ceyloe.com
2. ✅ Visit each product page
3. ✅ Extract video URLs
4. ✅ Download videos to `public/videos/gemstones/`
5. ✅ Automatically update `ceyloe-youtube-videos.ts` with mappings
6. ✅ Skip already downloaded videos

## What Happens

```
🎥 Ceyloe Sapphire Video Downloader

==================================================

Fetching sapphire products from ceyloe.com...
Fetching page 1...
Fetching page 2...
...
Found 73 unique products

Downloading videos...
==================================================

📦 1-09-ct-unheated-blue-sapphire
  📥 Downloading...
  ✅ Downloaded

📦 1-40-ct-brown-sapphire
  ✓ Already exists

... (continues for all products)

==================================================

📊 Summary:
   Total products: 73
   Videos downloaded: 73
   Videos saved to: public/videos/gemstones

📝 Updating video mappings in ceyloe-youtube-videos.ts...
✅ Video mappings updated!

💡 Restart your dev server to see the videos!

✨ Done!
```

## After Running

1. **Restart dev server:**
   ```bash
   taskkill /F /IM node.exe
   npm run dev
   ```

2. **Test:** Visit any product page - videos should now work!

## Features

- **Smart downloading:** Skips videos that already exist
- **Automatic mapping:** Updates config file automatically
- **Error handling:** Continues even if some products fail
- **Progress tracking:** Shows status for each product
- **Safe execution:** Adds delays between requests

## Manual Alternative

If you prefer to download specific products only:

```bash
# Download single product
node scripts/add-video-mapping.js "product-handle" "video-file.mp4"
```

## Troubleshooting

**Script hangs?**
- Press Ctrl+C and run again (it will skip completed downloads)

**Videos not showing?**
- Restart dev server
- Hard refresh browser (Ctrl+Shift+R)
- Check `public/videos/gemstones/` for downloaded files

**Some videos failed?**
- Normal! Some products may not have videos
- Script continues with others

## Files Created

All videos saved to:
```
public/videos/gemstones/
├── 1-09-ct-unheated-blue-sapphire.mp4
├── 1-40-ct-brown-sapphire.mp4
├── 3-10-ct-natural-blue-sapphire.mp4
└── ... (all other products)
```

Mappings auto-added to:
```
src/config/ceyloe-youtube-videos.ts
```
