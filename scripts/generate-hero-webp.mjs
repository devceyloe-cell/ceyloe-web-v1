/**
 * Generates responsive WebP hero images (desktop / tablet / mobile).
 * Sources: public/images/Home/1.jpg … 7.jpg
 * Run: node scripts/generate-hero-webp.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "hero");
const homeDir = path.join(root, "public", "images", "Home");

const SIZES = {
  desktop: { width: 1920, height: 900 },
  tablet: { width: 1200, height: 700 },
  mobile: { width: 800, height: 1200 },
};

const QUALITY = 80;
const SLIDE_NUMBERS = [1, 2, 3, 4, 5, 6, 7];

async function loadSource(source) {
  return fs.readFile(source);
}

async function generateSlide(slide) {
  const input = await loadSource(slide.source);
  const base = `slide-${slide.id}`;
  const meta = await sharp(input).metadata();
  const isLandscape = meta.width && meta.height ? meta.width / meta.height >= 1.2 : true;
  const position = isLandscape ? "centre" : "attention";

  for (const [variant, { width, height }] of Object.entries(SIZES)) {
    const output = path.join(outDir, `${base}-${variant}.webp`);
    await sharp(input)
      .resize(width, height, { fit: "cover", position })
      .webp({ quality: QUALITY })
      .toFile(output);
    const stat = await fs.stat(output);
    console.log(`  ${path.basename(output)} (${Math.round(stat.size / 1024)} KB)`);
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  /** @type {{ id: number; source: string }[]} */
  const slides = [];
  for (const n of SLIDE_NUMBERS) {
    const source = path.join(homeDir, `${n}.jpg`);
    try {
      await fs.access(source);
      slides.push({ id: n, source });
    } catch {
      console.warn(`Skipping ${n}.jpg — file not found`);
    }
  }

  if (slides.length === 0) {
    throw new Error("No carousel source images found in public/images/Home/");
  }

  console.log("Generating hero WebP images...\n");

  for (const slide of slides) {
    console.log(`Slide ${slide.id} (${path.basename(slide.source)}):`);
    await generateSlide(slide);
    console.log("");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
