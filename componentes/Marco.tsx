'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSesion } from '@/lib/sesion';
import { Aceptar } from './Aceptar';
import { AvisoPago } from './AvisoPago';
import { Cabecera } from './Cabecera';
import { Entrar } from './Entrar';
import { Iconos } from './Iconos';
import { MenuLateral } from './MenuLateral';
import { OfrecerPasskey } from './OfrecerPasskey';
import { Ventanas } from './Ventanas';

// El marco: lo que se queda quieto en todas las páginas (cabecera, menú, cuenta) y lo que
// lo protege (entrar, firmar los documentos). Cada vista se pinta en el centro.
export function Marco({ children }: { children: React.ReactNode }) {
  const s = useSesion();
  const ruta = usePathname();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [ofrecer, setOfrecer] = useState(false);
  const abiertoRef = useRef(false);
  abiertoRef.current = menuAbierto;

  // Al cerrar la hoja del menú en celular, el foco vuelve al botón que la abrió.
  const cerrarMenu = useCallback(() => {
    if (!abiertoRef.current) return;
    setMenuAbierto(false);
    if (document.getElementById('menu-lateral')?.contains(document.activeElement)) document.getElementById('abrir-menu')?.focus();
  }, []);

  const entrar = s.listo && !s.dentro;
  // Cuando la persona entra, la tarjeta se queda un momento con el check verde
  const [despedida, setDespedida] = useState(false);
  const habiaEntrada = useRef(false);
  useEffect(() => {
    if (habiaEntrada.current && !entrar) {
      setDespedida(true);
      const t = setTimeout(() => setDespedida(false), 1400);
      habiaEntrada.current = false;
      return () => clearTimeout(t);
    }
    if (entrar) habiaEntrada.current = true;
  }, [entrar]);
  // Los documentos se pueden leer completos antes de firmar.
  const porFirmar = s.listo && s.dentro && s.firmasLeidas && !s.firma && !ruta.startsWith('/documentos/');

  useEffect(() => { if (s.recienEntro) setOfrecer(true); }, [s.recienEntro]);
  useEffect(() => {
    const b = document.body.classList;
    b.toggle('sin-sesion', entrar || despedida);
    b.toggle('por-aceptar', porFirmar);
    b.toggle('menu-abierto', menuAbierto);
  }, [entrar, despedida, porFirmar, menuAbierto]);

  return (
    <Ventanas>
      <Iconos />
      <Cabecera menuAbierto={menuAbierto} onAbrirMenu={() => setMenuAbierto(true)} />
      <div className="ch-cuerpo">
        <MenuLateral abierto={menuAbierto} onCerrar={cerrarMenu} />
        <main className="ch-contenido">
          <div className="ch-pagina">
            {ruta === '/' && <AvisoPago />}
            {children}
          </div>
        </main>
      </div>
      {(entrar || despedida) && <Entrar exito={despedida} />}
      {porFirmar && <Aceptar onFirmado={() => setOfrecer(true)} />}
      <OfrecerPasskey puede={ofrecer && !!s.firma && s.dentro} />
    </Ventanas>
  );
}
