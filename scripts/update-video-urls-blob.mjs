/**
 * Update video URLs in ceyloe-youtube-videos.ts to use Vercel Blob URLs
 * 
 * Run this after uploading videos to Vercel Blob
 * Usage: node scripts/update-video-urls-blob.mjs
 */

import { readFile, writeFile } from 'fs/promises';

const CONFIG_FILE = './src/config/ceyloe-youtube-videos.ts';
const MAPPING_FILE = './scripts/blob-video-mapping.json';

async function updateVideoUrls() {
  console.log('📝 Updating video URLs to use Vercel Blob...\n');

  try {
    // Read blob mapping
    const mappingData = await readFile(MAPPING_FILE, 'utf-8');
    const blobUrls = JSON.parse(mappingData);

    console.log(`Found ${Object.keys(blobUrls).length} Blob URLs\n`);

    // Read current config
    let config = await readFile(CONFIG_FILE, 'utf-8');

    // Update each URL
    let updateCount = 0;
    for (const [handle, blobUrl] of Object.entries(blobUrls)) {
      const oldPath = `/videos/gemstones/${handle}.mp4`;
      const regex = new RegExp(`"${handle}":\\s*"${oldPath.replace(/\//g, '\\/')}"`, 'g');
      
      if (config.match(regex)) {
        config = config.replace(regex, `"${handle}": "${blobUrl}"`);
        updateCount++;
        console.log(`✓ Updated: ${handle}`);
      }
    }

    // Write updated config
    await writeFile(CONFIG_FILE, config, 'utf-8');

    console.log(`\n✅ Updated ${updateCount} video URLs to use Vercel Blob`);
    console.log('\n💡 Next steps:');
    console.log('1. Review changes: git diff src/config/ceyloe-youtube-videos.ts');
    console.log('2. Test locally: npm run dev');
    console.log('3. Commit: git add . && git commit -m "Update video URLs to Vercel Blob"');
    console.log('4. Deploy: vercel --prod');

  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Error: blob-video-mapping.json not found');
      console.log('\nRun the upload script first:');
      console.log('node scripts/upload-to-vercel-blob.mjs');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

updateVideoUrls();
