// Los íconos de línea del panel, una sola vez por página. Se usan con <Icono id="…" />.
export function Iconos() {
  return (
    <svg className="ch-sprite" aria-hidden="true">
      <symbol id="i-estrella" viewBox="0 0 24 24"><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" /></symbol>
      <symbol id="i-nuevo" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></symbol>
      <symbol id="i-autoevaluacion" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4V3h6v1M9 11l2 2 4-4M9 17h6" /></symbol>
      <symbol id="i-ia" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="11" rx="3" /><path d="M12 7V4M9.5 12h.01M14.5 12h.01M10 15h4M3 11v3M21 11v3" /></symbol>
      <symbol id="i-guias" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h13" /><path d="M9 7h6" /></symbol>
      <symbol id="i-news" viewBox="0 0 24 24"><path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1-4 0V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a3 3 0 0 0 3 3h11" /><path d="M8 8h4M8 12h4M8 16h4" /></symbol>
      <symbol id="i-flecha" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6" /></symbol>
      <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></symbol>
      <symbol id="i-mas" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></symbol>
      <symbol id="i-cerrar" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></symbol>
      <symbol id="i-menu" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" /></symbol>
      {/* Huella: para entrar con passkey */}
      <symbol id="i-huella" viewBox="0 0 24 24"><path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" /><path d="M14 13.12c0 2.38 0 6.38-1 8.88" /><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" /><path d="M2 12a10 10 0 0 1 18-6" /><path d="M2 16h.01" /><path d="M21.8 16c.2-2 .131-5.354 0-6" /><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" /><path d="M8.65 22c.21-.66.45-1.32.57-2" /><path d="M9 6.8a6 6 0 0 1 9 5.2v2" /></symbol>
      <symbol id="i-cuenta" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></symbol>
    </svg>
  );
}

export function Icono({ id, className }: { id: string; className?: string }) {
  return <svg className={className} aria-hidden="true"><use href={`#i-${id}`} /></svg>;
}
