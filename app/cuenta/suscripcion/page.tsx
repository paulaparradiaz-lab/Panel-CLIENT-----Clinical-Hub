import { Suscripcion } from '@/componentes/cuenta/Suscripcion';
import { Pagina } from '@/componentes/Pagina';

export const metadata = { title: 'Suscripción' };

export default function Page() {
  return <Pagina titulo="Suscripción" bajada="Tu plan y el estado de tus pagos."><Suscripcion /></Pagina>;
}
