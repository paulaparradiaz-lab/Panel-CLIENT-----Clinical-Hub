'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MENU, type Seccion } from '@/lib/datos';
import { Cuenta } from './Cuenta';
import { Icono } from './Iconos';

// El menú verde. En computador, al costado; en celular, la misma hoja sube desde abajo
// y se cierra con la agarradera, tocando el velo, con Esc o al elegir una sección
// (abrir o cerrar Guías no la cierra).
export function MenuLateral({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const ruta = usePathname();
  // Una rama está abierta si contiene la página actual, salvo que la persona la haya
  // cerrado con un clic en su grupo. Al cambiar de página se reinicia.
  const [cerrados, setCerrados] = useState<Set<string>>(new Set());
  useEffect(() => setCerrados(new Set()), [ruta]);

  useEffect(() => {
    if (!abierto) return;
    // Espera a que la hoja se muestre (la clase del body va en el efecto del marco).
    const t = setTimeout(() => document.getElementById('cerrar-menu')?.focus(), 50);
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', esc);
    return () => { clearTimeout(t); document.removeEventListener('keydown', esc); };
  }, [abierto, onCerrar]);

  const dentroDe = (s: Seccion) => ruta === s.ruta || ruta.startsWith(s.ruta + '/');

  const item = (s: Seccion, sub: boolean) => {
    const clase = `ch-menu-item${sub ? ' sub' : ''}`;
    const contenido = (
      <>
        {s.icono && <Icono id={s.icono} />}
        {s.proximamente
          // Bloqueada: el nombre en su línea y «Próximamente» debajo, en chico
          ? <span className="ch-menu-nombre"><span className="ch-menu-texto">{s.nombre}</span><span className="ch-menu-pronto">Próximamente</span></span>
          : <span className="ch-menu-nombre">{s.nombre}</span>}
        {s.nuevo && <span className="ch-menu-nuevo">New</span>}
        {s.hijos && <Icono id="flecha" className="ch-menu-flecha" />}
      </>
    );
    // Bloqueada: se ve, pero no es un enlace.
    if (s.proximamente) return <li key={s.id}><span className={`${clase} ch-menu-bloqueado`} aria-disabled="true">{contenido}</span></li>;
    const actual = ruta === s.ruta ? 'page' : undefined;
    if (!s.hijos) return <li key={s.id}><Link className={clase} href={s.ruta} aria-current={actual} onClick={onCerrar}>{contenido}</Link></li>;

    // Grupo: abierto se cierra sin salir de la página; cerrado se abre (y lleva a su sección).
    const abierta = dentroDe(s) && !cerrados.has(s.ruta);
    const clic = (e: React.MouseEvent) => {
      if (abierta) { e.preventDefault(); setCerrados(c => new Set(c).add(s.ruta)); }
      else if (ruta === s.ruta) { e.preventDefault(); setCerrados(c => { const n = new Set(c); n.delete(s.ruta); return n; }); }
    };
    return (
      <li key={s.id} className={`ch-menu-grupo${abierta ? ' abierto' : ''}`}>
        <Link className={clase} href={s.ruta} aria-current={actual} aria-expanded={abierta} aria-controls={`rama-${s.id}`} onClick={clic}>{contenido}</Link>
        <ul className="ch-menu-rama" id={`rama-${s.id}`}>{s.hijos.map(h => item(h, true))}</ul>
      </li>
    );
  };

  return (
    <>
      <div className="ch-menu-velo" id="velo-menu" hidden={!abierto} onClick={onCerrar} />
      <aside className="ch-menu" id="menu-lateral">
        <button type="button" className="ch-boton-redondo ch-cerrar-menu" id="cerrar-menu" aria-label="Cerrar el menú" onClick={onCerrar}>
          <Icono id="cerrar" />
        </button>
        <nav aria-label="Secciones">
          <ul className="ch-menu-lista" id="menu">{MENU.map(s => item(s, false))}</ul>
        </nav>
        <Cuenta onNavegar={onCerrar} />
      </aside>
    </>
  );
}
