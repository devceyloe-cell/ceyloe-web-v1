# Gemstone Video Integration

This directory contains product videos downloaded from ceyloe.com.

## Video Integration Steps

### 1. Download Videos

Videos can be downloaded from ceyloe.com product pages. Each product page has a video element that can be extracted.

**Example video URL format:**
```
https://ceyloe.com/wp-content/uploads/2026/06/Vedio-13.mp4
```

### 2. Video Naming Convention

Videos should be named using the product handle/slug:
- `blue-sapphire-3-10ct.mp4`
- `yellow-sapphire-1-19ct.mp4`
- etc.

### 3. Adding Videos to Products

Update products with video URLs in your product data:

```typescript
const product = {
  id: "...",
  handle: "3-10-ct-natural-blue-sapphire",
  title: "3.10 Ct Natural Blue Sapphire",
  // ... other fields
  videoUrl: "/videos/gemstones/blue-sapphire-3-10ct.mp4",
  // or external URL:
  // videoUrl: "https://ceyloe.com/wp-content/uploads/2026/06/Vedio-13.mp4"
};
```

### 4. Video Display

Videos will automatically display in the product gallery under the "Video" tab when a `videoUrl` is present.

## Bulk Video Download

### Option 1: Manual Download (PowerShell)

```powershell
# Download a single video
Invoke-WebRequest -Uri "https://ceyloe.com/wp-content/uploads/2026/06/Vedio-13.mp4" -OutFile "blue-sapphire-3-10ct.mp4"
```

### Option 2: Automated Script

Use the `scripts/download-ceyloe-videos.js` script:

```bash
# Install dependencies
npm install jsdom

# Run the script
node scripts/download-ceyloe-videos.js
```

This script will:
1. Scrape all product categories on ceyloe.com
2. Extract product URLs
3. Download videos from each product page
4. Save them with appropriate names

### Option 3: Browser DevTools

1. Open a product page on ceyloe.com
2. Open DevTools (F12)
3. Run in console:
```javascript
const video = document.querySelector('video');
const videoUrl = video?.src || video?.querySelector('source')?.src;
console.log(videoUrl);
```
4. Download the video URL

## Video Mapping

Create a `video-mapping.json` file to map product handles to video URLs:

```json
{
  "3-10-ct-natural-blue-sapphire": "https://ceyloe.com/wp-content/uploads/2026/06/Vedio-13.mp4",
  "1-10-ct-natural-blue-sapphire": "https://ceyloe.com/wp-content/uploads/2026/06/Vedio-XX.mp4"
}
```

## Implementation Notes

- The 360° viewer tab has been removed from the product gallery
- Videos are now the primary media feature alongside product photos
- Videos support both local paths and external URLs
- Videos automatically play inline with controls
