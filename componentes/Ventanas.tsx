'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MisDatos } from './cuenta/MisDatos';
import { Passkeys, ComoFunciona } from './cuenta/Passkeys';
import { Suscripcion } from './cuenta/Suscripcion';
import { TerminosYPoliticas } from './cuenta/TerminosYPoliticas';

// Las cosas de la cuenta se abren en una ventana encima de la página, como en el panel
// del admin, sin salir de donde se está. Se cierran con Cerrar, con Esc o tocando afuera.
export type NombreVentana = 'datos' | 'suscripcion' | 'terminos' | 'passkeys';

const Ctx = createContext<{ abrir: (n: NombreVentana) => void; cerrar: () => void }>({ abrir: () => {}, cerrar: () => {} });
export const useVentanas = () => useContext(Ctx);

export function Ventanas({ children }: { children: React.ReactNode }) {
  const [abierta, setAbierta] = useState<NombreVentana | null>(null);
  const [explicar, setExplicar] = useState(false);   // «¿Cómo funciona?» de la huella
  const origen = useRef<HTMLElement | null>(null);

  const abrir = useCallback((n: NombreVentana) => {
    setAbierta(a => { if (!a) origen.current = document.activeElement as HTMLElement; return n; });
  }, []);
  // Al cerrar, el foco vuelve a donde estaba (o al botón de la cuenta, si eso ya no se ve).
  const cerrar = useCallback(() => {
    setAbierta(null);
    setTimeout(() => {
      const o = origen.current;
      if (o && o.offsetParent) o.focus(); else document.querySelector<HTMLElement>('.ch-cuenta-boton')?.focus();
    }, 0);
  }, []);

  return (
    <Ctx.Provider value={{ abrir, cerrar }}>
      {children}
      {abierta === 'datos' && (
        <Ventana titulo="Mis datos" bajada="Tu nombre y tu especialidad, como se ven en Clinical Hub." onCerrar={cerrar}
          botones={<button type="button" className="ch-boton secundario ancho" onClick={cerrar}>Cerrar</button>}>
          <MisDatos />
        </Ventana>
      )}
      {abierta === 'passkeys' && (
        <Ventana titulo="Huella o Face ID" bajada="Entra con tu huella, Face ID o el PIN de tu dispositivo, sin esperar el correo." onCerrar={cerrar}
          extra={<ComoFunciona abierto={explicar} onCambiar={() => setExplicar(x => !x)} />}
          botones={<button type="button" className="ch-boton secundario ancho" onClick={() => abrir('datos')}>Volver</button>}>
          <Passkeys explicar={explicar} />
        </Ventana>
      )}
      {abierta === 'suscripcion' && (
        <Ventana titulo="Suscripción" bajada="Tu plan y el estado de tus pagos." onCerrar={cerrar}
          botones={<button type="button" className="ch-boton secundario ancho" onClick={cerrar}>Cerrar</button>}>
          <Suscripcion />
        </Ventana>
      )}
      {abierta === 'terminos' && (
        <Ventana titulo="Términos y políticas" bajada="Los documentos que aceptaste para usar Clinical Hub." onCerrar={cerrar}
          botones={<button type="button" className="ch-boton secundario ancho" onClick={cerrar}>Cerrar</button>}>
          <TerminosYPoliticas />
        </Ventana>
      )}
    </Ctx.Provider>
  );
}

function Ventana({ titulo, bajada, extra, botones, onCerrar, children }: {
  titulo: string; bajada: string; extra?: React.ReactNode; botones: React.ReactNode; onCerrar: () => void; children: React.ReactNode;
}) {
  const caja = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.classList.add('con-ventana');
    // El foco entra a la ventana, en su primer botón o enlace
    caja.current?.querySelector<HTMLElement>('button, a[href], input')?.focus({ preventScroll: true });
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', esc);
    return () => { document.body.classList.remove('con-ventana'); document.removeEventListener('keydown', esc); };
  }, [titulo, onCerrar]);

  return (
    <div className="ch-modal" onMouseDown={e => { if (e.target === e.currentTarget) onCerrar(); }}>
      <div className="ch-ventana ancha ch-ventana-cuenta" role="dialog" aria-modal="true" aria-labelledby="ventana-titulo" ref={caja}>
        <div className="ch-ventana-cabeza">
          <h2 id="ventana-titulo">{titulo}</h2>
          {extra}
        </div>
        <p className="ch-ventana-bajada">{bajada}</p>
        {children}
        <div className="ch-ventana-pie">{botones}</div>
      </div>
    </div>
  );
}
