import type { NextConfig } from 'next';
import { BLOQUEADAS } from './lib/datos';

const nextConfig: NextConfig = {
  devIndicators: false,   // sin el botón de Next en la esquina mientras se prueba
  // Las secciones con «Próximamente» no se abren ni escribiendo su dirección.
  async redirects() {
    return [
      ...BLOQUEADAS.map(source => ({ source, destination: '/', permanent: false })),
      // Algunos navegadores piden /favicon.ico aunque la página diga cuál es el ícono
      { source: '/favicon.ico', destination: '/favicon.svg', permanent: true },
    ];
  },
};

export default nextConfig;
