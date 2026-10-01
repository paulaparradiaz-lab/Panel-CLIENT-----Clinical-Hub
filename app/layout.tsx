import type { Metadata, Viewport } from 'next';
import { Marco } from '@/componentes/Marco';
import { SesionProvider } from '@/lib/sesion';
import '@/estilos/clinical-hub.css';
import '@/estilos/panel.css';

export const metadata: Metadata = {
  title: { default: 'Clinical Hub', template: '%s · Clinical Hub' },
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

// El marco envuelve todas las páginas: cada vista solo llena el centro.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO">
      <body className="ch ch-panel">
        <SesionProvider>
          <Marco>{children}</Marco>
        </SesionProvider>
      </body>
    </html>
  );
}
