'use client';

import { useEffect, useRef, useState } from 'react';
import { whatsapp } from '@/lib/datos';
import { useSesion, type Cuenta } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { useVentanas } from '../Ventanas';

// Mis datos: nombre y especialidad se cambian (solo en la plataforma). El correo de ingreso
// une la cuenta con Hotmart: no se edita aquí, solo vía WhatsApp con el equipo.
type Campo = 'nombre' | 'especialidad';
const ROTULOS: Record<Campo, string> = { nombre: 'Nombre', especialidad: 'Especialidad' };

export function MisDatos() {
  const { usuario, cuenta, nombre, especialidad, actualizarCuenta } = useSesion();
  const [editando, setEditando] = useState<Campo | null>(null);
  const [valor, setValor] = useState('');
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [foco, setFoco] = useState<Campo | null>(null);   // a qué «Cambiar» vuelve el foco
  const campo = useRef<HTMLInputElement>(null);
  const botones = useRef<Partial<Record<Campo, HTMLButtonElement | null>>>({});

  const datos: Record<Campo, string> = { nombre, especialidad };
  // Huella o Face ID: cuántas tiene; «Administrar» abre su ventana (agregar y borrar).
  const { abrir } = useVentanas();
  const [huellas, setHuellas] = useState<number | null>(null);
  useEffect(() => {
    if (!usuario) { setHuellas(0); return; }
    sb.auth.passkey.list().then(({ data }) => setHuellas((data || []).length));
  }, [usuario]);
  const correo = cuenta?.correo || usuario?.email || '[correo]';

  useEffect(() => { if (editando) { campo.current?.focus(); campo.current?.select(); } }, [editando]);
  useEffect(() => { if (!editando && foco) { botones.current[foco]?.focus(); setFoco(null); } }, [editando, foco]);

  const cambiar = (c: Campo) => { setAviso(null); setValor(datos[c]); setEditando(c); };
  const cancelar = () => { setFoco(editando); setEditando(null); };
  async function guardar() {
    const c = editando!, v = valor.trim();
    if (!v) { campo.current?.focus(); return; }
    if (usuario) {
      const { error } = await sb.from('perfiles').update({ [c]: v, actualizado: new Date().toISOString() }).eq('id', usuario.id);
      if (error) { setAviso({ ok: false, texto: 'No pudimos guardar el cambio. Intenta de nuevo.' }); campo.current?.focus(); return; }
    }
    actualizarCuenta({ [c]: v } as Partial<Cuenta>);
    setAviso({ ok: true, texto: c === 'nombre' ? 'Guardamos tu nombre.' : 'Guardamos tu especialidad.' });
    setFoco(c);
    setEditando(null);
  }

  const fila = (c: Campo) => editando === c ? (
    <div>
      <dt><label htmlFor={`dato-${c}`}>{ROTULOS[c]}</label></dt>
      <dd>
        <div className="ch-editar">
          <input className="ch-campo" id={`dato-${c}`} ref={campo} value={valor} autoComplete="off" required
            onChange={e => setValor(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { e.preventDefault(); guardar(); }
              if (e.key === 'Escape') { e.stopPropagation(); cancelar(); }
            }} />
          <span className="ch-editar-botones">
            <button type="button" className="ch-boton chico" onClick={guardar}>Guardar</button>
            <button type="button" className="ch-boton secundario chico" onClick={cancelar}>Cancelar</button>
          </span>
        </div>
      </dd>
    </div>
  ) : (
    <div>
      <dt>{ROTULOS[c]}</dt>
      <dd className="ch-ficha-accion">
        <span>{datos[c]}</span>
        <button type="button" className="ch-accion" ref={b => { botones.current[c] = b; }}
          aria-label={`Cambiar ${ROTULOS[c].toLowerCase()}`} onClick={() => cambiar(c)}>Cambiar</button>
      </dd>
    </div>
  );

  return (
    <>
      <dl className="ch-ficha">
        {fila('nombre')}
        <div>
          <dt>Correo de ingreso</dt>
          <dd>{correo}
            <span className="ch-ficha-nota-chica">El cambio de correo solo se puede realizar vía{' '}
              <a href={whatsapp(`Hola, equipo de Clinical Hub. Quiero cambiar el correo de mi cuenta; el actual es ${correo}. ¿Me ayudan, por favor?`)}
                target="_blank" rel="noopener">WhatsApp</a>.</span>
          </dd>
        </div>
        {fila('especialidad')}
        <div>
          <dt>Huella o Face ID</dt>
          <dd className="ch-ficha-accion">
            <span>{huellas === null ? '' : huellas === 0 ? 'No la has activado' : huellas === 1 ? 'Activa en 1 dispositivo' : `Activa en ${huellas} dispositivos`}</span>
            <button type="button" className="ch-accion" aria-label="Administrar huella o Face ID" onClick={() => abrir('passkeys')}>Administrar</button>
          </dd>
        </div>
      </dl>
      {aviso && <p className={`ch-aviso ${aviso.ok ? 'ok' : 'mal'} ch-datos-aviso`} role="status">{aviso.texto}</p>}
    </>
  );
}
