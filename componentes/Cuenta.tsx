'use client';

import { useEffect, useRef, useState } from 'react';
import { whatsapp } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { Icono } from './Iconos';
import { useVentanas, type NombreVentana } from './Ventanas';

// La cuenta al pie del menú, con el nombre y la especialidad. Una sola pieza: al
// abrirla, la fila crece hacia arriba y muestra las opciones adentro.
// Se cierra con un clic afuera o con Esc.
export function Cuenta({ onNavegar }: { onNavegar: () => void }) {
  const { usuario, nombre, especialidad } = useSesion();
  const { abrir } = useVentanas();
  const [abierta, setAbierta] = useState(false);
  const caja = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierta) return;
    const t = setTimeout(() => caja.current?.querySelector<HTMLElement>('.ch-cuenta-opcion')?.focus({ preventScroll: true }), 50);
    const afuera = (e: MouseEvent) => { if (!caja.current?.contains(e.target as Node)) setAbierta(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setAbierta(false); boton.current?.focus(); } };
    document.addEventListener('click', afuera);
    document.addEventListener('keydown', esc);
    return () => { clearTimeout(t); document.removeEventListener('click', afuera); document.removeEventListener('keydown', esc); };
  }, [abierta]);

  // Mis datos, Suscripción y Términos se abren en una ventana; antes se cierra la cuenta
  // (y, en celular, la hoja del menú).
  const elegir = (n: NombreVentana) => { setAbierta(false); onNavegar(); abrir(n); };
  // Ayuda: WhatsApp de soporte con el mensaje listo (con el correo de ingreso, si ya entró).
  const ayuda = whatsapp(usuario?.email
    ? `Hola, equipo de Clinical Hub. Necesito ayuda con mi cuenta; mi correo de ingreso es ${usuario.email}.`
    : 'Hola, equipo de Clinical Hub. Necesito ayuda con mi cuenta.');

  return (
    <div className={`ch-cuenta ch-cuenta-pie${abierta ? ' abierta' : ''}`} ref={caja}>
      <div className="ch-cuenta-despliegue" id="cuenta-opciones">
        <div className="ch-cuenta-opciones">
          <button type="button" className="ch-cuenta-opcion" onClick={() => elegir('datos')}>Mis datos</button>
          <button type="button" className="ch-cuenta-opcion" onClick={() => elegir('suscripcion')}>Suscripción</button>
          <button type="button" className="ch-cuenta-opcion" onClick={() => elegir('terminos')}>Términos y políticas</button>
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
