import type { Metadata } from 'next';
import { seccion } from '@/lib/datos';
import { Pagina } from './Pagina';

// Las secciones del menú que todavía no tienen su vista: solo el título y la bajada.
// Cada una se arma con Paula, una por una.
export const metadataDe = (id: string): Metadata => ({ title: seccion(id).nombre });

export function VistaSeccion({ id }: { id: string }) {
  const s = seccion(id);
  return <Pagina titulo={s.nombre} bajada={s.bajada} />;
}
