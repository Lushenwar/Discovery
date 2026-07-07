// Renders the 1200x630 share image from inline SVG via sharp (already a dep
// of the asset pipeline). Run: node scripts/make-og.mjs → public/og.png
import sharp from 'sharp';

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#0a0a0a"/>
  <circle cx="980" cy="140" r="260" fill="rgba(120,140,180,0.10)"/>
  <circle cx="180" cy="540" r="200" fill="rgba(232,230,225,0.05)"/>
  <rect x="72" y="72" width="1056" height="486" fill="none" stroke="rgba(232,230,225,0.18)" stroke-width="2"/>
  <text x="110" y="180" font-family="Arial, sans-serif" font-size="28" letter-spacing="12" fill="rgba(232,230,225,0.55)">RYAN QI</text>
  <text x="104" y="360" font-family="Arial, sans-serif" font-weight="bold" font-size="150" letter-spacing="2" fill="#e8e6e1">VITRINE</text>
  <text x="110" y="460" font-family="Arial, sans-serif" font-size="30" letter-spacing="8" fill="rgba(232,230,225,0.55)">THE LAB — EXPERIMENTS IN 3D &amp; MOTION</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/og.png');
console.log('public/og.png written');
