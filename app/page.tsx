import { VistaSeccion, metadataDe } from '@/componentes/VistaSeccion';

export const metadata = metadataDe('favoritos');

export default function Page() {
  return <VistaSeccion id="favoritos" />;
}
