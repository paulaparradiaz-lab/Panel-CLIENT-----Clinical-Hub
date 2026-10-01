import { TerminosYPoliticas } from '@/componentes/cuenta/TerminosYPoliticas';
import { Pagina } from '@/componentes/Pagina';

export const metadata = { title: 'Términos y políticas' };

export default function Page() {
  return <Pagina titulo="Términos y políticas" bajada="Los documentos que aceptaste para usar Clinical Hub."><TerminosYPoliticas /></Pagina>;
}
