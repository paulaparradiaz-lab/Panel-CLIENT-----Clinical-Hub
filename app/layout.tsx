import type { Metadata, Viewport } from 'next';
import { Marco } from '@/componentes/Marco';
import { SesionProvider } from '@/lib/sesion';
import '@/estilos/clinical-hub.css';
import '@/estilos/panel.css';

export const metadata: Metadata = {
  title: { default: 'Clinical Hub', template: '%s · Clinical Hub' },
  // El favicon (CH en lima sobre círculo verde) y su versión en imagen para Safari y el iPhone
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' }, apple: '/apple-touch-icon.png' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// El marco envuelve todas las páginas: cada vista solo llena el centro.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <head>
        {/* La letra del manual (Plus Jakarta Sans) y la del código (IBM Plex Mono). Va aquí porque Next
            descarta el @import del inicio de clinical-hub.css al empaquetar los estilos. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=IBM+Plex+Mono:wght@400;500&display=swap" />
      </head>
      <body className="ch ch-panel">
        <SesionProvider>
          <Marco>{children}</Marco>
        </SesionProvider>
      </body>
    </html>
  );
}
