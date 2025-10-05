/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // Habilitar standalone para Docker (optimiza el tamaño de la imagen)
  output: 'standalone',
}

module.exports = nextConfig
