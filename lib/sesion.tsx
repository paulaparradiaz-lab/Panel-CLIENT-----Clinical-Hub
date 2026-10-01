'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { sb } from './supabase';
import { DOCUMENTOS } from './datos';

// La cuenta del médico sale de la base (v_mi_cuenta) y sus firmas de «aceptaciones».
export type Cuenta = {
  nombre: string | null;
  correo: string | null;
  especialidad: string | null;
  plan: string | null;
  estado: string | null;
  vence: string | null;
  cupon: string | null;
};
type Firma = { documento: string; version: string; fecha: string };
type FirmaVigente = { fecha: string; especialidad?: string | null };

type Sesion = {
  listo: boolean;                    // ya se sabe si hay sesión
  usuario: User | null;
  dentro: boolean;                   // con sesión (o revisando el diseño con ?sin-login)
  cuenta: Cuenta | null;
  firmasLeidas: boolean;             // con sesión, ya se leyeron las firmas de la base
  firma: FirmaVigente | null;        // firmó las versiones vigentes de los tres documentos
  estado: string | null;             // el de la base, o el simulado en local
  simulado: string | null;
  recienEntro: boolean;              // acaba de entrar (para ofrecer la passkey)
  nombre: string;
  especialidad: string;
  actualizarCuenta: (cambios: Partial<Cuenta>) => void;
  registrarFirma: (especialidad: string, declaracion: string) => Promise<boolean>;
};

const Ctx = createContext<Sesion | null>(null);
export const useSesion = () => useContext(Ctx)!;

const CLAVE_FIRMA = 'ch-aceptacion';   // solo para revisar el diseño sin sesión
const local = () => ['127.0.0.1', 'localhost'].includes(location.hostname);

export function SesionProvider({ children }: { children: React.ReactNode }) {
  const [listo, setListo] = useState(false);
  const [usuario, setUsuario] = useState<User | null>(null);
  const [cuenta, setCuenta] = useState<Cuenta | null>(null);
  const [firmas, setFirmas] = useState<Firma[] | null>(null);
  const [firmaLocal, setFirmaLocal] = useState<FirmaVigente | null>(null);
  const [recienEntro, setRecienEntro] = useState(false);
  // Solo en este computador: ?sin-login para ver el panel sin entrar, y
  // ?simular=activa (o atrasada, cancelada_con_acceso, cortesia…) para ver otro estado.
  const [sinLogin, setSinLogin] = useState(false);
  const [simulado, setSimulado] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (local()) {
      setSinLogin(q.has('sin-login'));
      setSimulado(q.get('simular') || (q.has('pago-atrasado') ? 'atrasada' : null));
    }
    try {
      const f = JSON.parse(localStorage.getItem(CLAVE_FIRMA) || 'null');
      if (f && DOCUMENTOS.every(d => f.versiones?.[d.id] === d.version)) setFirmaLocal(f);
    } catch {}

    const { data: { subscription } } = sb.auth.onAuthStateChange((evento, sesion) => {
      // Aquí solo se guarda el estado: las consultas a la base van en otro efecto.
      setUsuario(sesion?.user ?? null);
      setListo(true);
      if (evento === 'SIGNED_IN') setRecienEntro(true);
    });
    sb.auth.getSession().then(({ data }) => {
      // Si se entró con el enlace del correo, se limpia el código de la dirección
      if (new URLSearchParams(location.search).has('code')) history.replaceState(null, '', location.pathname + location.hash);
      setUsuario(data.session?.user ?? null);
      setListo(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const uid = usuario?.id;
  useEffect(() => {
    setCuenta(null);
    setFirmas(null);
    if (!uid) return;
    let vigente = true;
    Promise.all([
      sb.from('v_mi_cuenta').select('nombre, correo, especialidad, plan, estado, vence, cupon').maybeSingle(),
      sb.from('aceptaciones').select('documento, version, fecha'),
    ]).then(([c, f]) => {
      if (!vigente) return;
      setCuenta((c.data as Cuenta) || null);
      setFirmas((f.data as Firma[]) || []);
    });
    return () => { vigente = false; };
  }, [uid]);

  const firma = useMemo<FirmaVigente | null>(() => {
    if (!usuario) return firmaLocal;
    const vigentes = DOCUMENTOS.map(d => (firmas || []).find(f => f.documento === d.id && f.version === d.version));
    if (!vigentes.every(Boolean)) return null;
    return { fecha: vigentes.map(f => f!.fecha).sort().pop()!, especialidad: cuenta?.especialidad };
  }, [usuario, firmas, firmaLocal, cuenta?.especialidad]);

  const actualizarCuenta = useCallback((cambios: Partial<Cuenta>) => {
    setCuenta(c => ({ ...(c || {} as Cuenta), ...cambios }));
  }, []);

  // La firma queda en «aceptaciones»: una fila por documento, con su versión, la fecha,
  // el correo, la declaración y el navegador. La especialidad, en el perfil.
  const registrarFirma = useCallback(async (especialidad: string, declaracion: string) => {
    if (usuario) {
      const filas = DOCUMENTOS.map(d => ({ documento: d.id, version: d.version, correo: usuario.email, declaracion, navegador: navigator.userAgent }));
      const { error: e1 } = await sb.from('aceptaciones').insert(filas);
      if (e1) return false;
      const { error: e2 } = await sb.from('perfiles').update({ especialidad, actualizado: new Date().toISOString() }).eq('id', usuario.id);
      if (e2) return false;
      const fecha = new Date().toISOString();
      setFirmas(f => [...(f || []), ...filas.map(x => ({ documento: x.documento, version: x.version, fecha }))]);
      actualizarCuenta({ especialidad });
      return true;
    }
    const f = { fecha: new Date().toISOString(), versiones: Object.fromEntries(DOCUMENTOS.map(d => [d.id, d.version])), declaracion, especialidad };
    try { localStorage.setItem(CLAVE_FIRMA, JSON.stringify(f)); } catch {}
    setFirmaLocal(f);
    return true;
  }, [usuario, actualizarCuenta]);

  const datos = usuario?.user_metadata || {};
  const valor: Sesion = {
    listo, usuario, cuenta, firma, simulado, recienEntro,
    dentro: !!usuario || sinLogin,
    firmasLeidas: !usuario || firmas !== null,
    estado: simulado || cuenta?.estado || null,
    // Primero lo que guardó el médico en la base; si no, lo que trajo la cuenta desde Hotmart.
    nombre: cuenta?.nombre || datos.nombre || datos.full_name || '[Nombre del médico]',
    especialidad: cuenta?.especialidad || firma?.especialidad || '[Especialidad]',
    actualizarCuenta, registrarFirma,
  };
  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
