import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';

const INPUT_DIR = './public/images/profile';
const OUTPUT_DIR = './public/images/profile-optimized';

async function optimizeImages() {
  try {
    // Create output directory
    await mkdir(OUTPUT_DIR, { recursive: true });

    // Get all image files
    const files = await readdir(INPUT_DIR);
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

    console.log(`Found ${imageFiles.length} images to optimize...`);

    for (const file of imageFiles) {
      const inputPath = join(INPUT_DIR, file);
      const nameWithoutExt = basename(file, extname(file));

      // Generate WebP version (best compression)
      const webpPath = join(OUTPUT_DIR, `${nameWithoutExt}.webp`);
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover' }) // Resize to max needed size
        .webp({ quality: 80 })
        .toFile(webpPath);

      // Generate fallback JPEG version
      const jpegPath = join(OUTPUT_DIR, `${nameWithoutExt}.jpg`);
      await sharp(inputPath)
        .resize(400, 400, { fit: 'cover' })
        .jpeg({ quality: 80, progressive: true })
        .toFile(jpegPath);

      console.log(`✓ Optimized: ${file}`);
    }

    console.log('\n✅ All images optimized!');
    console.log(`Output directory: ${OUTPUT_DIR}`);
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
