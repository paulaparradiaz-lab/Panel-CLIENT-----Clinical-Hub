'use client';

import { ESTADOS, fechaLarga } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';

// Suscripción: ficha de plan, cupón, estado y fecha. Con el pago pendiente, la nota y el botón a Hotmart.
export function Suscripcion() {
  const { cuenta, estado, simulado } = useSesion();
  const e = (estado && ESTADOS[estado]) || { nombre: '[Estado]' };
  const sinCompra = estado === 'cortesia' || estado === 'cofundador';
  const plan = sinCompra ? null : cuenta?.plan || '[Plan]';
  // En la simulación, la fecha es dentro de un mes (como un plan mensual) y el cupón muestra su lugar.
  const vence = cuenta?.vence || (simulado ? Date.now() + 30 * 864e5 : null);
  const cupon = cuenta?.cupon || (simulado && plan ? '[Cupón]' : null);   // el del último pago (Hotmart: offer.coupon_code)

  return (
    <>
      <dl className="ch-ficha">
        {plan && <div><dt>Plan</dt><dd>{plan}</dd></div>}
        {cupon && <div><dt>Cupón</dt><dd>{cupon}</dd></div>}
        <div><dt>Estado</dt><dd><span className={`ch-etq${e.etq ? ' ' + e.etq : ''}`}>{e.nombre}</span></dd></div>
        {e.fecha && <div><dt>{e.fecha}</dt><dd>{vence ? fechaLarga(vence) : '[fecha]'}</dd></div>}
      </dl>
      {estado === 'atrasada' && (
        <div className="ch-ficha-nota">
          <p>Tu último pago no se pudo procesar. Se intentará de nuevo; si quieres, actualiza tu medio de pago.</p>
          {/* href: [ENLACE DE HOTMART] */}
          <a className="ch-boton" href="#">Ir a pagar</a>
        </div>
      )}
    </>
  );
}
