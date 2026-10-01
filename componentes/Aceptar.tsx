'use client';

import { useEffect, useRef, useState } from 'react';
import { DOCUMENTOS, rutaDocumento } from '@/lib/datos';
import { useSesion } from '@/lib/sesion';

// Al entrar: aceptar los documentos vigentes y declarar que es profesional de la
// salud (términos, numeral 9). Queda registrada la firma con fecha y versión.
const DECLARACION = 'Soy profesional de la salud con título habilitante y tarjeta profesional vigente, o estudiante del área bajo supervisión docente.';

export function Aceptar({ onFirmado }: { onFirmado: () => void }) {
  const { cuenta, registrarFirma } = useSesion();
  const [especialidad, setEspecialidad] = useState(cuenta?.especialidad || '');
  const [casillas, setCasillas] = useState([false, false]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const campo = useRef<HTMLInputElement>(null);

  useEffect(() => { campo.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => { if (!especialidad && cuenta?.especialidad) setEspecialidad(cuenta.especialidad); }, [cuenta?.especialidad]);   // eslint-disable-line react-hooks/exhaustive-deps

  const listo = casillas.every(Boolean) && especialidad.trim() && !guardando;

  async function firmar(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    const ok = await registrarFirma(especialidad.trim(), DECLARACION);
    setGuardando(false);
    if (!ok) { setError('No pudimos guardar tu aceptación. Revisa tu conexión e intenta de nuevo.'); return; }
    onFirmado();
  }

  const marcar = (i: number) => setCasillas(c => c.map((x, j) => (j === i ? !x : x)));

  return (
    <form className="ch-aceptar" id="aceptar" onSubmit={firmar}>
      <div className="ch-ventana ch-aceptar-ventana" role="dialog" aria-modal="true" aria-labelledby="aceptar-titulo">
        <h2 id="aceptar-titulo">Antes de empezar</h2>
        <p>Cuéntanos tu especialidad y acepta estos documentos para usar Clinical Hub. Puedes leerlos completos.</p>
        <label className="ch-rotulo" htmlFor="especialidad">Tu especialidad</label>
        <input className="ch-campo ch-aceptar-campo" id="especialidad" ref={campo} autoComplete="off" required
          value={especialidad} onChange={e => setEspecialidad(e.target.value)} />
        <ul className="ch-aceptar-docs">
          {DOCUMENTOS.map(d => (
            <li key={d.id}><a href={rutaDocumento(d.id)} target="_blank" rel="noopener">{d.nombre}</a><span>Actualizado el {d.fecha}</span></li>
          ))}
        </ul>
        <label className="ch-aceptar-casilla"><input type="checkbox" required checked={casillas[0]} onChange={() => marcar(0)} /><span>{DECLARACION}</span></label>
        <label className="ch-aceptar-casilla"><input type="checkbox" required checked={casillas[1]} onChange={() => marcar(1)} /><span>He leído y acepto los términos y condiciones, la política de privacidad y el aviso clínico y editorial.</span></label>
        {error && <p className="ch-entrar-error" role="alert">{error}</p>}
        <button type="submit" className="ch-boton ancho" disabled={!listo}>Aceptar y entrar</button>
      </div>
    </form>
  );
}
