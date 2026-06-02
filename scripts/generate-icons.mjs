import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

const BG = '#0f0e0d'
const PANEL = '#1a1a1a'
const GOLD = '#c2a35a'

// Motivo del polittico, centrato nel quadrato 256x256:
// pannello centrale con cuspide, due pannelli laterali, predella alla base.
function polyptychMarkup() {
  return `
    <g>
      <rect x="56" y="84" width="42" height="92" rx="5" fill="${GOLD}" opacity="0.8"/>
      <rect x="158" y="84" width="42" height="92" rx="5" fill="${GOLD}" opacity="0.8"/>
      <path d="M104,176 L104,98 Q104,50 128,50 Q152,50 152,98 L152,176 Z" fill="${GOLD}"/>
      <rect x="56" y="182" width="144" height="24" rx="5" fill="${GOLD}" opacity="0.58"/>
    </g>
  `
}

function iconSvg({ size = 512, padding = 0, rounded = false } = {}) {
  const inner = 256
  const usable = inner - padding * 2
  const scale = usable / inner
  const offset = padding
  const radius = rounded ? inner * 0.18 : 0
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${inner}" height="${inner}" viewBox="0 0 ${inner} ${inner}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${PANEL}"/>
          <stop offset="1" stop-color="${BG}"/>
        </linearGradient>
      </defs>
      <rect width="${inner}" height="${inner}" rx="${radius}" fill="url(#bg)"/>
      <g transform="translate(${offset} ${offset}) scale(${scale})">
        ${polyptychMarkup()}
      </g>
    </svg>
  `)
}

async function render(buffer, size, outName) {
  await sharp(buffer, { density: 384 })
    .resize(size, size, { fit: 'fill' })
    .png()
    .toFile(join(publicDir, outName))
  console.log('  ✓', outName, `${size}x${size}`)
}

async function main() {
  console.log('Genero icone PWA in /public ...')
  // Icone "any" (con angoli quadri, lo smussa il sistema)
  await render(iconSvg({ rounded: false }), 192, 'icon-192.png')
  await render(iconSvg({ rounded: false }), 512, 'icon-512.png')
  // Icona maskable: margine di sicurezza (~20%) per il crop circolare Android
  await render(iconSvg({ padding: 28 }), 512, 'icon-maskable-512.png')
  // Apple touch icon: niente trasparenza, leggero margine
  await render(iconSvg({ padding: 16 }), 180, 'apple-touch-icon.png')
  console.log('Fatto.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
