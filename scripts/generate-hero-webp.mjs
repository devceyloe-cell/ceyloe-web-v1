/**
 * Generates responsive WebP hero images (desktop / tablet / mobile).
 * Run: node scripts/generate-hero-webp.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public", "images", "hero");
const sourceDir = path.join(outDir, "source");

const SIZES = {
  desktop: { width: 1920, height: 900 },
  tablet: { width: 1200, height: 700 },
  mobile: { width: 800, height: 1200 },
};

const QUALITY = 80;

/** @type {{ id: number; source: string }[]} */
const slides = [
  {
    id: 1,
    source: path.join(sourceDir, "newcarousel1_.jpeg"),
  },
  {
    id: 2,
    source: path.join(sourceDir, "newcarousel2_.jpeg"),
  },
  {
    id: 3,
    source: path.join(sourceDir, "newcarousel3_.jpeg"),
  },
  {
    id: 4,
    source: path.join(sourceDir, "imgi_2_yuiiuyiyui.jpg"),
  },
];

async function loadSource(source) {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`Failed to fetch ${source}: ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return fs.readFile(source);
}

async function generateSlide(slide) {
  const input = await loadSource(slide.source);
  const base = `slide-${slide.id}`;

  for (const [variant, { width, height }] of Object.entries(SIZES)) {
    const output = path.join(outDir, `${base}-${variant}.webp`);
    await sharp(input)
      .resize(width, height, { fit: "cover", position: "centre" })
      .webp({ quality: QUALITY })
      .toFile(output);
    const stat = await fs.stat(output);
    console.log(`  ${path.basename(output)} (${Math.round(stat.size / 1024)} KB)`);
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  console.log("Generating hero WebP images...\n");

  for (const slide of slides) {
    console.log(`Slide ${slide.id}:`);
    await generateSlide(slide);
    console.log("");
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
