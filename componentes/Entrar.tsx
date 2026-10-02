'use client';

import { useEffect, useRef, useState } from 'react';
import { whatsapp } from '@/lib/datos';
import { sb } from '@/lib/supabase';
import { Icono } from './Iconos';

// Entrar: solo quien compró (o tiene cortesía). El panel nunca crea cuentas.
// Supabase envía el enlace mágico y el código; ver docs/usuarios.md.
type Paso = 'correo' | 'codigo' | 'sin-compra';

const errorPasskey = (m = '') => {
  m = m.toLowerCase();
  if (m.includes('credential_not_found') || m.includes('credential not found')) return 'Este dispositivo no tiene una passkey de Clinical Hub. Entra con tu correo y actívala adentro.';
  if (m.includes('credential_exists') || m.includes('credential already')) return 'Este dispositivo ya tiene una huella o Face ID registrada.';
  if (m.includes('too_many_passkeys')) return 'Ya tienes el máximo. Borra una para agregar otra.';
  if (m.includes('verification_failed')) return 'No se pudo verificar. Inténtalo de nuevo.';
  if (m.includes('passkey_disabled')) return 'Las passkeys no están activadas en Supabase.';
  if (m.includes('challenge_expired')) return 'Pasó demasiado tiempo. Inténtalo de nuevo.';
  if (m.includes('notallowed') || m.includes('abort') || m.includes('cancel')) return 'Se canceló la huella o Face ID. Inténtalo de nuevo.';
  return 'No se pudo usar la huella o Face ID. Entra con tu correo.';
};
export { errorPasskey };

// Al entrar bien (código o huella), la tarjeta muestra un círculo verde que se dibuja y un
// check adentro; el marco la deja a la vista un momento antes de dar paso al panel.
function Exito() {
  return (
    <div className="ch-entrar-exito" role="status">
      <svg className="ch-check" viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="36" cy="36" r="34" />
        <path d="M22 37.5l9.5 9.5L51 27.5" />
      </svg>
      <h1 className="ch-titulo" id="entrar-titulo">Código correcto</h1>
      <p className="ch-bajada">Entrando a Clinical Hub…</p>
    </div>
  );
}

