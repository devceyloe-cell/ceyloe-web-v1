/**
 * Comprehensive script to download ALL sapphire videos from ceyloe.com
 * and automatically update the video mapping
 * 
 * Usage: node scripts/download-all-sapphire-videos.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://ceyloe.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'videos', 'gemstones');
const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config', 'ceyloe-youtube-videos.ts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Fetch HTML content from a URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Download a file from URL
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {});
      reject(err);
    });
  });
}

/**
 * Extract video URL from product page HTML
 */
function extractVideoUrl(html) {
  // Look for video source in the HTML
  const videoMatch = html.match(/<video[^>]*>[\s\S]*?<source[^>]+src=["']([^"']+)["']/i) ||
                     html.match(/<video[^>]+src=["']([^"']+)["']/i);
  
  if (videoMatch && videoMatch[1]) {
    return videoMatch[1];
  }
  return null;
}

/**
 * Extract product handle from URL
 */
function getHandleFromUrl(url) {
  const match = url.match(/\/product\/([^\/]+)\//);
  return match ? match[1] : null;
}

/**
 * Get all product URLs from category page
 */
async function getAllProductUrls() {
  console.log('Fetching sapphire products from ceyloe.com...\n');
  
  let allProducts = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    try {
      const url = page === 1 
        ? `${BASE_URL}/product-category/sapphires/`
        : `${BASE_URL}/product-category/sapphires/page/${page}/`;
      
      console.log(`Fetching page ${page}...`);
      const html = await fetchHTML(url);
      
      // Extract product URLs from the page
      const productMatches = html.match(/href=["'](https?:\/\/ceyloe\.com\/product\/[^"']+)["']/gi) || [];
      const productUrls = productMatches
        .map(match => match.match(/href=["']([^"']+)["']/i)[1])
        .filter((url, i, arr) => arr.indexOf(url) === i); // unique
      
      if (productUrls.length === 0) {
        hasMore = false;
      } else {
        allProducts = allProducts.concat(productUrls);
        page++;
      }
      
      // Safety: don't fetch more than 10 pages
      if (page > 10) hasMore = false;
      
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      hasMore = false;
    }
  }
  
  // Remove duplicates
  allProducts = [...new Set(allProducts)];
  console.log(`\nFound ${allProducts.length} unique products\n`);
  
  return allProducts;
}

/**
 * Download video from a product page
 */
async function downloadProductVideo(productUrl) {
  const handle = getHandleFromUrl(productUrl);
  if (!handle) {
    console.log(`  ⚠️  Could not extract handle from: ${productUrl}`);
    return null;
  }
  
  try {
    console.log(`📦 ${handle}`);
    const html = await fetchHTML(productUrl);
    const videoUrl = extractVideoUrl(html);
    
    if (!videoUrl) {
      console.log(`  ⚠️  No video found`);
      return null;
    }
    
    // Generate filename
    const videoFilename = `${handle}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, videoFilename);
    
    // Skip if already downloaded
    if (fs.existsSync(outputPath)) {
      console.log(`  ✓ Already exists`);
      return { handle, videoPath: `/videos/gemstones/${videoFilename}` };
    }
    
    console.log(`  📥 Downloading...`);
    await downloadFile(videoUrl, outputPath);
    console.log(`  ✅ Downloaded`);
    
    return { handle, videoPath: `/videos/gemstones/${videoFilename}` };
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return null;
  }
}

/**
 * Update the ceyloe-youtube-videos.ts file with new mappings
 */
function updateVideoMappings(videoMappings) {
  console.log('\n📝 Updating video mappings in ceyloe-youtube-videos.ts...\n');
  
  let content = fs.readFileSync(CONFIG_FILE, 'utf-8');
  
  // Find the productVideoByHandle section
  const mappingStart = content.indexOf('export const productVideoByHandle: Record<string, string> = {');
  const mappingEnd = content.indexOf('};', mappingStart);
  
  if (mappingStart === -1) {
    console.error('❌ Could not find productVideoByHandle in config file');
    return;
  }
  
  // Generate new mapping entries
  const newMappings = videoMappings
    .filter(m => m !== null)
    .map(m => `  "${m.handle}": "${m.videoPath}",`)
    .join('\n');
  
  // Replace the mappings section
  const beforeMapping = content.substring(0, mappingStart);
  const afterMapping = content.substring(mappingEnd + 2);
  
  const newContent = beforeMapping + 
    'export const productVideoByHandle: Record<string, string> = {\n' +
    '  // Auto-generated mappings from ceyloe.com\n' +
    newMappings + '\n' +
    '};' +
    afterMapping;
  
  fs.writeFileSync(CONFIG_FILE, newContent, 'utf-8');
  console.log('✅ Video mappings updated!\n');
}

/**
 * Main function
 */
async function main() {
  console.log('🎥 Ceyloe Sapphire Video Downloader\n');
  console.log('='.repeat(50));
  console.log('\n');
  
  const productUrls = await getAllProductUrls();
  
  if (productUrls.length === 0) {
    console.log('❌ No products found');
    return;
  }
  
  console.log('Downloading videos...\n');
  console.log('='.repeat(50));
  console.log('\n');
  
  const videoMappings = [];
  
  for (const productUrl of productUrls) {
    const result = await downloadProductVideo(productUrl);
    if (result) {
      videoMappings.push(result);
    }
    
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Total products: ${productUrls.length}`);
  console.log(`   Videos downloaded: ${videoMappings.length}`);
  console.log(`   Videos saved to: ${OUTPUT_DIR}`);
  
  if (videoMappings.length > 0) {
    updateVideoMappings(videoMappings);
    console.log('\n💡 Restart your dev server to see the videos!');
  }
  
  console.log('\n✨ Done!\n');
}

// Run the script
main().catch(console.error);
