const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'src/assets');
const dest = path.join(__dirname, 'public/assets');

console.log(`Copying from ${src} to ${dest}`);

try {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
    console.log('Created dest dir');
  }

  const files = fs.readdirSync(src);
  let count = 0;
  files.forEach((file) => {
    if (file.endsWith('.svg')) {
      fs.copyFileSync(path.join(src, file), path.join(dest, file));
      count++;
    }
  });
  console.log(`Successfully copied ${count} SVG files.`);
} catch (error) {
  console.error('Error copying assets:', error);
  process.exit(1);
}
