import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fontsDir = path.join(__dirname, 'public/fonts');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return get(res.headers.location, headers).then(resolve).catch(reject);
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function downloadBinary(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return downloadBinary(res.headers.location, dest).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', err => { fs.unlinkSync(dest); reject(err); });
  });
}

async function run() {
  const ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const cssUrl = 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Geist+Mono:wght@400;500;600;700&display=swap';

  console.log('Fetching font URLs...');
  const css = await get(cssUrl, { 'User-Agent': ua });

  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  const urlRegex = /src:\s*url\(([^)]+)\)\s*format\('woff2'\)/;
  const familyRegex = /font-family:\s*['"]?([^;'"]+)['"]?;/;
  const weightRegex = /font-weight:\s*(\d+);/;

  const downloads = [];
  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const urlMatch = urlRegex.exec(block);
    const familyMatch = familyRegex.exec(block);
    const weightMatch = weightRegex.exec(block);
    if (urlMatch && familyMatch && weightMatch) {
      const family = familyMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
      const weight = weightMatch[1];
      const url = urlMatch[1];
      const folder = family === 'roboto' ? 'roboto' : 'geist-mono';
      const prefix = family === 'roboto' ? 'Roboto' : 'GeistMono';
      downloads.push({ url, folder, name: `${prefix}-${weight}.woff2` });
    }
  }

  const seen = new Set();
  const unique = downloads.filter(d => {
    if (seen.has(d.name)) return false;
    seen.add(d.name);
    return true;
  });

  console.log(`Found ${unique.length} font files\n`);

  fs.mkdirSync(path.join(fontsDir, 'roboto'), { recursive: true });
  fs.mkdirSync(path.join(fontsDir, 'geist-mono'), { recursive: true });

  for (const font of unique) {
    const dest = path.join(fontsDir, font.folder, font.name);
    await downloadBinary(font.url, dest);
    const kb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`✓ ${font.name} (${kb} KB)`);
  }

  console.log('\n✨ Done!');
}

run().catch(console.error);