export function Entrar({ exito = false }: { exito?: boolean }) {
  const [paso, setPaso] = useState<Paso>('correo');
  // Solo en este computador: con ?probar-entrada, cualquier código de 6 números muestra el check
  const [probarCheck, setProbarCheck] = useState(false);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [conPasskeys, setConPasskeys] = useState(false);
  const campo = useRef<HTMLInputElement>(null);

  // Las passkeys solo funcionan en una dirección segura (https o localhost) y con un
  // navegador compatible; si no, el botón no aparece.
  useEffect(() => setConPasskeys(window.isSecureContext && !!window.PublicKeyCredential), []);
  useEffect(() => { setError(''); campo.current?.focus({ preventScroll: true }); }, [paso]);

  async function enviarEnlace() {
    setError('');
    if (['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('probar-entrada')) { setCodigo(''); setPaso('codigo'); return; }
    const { error: e } = await sb.auth.signInWithOtp({
      email: correo,
      options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname },
    });
    if (!e) { setCodigo(''); setPaso('codigo'); return; }
    if (/signup|not allowed|not found/i.test(e.message)) setPaso('sin-compra');   // no hay cuenta: no se crea, se ofrece soporte
    else if (/rate|seconds|security/i.test(e.message)) setError('Ya te enviamos un correo hace poco. Espera un minuto e intenta de nuevo.');
    else setError('No pudimos enviar el correo. Revisa tu conexión e intenta de nuevo.');
  }

  async function verificar(e: React.FormEvent) {
    e.preventDefault();
    if (['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).has('probar-entrada')) {
      setProbarCheck(true); setTimeout(() => setProbarCheck(false), 2500); return;
    }
    const { error: err } = await sb.auth.verifyOtp({ email: correo, token: codigo.trim(), type: 'email' });
    if (err) setError('El código no es válido o ya venció. Pide uno nuevo con «Reenviar el correo».');
  }

  async function conHuella() {
    const { error: e } = await sb.auth.signInWithPasskey();
    if (e) setError(errorPasskey(e.message || e.name));
  }

  const mensaje = `Hola, equipo de Clinical Hub. Intenté ingresar con el correo ${correo} y no encontré mi compra. Es posible que la haya realizado con otro correo o que no recuerde cuál usé. ¿Me ayudan a verificarla, por favor?`;

  return (
    <section className="ch-entrar" id="entrar" aria-labelledby="entrar-titulo">
      <div className="ch-entrar-caja">
        <span className="ch-logotipo">Clinical <span>hub</span><small>Medicina basada en la evidencia y experiencia</small></span>

        {(exito || probarCheck) && <Exito />}

        {!exito && !probarCheck && paso === 'correo' && (
          <form onSubmit={e => { e.preventDefault(); enviarEnlace(); }}>
            <h1 className="ch-titulo" id="entrar-titulo">Bienvenido</h1>
            <p className="ch-bajada">Escribe el correo con el que compraste tu suscripción.</p>
            <label className="ch-rotulo" htmlFor="correo">Correo</label>
            <input className="ch-campo" id="correo" ref={campo} type="email" autoComplete="email" inputMode="email" required
              value={correo} onChange={e => setCorreo(e.target.value.trim().toLowerCase())} />
            {error && <p className="ch-entrar-error" role="alert">{error}</p>}
            <button className="ch-boton ancho" type="submit">Enviarme el enlace</button>
            {conPasskeys && (
              <div className="ch-entrar-passkey">
                <p className="ch-entrar-o" aria-hidden="true">o</p>
                <button type="button" className="ch-boton secundario ancho" onClick={conHuella}><Icono id="huella" />Usar huella o Face ID</button>
              </div>
            )}
          </form>
        )}

        {!exito && !probarCheck && paso === 'codigo' && (
          <form onSubmit={verificar}>
            <h1 className="ch-titulo" id="entrar-titulo">Revisa tu correo</h1>
            <p className="ch-bajada">Te enviamos un enlace y un código a <strong>{correo}</strong>. Abre el enlace en este dispositivo o escribe el código.</p>
            <label className="ch-rotulo" htmlFor="codigo">Código de 6 dígitos</label>
            <input className="ch-campo codigo" id="codigo" ref={campo} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required
              value={codigo} onChange={e => setCodigo(e.target.value)} />
            {error && <p className="ch-entrar-error" role="alert">{error}</p>}
            <button className="ch-boton ancho" type="submit">Entrar</button>
            <div className="ch-entrar-otros">
              <button type="button" className="ch-enlace" onClick={enviarEnlace}>Reenviar el correo</button>
              <button type="button" className="ch-enlace" onClick={() => setPaso('correo')}>Usar otro correo</button>
            </div>
          </form>
        )}

        {!exito && !probarCheck && paso === 'sin-compra' && (
          <div>
            <h1 className="ch-titulo" id="entrar-titulo">No encontramos una compra con este correo</h1>
            <p className="ch-bajada">Si compraste con otro correo o no recuerdas cuál usaste, escríbenos y lo verificamos.</p>
            <div className="ch-entrar-soporte">
              <a className="ch-boton ancho" href={whatsapp(mensaje)} target="_blank" rel="noopener">Escríbenos por WhatsApp</a>
              <a className="ch-boton secundario ancho"
                href={'mailto:sustanciapro@gmail.com?subject=' + encodeURIComponent('Clinical Hub · No encuentro mi compra') + '&body=' + encodeURIComponent(mensaje)}>
                Escríbenos al correo
              </a>
            </div>
            <div className="ch-entrar-otros"><button type="button" className="ch-enlace" onClick={() => setPaso('correo')}>Intentar con otro correo</button></div>
          </div>
        )}
        <p className="ch-entrar-firma">Powered by Sustancia Pro<sup>™</sup></p>
      </div>
    </section>
  );
}
