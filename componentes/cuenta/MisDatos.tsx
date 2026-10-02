'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { PasskeyListItem } from '@supabase/supabase-js';
import { fechaLarga, whatsapp } from '@/lib/datos';
import { useSesion, type Cuenta } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { errorPasskey } from '../Entrar';
import { CLAVE_OFRECIDA } from '../OfrecerPasskey';

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
  const correo = cuenta?.correo || usuario?.email || '[correo]';

  // Huella o Face ID (passkeys): las que tiene registradas y «Agregar» para una nueva en este dispositivo.
  // Solo en una dirección segura (https o localhost) y con un navegador compatible.
  const [passkeys, setPasskeys] = useState<PasskeyListItem[]>([]);
  const [conPasskeys, setConPasskeys] = useState(false);
  useEffect(() => setConPasskeys(window.isSecureContext && !!window.PublicKeyCredential), []);
  const leerPasskeys = useCallback(async () => {
    if (!usuario) { setPasskeys([]); return; }
    const { data } = await sb.auth.passkey.list();
    setPasskeys(data || []);
  }, [usuario]);
  useEffect(() => { leerPasskeys(); }, [leerPasskeys]);
  async function agregarPasskey() {
    setAviso(null);
    const { error } = await sb.auth.registerPasskey();
    if (error) { setAviso({ ok: false, texto: errorPasskey(error.message || error.name) }); return; }
    try { localStorage.setItem(CLAVE_OFRECIDA, '1'); } catch {}   // ya no hace falta ofrecerla al entrar
    await leerPasskeys();
    setAviso({ ok: true, texto: 'Activamos la huella o Face ID en este dispositivo.' });
  }
  const estadoPasskeys = !conPasskeys ? 'Este navegador no la permite'
    : passkeys.length === 0 ? 'No la has activado'
    : passkeys.length === 1 ? 'Activa en 1 dispositivo' : `Activa en ${passkeys.length} dispositivos`;

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
            <span>{estadoPasskeys}
              {passkeys.map(p => (
                <span key={p.id} className="ch-ficha-nota-chica">{p.friendly_name || 'Passkey'} · activada el {fechaLarga(p.created_at)}</span>
              ))}
            </span>
            {conPasskeys && usuario && (
              <button type="button" className="ch-accion" aria-label="Agregar huella o Face ID" onClick={agregarPasskey}>Agregar</button>
            )}
          </dd>
        </div>
      </dl>
      {aviso && <p className={`ch-aviso ${aviso.ok ? 'ok' : 'mal'} ch-datos-aviso`} role="status">{aviso.texto}</p>}
    </>
  );
}
