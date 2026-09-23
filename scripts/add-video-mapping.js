/**
 * Helper script to add video URL mappings for products
 * 
 * After downloading videos from ceyloe.com, use this script to add them
 * to the productVideoByHandle mapping in ceyloe-youtube-videos.ts
 * 
 * Usage:
 * 1. Download video(s) to public/videos/gemstones/
 * 2. Run: node scripts/add-video-mapping.js <handle> <video-filename>
 * 
 * Example:
 * node scripts/add-video-mapping.js "1-10-ct-natural-blue-sapphire" "blue-sapphire-1-10ct.mp4"
 */

const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '..', 'src', 'config', 'ceyloe-youtube-videos.ts');

function addVideoMapping(handle, videoFilename) {
  // Read the config file
  let content = fs.readFileSync(CONFIG_FILE, 'utf-8');
  
  // Check if the handle already exists
  if (content.includes(`"${handle}"`)) {
    console.log(`⚠️  Warning: Handle "${handle}" already exists in the mapping.`);
    console.log('   Update it manually if you want to change the video.');
    return;
  }
  
  // Find the closing brace of productVideoByHandle
  const videoPath = `/videos/gemstones/${videoFilename}`;
  const newMapping = `  "${handle}": "${videoPath}",`;
  
  // Find the last entry in productVideoByHandle and add after it
  const regex = /(\/\/ Downloaded videos from ceyloe\.com\n.*\n)/;
  
  if (regex.test(content)) {
    // Add after the comment
    content = content.replace(
      regex,
      `$1${newMapping}\n`
    );
  } else {
    // Add before the closing brace
    content = content.replace(
      /(\n};)/,
      `\n  \n  // Downloaded videos from ceyloe.com\n${newMapping}\n};`
    );
  }
  
  // Write back
  fs.writeFileSync(CONFIG_FILE, content, 'utf-8');
  console.log(`✅ Added video mapping:`);
  console.log(`   Handle: ${handle}`);
  console.log(`   Video: ${videoPath}`);
}

function listCurrentMappings() {
  const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
  const matches = content.match(/"([^"]+)":\s*"([^"]+)"/g);
  
  console.log('\n📹 Current Video Mappings:\n');
  if (matches) {
    matches.forEach(match => {
      const [, handle, url] = match.match(/"([^"]+)":\s*"([^"]+)"/);
      const isLocal = url.startsWith('/videos/');
      console.log(`  ${isLocal ? '📁' : '🎥'} ${handle}`);
      console.log(`     → ${url}`);
    });
  }
  console.log('');
}

// Main
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === '--list' || args[0] === '-l') {
  listCurrentMappings();
} else if (args.length === 2) {
  const [handle, videoFilename] = args;
  
  // Verify video file exists
  const videoPath = path.join(__dirname, '..', 'public', 'videos', 'gemstones', videoFilename);
  if (!fs.existsSync(videoPath)) {
    console.error(`❌ Error: Video file not found at: ${videoPath}`);
    console.error('   Make sure you downloaded the video first.');
    process.exit(1);
  }
  
  addVideoMapping(handle, videoFilename);
  console.log('\n💡 Tip: Restart your dev server to see the changes.');
} else {
  console.log('Usage:');
  console.log('  node scripts/add-video-mapping.js <handle> <video-filename>');
  console.log('  node scripts/add-video-mapping.js --list');
  console.log('');
  console.log('Example:');
  console.log('  node scripts/add-video-mapping.js "1-10-ct-natural-blue-sapphire" "blue-sapphire-1-10ct.mp4"');
  process.exit(1);
}
