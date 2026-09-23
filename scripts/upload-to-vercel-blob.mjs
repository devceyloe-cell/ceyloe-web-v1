/**
 * Upload all gemstone videos to Vercel Blob Storage
 * 
 * Usage: 
 * 1. Set environment variable: BLOB_READ_WRITE_TOKEN=your_token
 * 2. Run: node scripts/upload-to-vercel-blob.mjs
 */

import { put, list } from '@vercel/blob';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const VIDEOS_DIR = './public/videos/gemstones';
const BLOB_BASE_URL = 'https://p3pmh1n6wu63k9yi.public.blob.vercel-storage.com';

async function uploadVideos() {
  console.log('🎥 Uploading videos to Vercel Blob Storage...\n');
  console.log('='.repeat(50));
  console.log('');

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ Error: BLOB_READ_WRITE_TOKEN environment variable not set');
    console.log('\nTo get your token:');
    console.log('1. Go to: https://vercel.com/dashboard/stores/store_P3pmh1n6wU63K9Yi');
    console.log('2. Click ".env.local" tab');
    console.log('3. Copy the BLOB_READ_WRITE_TOKEN value');
    console.log('4. Run: $env:BLOB_READ_WRITE_TOKEN="your_token_here"; node scripts/upload-to-vercel-blob.mjs');
    process.exit(1);
  }

  try {
    // Get all video files
    const files = await readdir(VIDEOS_DIR);
    const videoFiles = files.filter(f => f.endsWith('.mp4'));

    console.log(`Found ${videoFiles.length} videos to upload\n`);

    const uploaded = [];
    const failed = [];

    for (const filename of videoFiles) {
      const filepath = join(VIDEOS_DIR, filename);
      
      try {
        console.log(`📤 Uploading: ${filename}`);
        
        // Read file
        const fileBuffer = await readFile(filepath);
        const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);
        
        // Upload to Vercel Blob
        const blob = await put(`videos/${filename}`, fileBuffer, {
          access: 'public',
          addRandomSuffix: false,
        });

        console.log(`   ✅ Uploaded: ${fileSizeMB} MB`);
        console.log(`   URL: ${blob.url}`);
        
        uploaded.push({
          filename,
          url: blob.url,
          size: fileSizeMB,
        });

      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}`);
        failed.push({ filename, error: error.message });
      }

      console.log('');
    }

    // Summary
    console.log('='.repeat(50));
    console.log('\n📊 Upload Summary:');
    console.log(`   Total: ${videoFiles.length}`);
    console.log(`   Uploaded: ${uploaded.length}`);
    console.log(`   Failed: ${failed.length}`);

    if (uploaded.length > 0) {
      console.log('\n✅ Successfully uploaded videos!');
      console.log('\n💡 Next steps:');
      console.log('1. Run: node scripts/update-video-urls-blob.mjs');
      console.log('2. This will update your video mappings to use Blob URLs');
    }

    // Save mapping to file
    const mapping = {};
    uploaded.forEach(({ filename, url }) => {
      const handle = filename.replace('.mp4', '');
      mapping[handle] = url;
    });

    await writeFile(
      './scripts/blob-video-mapping.json',
      JSON.stringify(mapping, null, 2)
    );

    console.log('\n📝 Video mapping saved to: scripts/blob-video-mapping.json');

  } catch (error) {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  }
}

uploadVideos();
