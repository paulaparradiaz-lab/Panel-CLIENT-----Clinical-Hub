import type { NextConfig } from 'next';
import { BLOQUEADAS } from './lib/datos';

const nextConfig: NextConfig = {
  devIndicators: false,   // sin el botón de Next en la esquina mientras se prueba
  // Las secciones con «Próximamente» no se abren ni escribiendo su dirección.
  async redirects() {
    return BLOQUEADAS.map(source => ({ source, destination: '/', permanent: false }));
  },
};

export default nextConfig;
