'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CUENTA, whatsapp } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { Icono } from './Iconos';

// La cuenta al pie del menú, con el nombre y la especialidad. Una sola pieza: al
// abrirla, la fila crece hacia arriba y muestra las opciones adentro.
// Se cierra con un clic afuera o con Esc.
export function Cuenta({ onNavegar }: { onNavegar: () => void }) {
  const { usuario, nombre, especialidad } = useSesion();
  const [abierta, setAbierta] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierta) return;
    const t = setTimeout(() => caja.current?.querySelector('a')?.focus({ preventScroll: true }), 50);
    const afuera = (e: MouseEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierta(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierta(false); boton.current?.focus(); } };
    document.addEventListener('click', afuera);
    document.addEventListener('keydown', esc);
    return () => { clearTimeout(t); document.removeEventListener('click', afuera); document.removeEventListener('keydown', esc); };
  }, [abierta]);

  // Las opciones que llevan a una página cierran la cuenta (y, en celular, la hoja del menú).
  const elegir = () => { setAbierta(false); onNavegar(); };
  // Ayuda: WhatsApp de soporte con el mensaje listo (con el correo de ingreso, si ya entró).
  const ayuda = whatsapp(usuario?.email
    ? `Hola, equipo de Clinical Hub. Necesito ayuda con mi cuenta; mi correo de ingreso es ${usuario.email}.`
    : 'Hola, equipo de Clinical Hub. Necesito ayuda con mi cuenta.');

  return (
    <div className={`ch-cuenta ch-cuenta-pie${abierta ? ' abierta' : ''}`} ref={caja}>
      <div className="ch-cuenta-despliegue" id="cuenta-opciones">
        <div className="ch-cuenta-opciones">
          <Link className="ch-cuenta-opcion" href={CUENTA.datos} onClick={elegir}>Mis datos</Link>
          <Link className="ch-cuenta-opcion" href={CUENTA.suscripcion} onClick={elegir}>Suscripción</Link>
          <Link className="ch-cuenta-opcion" href={CUENTA.terminos} onClick={elegir}>Términos y políticas</Link>
          <a className="ch-cuenta-opcion" href={ayuda} target="_blank" rel="noopener" onClick={() => setAbierta(false)}>Ayuda o contacto</a>
          <button type="button" className="ch-cuenta-opcion ch-cuenta-opcion-salir" onClick={() => { setAbierta(false); sb.auth.signOut(); }}>Cerrar sesión</button>
        </div>
      </div>
      <button type="button" className="ch-cuenta-fila ch-cuenta-boton" ref={boton}
        aria-expanded={abierta} aria-controls="cuenta-opciones" onClick={() => setAbierta(a => !a)}>
        <Icono id="cuenta" />
        <span className="ch-cuenta-fila-texto">{nombre}<small>{especialidad}</small></span>
      </button>
    </div>
  );
}
