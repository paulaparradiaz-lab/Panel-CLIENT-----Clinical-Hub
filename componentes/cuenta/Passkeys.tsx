'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PasskeyListItem } from '@supabase/supabase-js';
import { useSesion } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { errorPasskey } from '../Entrar';
import { Icono } from '../Iconos';
import { CLAVE_OFRECIDA } from '../OfrecerPasskey';

// Huella o Face ID (passkeys), como «Tus passkeys» del panel del admin: una fila por
// passkey (dispositivo o llavero) con Borrar, y Agregar para la de este dispositivo.
// Las passkeys se guardan en el dispositivo; Supabase solo guarda la parte pública.
const cuando = (t: string) => new Date(t).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });

// «¿Cómo funciona?» en la cabeza de la ventana: muestra u oculta la explicación.
export function ComoFunciona({ abierto, onCambiar }: { abierto: boolean; onCambiar: () => void }) {
  return (
    <button type="button" className="ch-ayuda" aria-expanded={abierto} aria-controls="como-funciona" onClick={onCambiar}>
      <Icono id="info" />¿Cómo funciona?
    </button>
  );
}

export function Passkeys({ explicar }: { explicar: boolean }) {
  const { usuario } = useSesion();
  const [lista, setLista] = useState<PasskeyListItem[] | null>(null);
  const [aviso, setAviso] = useState<{ ok: boolean; texto: string } | null>(null);
  const [confirmando, setConfirmando] = useState<string | null>(null);   // Borrar pide confirmar
  const [ocupado, setOcupado] = useState(false);

  const leer = useCallback(async () => {
    if (!usuario) { setLista([]); return; }
    const { data, error } = await sb.auth.passkey.list();
    if (error) { setAviso({ ok: false, texto: errorPasskey(error.message || error.name) }); setLista([]); return; }
    setLista(data || []);
  }, [usuario]);
  useEffect(() => { leer(); }, [leer]);

  async function agregar() {
    setAviso(null);
    if (!window.isSecureContext || !window.PublicKeyCredential) { setAviso({ ok: false, texto: 'Este navegador no permite huella o Face ID.' }); return; }
    if (!usuario) { setAviso({ ok: false, texto: 'Entra con tu cuenta para agregar la huella o Face ID.' }); return; }
    setOcupado(true);
    const { error } = await sb.auth.registerPasskey();
    setOcupado(false);
    if (error) { setAviso({ ok: false, texto: errorPasskey(error.message || error.name) }); return; }
    try { localStorage.setItem(CLAVE_OFRECIDA, '1'); } catch {}   // ya no hace falta ofrecerla al entrar
    setAviso({ ok: true, texto: 'Listo: la próxima vez puedes entrar con «Usar huella o Face ID».' });
    await leer();
  }

  async function borrar(id: string) {
    if (confirmando !== id) { setConfirmando(id); return; }
    setConfirmando(null);
    setAviso(null);
    const { error } = await sb.auth.passkey.delete({ passkeyId: id });
    if (error) { setAviso({ ok: false, texto: errorPasskey(error.message || error.name) }); return; }
    setAviso({ ok: true, texto: 'Borramos esa huella o Face ID.' });
    await leer();
  }

  return (
    <div className="ch-passkeys">
      {explicar && (
        <p className="ch-passkeys-explica" id="como-funciona">
          La huella o Face ID funciona con una passkey: una llave que queda guardada en tu celular, tu computador o tu
          gestor de contraseñas (el llavero de iCloud, Google o 1Password) y se sincroniza entre tus dispositivos.
          Clinical Hub solo guarda la parte pública: nadie puede copiarla ni adivinarla. Agrega una en cada dispositivo
          o llavero que uses; si pierdes uno, borra su passkey aquí.
        </p>
      )}
      <div className="ch-passkeys-lista">
        {lista && lista.length > 0 && lista.map(p => (
          <div className="ch-passkey-fila" key={p.id}>
            <span>
              <b>{p.friendly_name || 'Passkey'}</b>
              <small>Creada el {cuando(p.created_at)} · {p.last_used_at ? `usada el ${cuando(p.last_used_at)}` : 'sin usar todavía'}</small>
            </span>
            <button type="button" className="ch-boton-chico" onClick={() => borrar(p.id)}
              aria-label={confirmando === p.id ? `Confirmar: borrar ${p.friendly_name || 'passkey'}` : `Borrar ${p.friendly_name || 'passkey'}`}>
              {confirmando === p.id ? '¿Seguro? Borrar' : 'Borrar'}
            </button>
          </div>
        ))}
        {lista && lista.length === 0 && (
          <div className="ch-passkeys-vacio">
            <span><Icono id="huella" /></span>
            Todavía no tienes huella o Face ID.<br />Agrega la de este dispositivo.
          </div>
        )}
      </div>
      {aviso && <p className={`ch-aviso ${aviso.ok ? 'ok' : 'mal'} ch-datos-aviso`} role="status">{aviso.texto}</p>}
      <button type="button" className="ch-boton ancho ch-passkeys-agregar" onClick={agregar} disabled={ocupado}>
        <Icono id="mas" />{ocupado ? 'Esperando la huella o Face ID…' : 'Agregar huella o Face ID'}
      </button>
    </div>
  );
}
