/**
 * Fix corrupted (0 byte) video files by re-downloading from ceyloe.com
 * 
 * Usage: node scripts/fix-corrupted-videos.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'videos', 'gemstones');

/**
 * Fetch HTML from URL
 */
function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
      res.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Download file from URL
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
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
 * Extract video URL from HTML
 */
function extractVideoUrl(html) {
  const videoMatch = html.match(/<video[^>]*>[\s\S]*?<source[^>]+src=["']([^"']+)["']/i) ||
                     html.match(/<video[^>]+src=["']([^"']+)["']/i);
  
  if (videoMatch && videoMatch[1]) {
    // Remove query parameters like ?_=1
    return videoMatch[1].split('?')[0];
  }
  return null;
}

/**
 * Main function
 */
async function main() {
  console.log('🔧 Fixing Corrupted Videos\n');
  console.log('='.repeat(50));
  console.log('\n');
  
  // Find all 0-byte video files
  const files = fs.readdirSync(OUTPUT_DIR);
  const corruptedFiles = files.filter(file => {
    const filePath = path.join(OUTPUT_DIR, file);
    const stats = fs.statSync(filePath);
    return stats.size === 0 && file.endsWith('.mp4');
  });
  
  if (corruptedFiles.length === 0) {
    console.log('✅ No corrupted videos found!');
    return;
  }
  
  console.log(`Found ${corruptedFiles.length} corrupted videos (0 bytes)\n`);
  
  let fixed = 0;
  let failed = 0;
  
  for (const filename of corruptedFiles) {
    const handle = filename.replace('.mp4', '');
    const productUrl = `https://ceyloe.com/product/${handle}/`;
    
    console.log(`📦 ${handle}`);
    
    try {
      // Fetch product page
      const html = await fetchHTML(productUrl);
      const videoUrl = extractVideoUrl(html);
      
      if (!videoUrl) {
        console.log(`  ⚠️  No video URL found`);
        failed++;
        continue;
      }
      
      // Download video
      console.log(`  📥 Downloading from: ${videoUrl}`);
      const outputPath = path.join(OUTPUT_DIR, filename);
      await downloadFile(videoUrl, outputPath);
      
      // Verify download
      const stats = fs.statSync(outputPath);
      if (stats.size > 0) {
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
        console.log(`  ✅ Downloaded: ${sizeMB} MB`);
        fixed++;
      } else {
        console.log(`  ❌ Still 0 bytes`);
        failed++;
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      failed++;
    }
    
    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('\n📊 Summary:');
  console.log(`   Corrupted: ${corruptedFiles.length}`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Failed: ${failed}`);
  
  if (fixed > 0) {
    console.log('\n✨ Done! Refresh your browser to see the videos.');
  }
  
  console.log('');
}

main().catch(console.error);
