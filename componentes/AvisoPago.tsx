'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CUENTA } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';
import { Icono } from './Iconos';

// Solo con el pago atrasado (sigue con acceso) y solo en Mis favoritos, que es donde se entra.
// Se cierra con la X y no vuelve hasta la próxima vez que entre.
const CLAVE = 'ch-aviso-pago-cerrado';

export function AvisoPago() {
  const { estado } = useSesion();
  const [cerrado, setCerrado] = useState(true);
  useEffect(() => { try { setCerrado(sessionStorage.getItem(CLAVE) === '1'); } catch { setCerrado(false); } }, []);

  if (estado !== 'atrasada' || cerrado) return null;
  const cerrar = () => { try { sessionStorage.setItem(CLAVE, '1'); } catch {} setCerrado(true); };
  return (
    <div className="ch-aviso-pago" role="status">
      <p>Tu último pago no se pudo procesar.<span className="ch-aviso-pago-mas"> Se intentará de nuevo; si quieres, revisa tu medio de pago para que todo siga al día.</span>
        <Link href={CUENTA.suscripcion}>Revisar mi pago</Link></p>
      <button type="button" className="ch-aviso-pago-cerrar" aria-label="Cerrar el aviso de pago" onClick={cerrar}><Icono id="cerrar" /></button>
    </div>
  );
}
