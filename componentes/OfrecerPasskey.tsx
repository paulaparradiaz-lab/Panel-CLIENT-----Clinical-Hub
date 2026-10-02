'use client';

import { useEffect, useState } from 'react';
import { useSesion } from '@/lib/sesion';
import { sb } from '@/lib/supabase';
import { errorPasskey } from './Entrar';

// Después de entrar con el correo (y ya firmado): ofrecer la passkey para la próxima vez,
// una sola vez por dispositivo.
export const CLAVE_OFRECIDA = 'ch-passkey-ofrecida';

export function OfrecerPasskey({ puede }: { puede: boolean }) {
  const { usuario } = useSesion();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!puede || !usuario || !window.isSecureContext || !window.PublicKeyCredential) return;
    try { if (localStorage.getItem(CLAVE_OFRECIDA)) return; } catch {}
    let vigente = true;
    sb.auth.passkey.list().then(({ data }) => { if (vigente && !(data && data.length)) setVisible(true); });
    return () => { vigente = false; };
  }, [puede, usuario]);

  const cerrar = () => { setVisible(false); try { localStorage.setItem(CLAVE_OFRECIDA, '1'); } catch {} };
  async function activar() {
    const { error: e } = await sb.auth.registerPasskey();
    if (e) { setError(errorPasskey(e.message || e.name)); return; }
    cerrar();
  }

  if (!visible) return null;
  return (
    <div className="ch-aceptar" id="ofrecer-passkey">
      <div className="ch-ventana ch-aceptar-ventana" role="dialog" aria-modal="true" aria-labelledby="passkey-titulo">
        <h2 id="passkey-titulo">Entra más rápido la próxima vez</h2>
        <p>Activa tu huella o Face ID en este dispositivo y entra con un toque, sin esperar el correo.</p>
        {error && <p className="ch-entrar-error" role="alert">{error}</p>}
        <div className="ch-ventana-botones">
          <button type="button" className="ch-boton secundario" onClick={cerrar}>Ahora no</button>
          <button type="button" className="ch-boton" onClick={activar}>Activar</button>
        </div>
      </div>
    </div>
  );
}
