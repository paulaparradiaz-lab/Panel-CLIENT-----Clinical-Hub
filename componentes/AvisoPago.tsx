'use client';

import { useEffect, useState } from 'react';
import { CUENTA } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';
import { Icono } from './Iconos';
import { useVentanas } from './Ventanas';

// Solo con el pago atrasado (sigue con acceso) y solo en Mis favoritos, que es donde se entra.
// Se cierra con la X y no vuelve hasta la próxima vez que entre.
const CLAVE = 'ch-aviso-pago-cerrado';

export function AvisoPago() {
  const { estado } = useSesion();
  const { abrir } = useVentanas();
  const [cerrado, setCerrado] = useState(true);
  useEffect(() => { try { setCerrado(sessionStorage.getItem(CLAVE) === '1'); } catch { setCerrado(false); } }, []);

  if (estado !== 'atrasada' || cerrado) return null;
  const cerrar = () => { try { sessionStorage.setItem(CLAVE, '1'); } catch {} setCerrado(true); };
  return (
    <div className="ch-aviso-pago" role="status">
      <p>Tu último pago no se pudo procesar.<span className="ch-aviso-pago-mas"> Se intentará de nuevo; si quieres, revisa tu medio de pago para que todo siga al día.</span>
        <a href={CUENTA.suscripcion} onClick={e => { e.preventDefault(); abrir('suscripcion'); }}>Revisar mi pago</a></p>
      <button type="button" className="ch-aviso-pago-cerrar" aria-label="Cerrar el aviso de pago" onClick={cerrar}><Icono id="cerrar" /></button>
    </div>
  );
}
