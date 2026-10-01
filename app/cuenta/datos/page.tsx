import { MisDatos } from '@/componentes/cuenta/MisDatos';
import { Pagina } from '@/componentes/Pagina';

export const metadata = { title: 'Mis datos' };

export default function Page() {
  return <Pagina titulo="Mis datos" bajada="Tu nombre y tu especialidad, como se ven en Clinical Hub."><MisDatos /></Pagina>;
}
