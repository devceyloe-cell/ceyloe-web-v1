/**
 * Script to download gemstone videos from ceyloe.com
 * 
 * This script:
 * 1. Fetches product pages from ceyloe.com
 * 2. Extracts video URLs from each product
 * 3. Downloads videos to public/videos/gemstones/
 * 
 * Usage: node scripts/download-ceyloe-videos.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Configuration
const BASE_URL = 'https://ceyloe.com';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'videos', 'gemstones');
const CATEGORIES = [
  '/product-category/gemstones/blue-sapphires/',
  '/product-category/gemstones/yellow-sapphire/',
  '/product-category/gemstones/pink-sapphire/',
  '/product-category/gemstones/white-sapphires/',
  '/product-category/gemstones/padparadscha-sapphire/',
  '/product-category/gemstones/teal-sapphire/',
  '/product-category/gemstones/spinel/',
  '/product-category/gemstones/garnet/',
  '/product-category/gemstones/zircon/',
  '/product-category/gemstones/tourmaline/',
  '/product-category/gemstones/other-gemstone/',
];

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Fetch HTML content from a URL
 */
async function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

/**
 * Download a file from URL
 */
async function downloadFile(url, outputPath) {
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
 * Extract video URL from product page HTML
 */
function extractVideoUrl(html) {
  const dom = new JSDOM(html);
  const videoElement = dom.window.document.querySelector('video source, video');
  if (videoElement) {
    return videoElement.src || videoElement.getAttribute('src');
  }
  return null;
}

/**
 * Get all product URLs from a category page
 */
async function getProductUrlsFromCategory(categoryUrl) {
  console.log(`Fetching category: ${categoryUrl}`);
  const html = await fetchHTML(BASE_URL + categoryUrl);
  const dom = new JSDOM(html);
  const productLinks = dom.window.document.querySelectorAll('a[href*="/product/"]');
  
  const urls = new Set();
  productLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.includes('/product/')) {
      urls.add(href);
    }
  });
  
  return Array.from(urls);
}

/**
 * Download video from a product page
 */
async function downloadProductVideo(productUrl) {
  try {
    console.log(`Fetching product: ${productUrl}`);
    const html = await fetchHTML(productUrl);
    const videoUrl = extractVideoUrl(html);
    
    if (!videoUrl) {
      console.log(`  No video found for ${productUrl}`);
      return null;
    }
    
    // Generate filename from product URL
    const productSlug = productUrl.split('/product/')[1]?.replace('/', '') || 'unknown';
    const videoFilename = `${productSlug}.mp4`;
    const outputPath = path.join(OUTPUT_DIR, videoFilename);
    
    // Skip if already downloaded
    if (fs.existsSync(outputPath)) {
      console.log(`  ✓ Already downloaded: ${videoFilename}`);
      return outputPath;
    }
    
    console.log(`  Downloading video: ${videoUrl}`);
    await downloadFile(videoUrl, outputPath);
    console.log(`  ✓ Downloaded: ${videoFilename}`);
    
    return outputPath;
  } catch (error) {
    console.error(`  ✗ Error downloading ${productUrl}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Starting video download from ceyloe.com...\n');
  
  const allProductUrls = new Set();
  
  // Get all product URLs from categories
  for (const category of CATEGORIES) {
    try {
      const productUrls = await getProductUrlsFromCategory(category);
      productUrls.forEach(url => allProductUrls.add(url));
      console.log(`  Found ${productUrls.length} products in ${category}`);
    } catch (error) {
      console.error(`Error fetching category ${category}:`, error.message);
    }
  }
  
  console.log(`\nTotal unique products found: ${allProductUrls.size}\n`);
  
  // Download videos from all products
  let successCount = 0;
  let errorCount = 0;
  
  for (const productUrl of allProductUrls) {
    const result = await downloadProductVideo(productUrl);
    if (result) {
      successCount++;
    } else {
      errorCount++;
    }
    
    // Add small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== Download Complete ===');
  console.log(`Successfully downloaded: ${successCount} videos`);
  console.log(`Errors or no video: ${errorCount}`);
  console.log(`Videos saved to: ${OUTPUT_DIR}`);
}

// Run the script
main().catch(console.error);
