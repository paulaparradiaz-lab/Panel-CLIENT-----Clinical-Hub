import { VistaSeccion } from '@/componentes/VistaSeccion';

// La portada está en el mismo nivel del marco, así que su título se escribe completo.
export const metadata = { title: { absolute: 'Mis favoritos · Clinical Hub' } };

export default function Page() {
  return <VistaSeccion id="favoritos" />;
}
