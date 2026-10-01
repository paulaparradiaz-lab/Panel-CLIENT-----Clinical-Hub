// Lo que el marco necesita saber del sitio: el menú, sus direcciones, los documentos
// legales y los estados de la suscripción. Sale de prototipo/panel.html.

export type Seccion = {
  id: string;
  nombre: string;
  ruta: string;
  icono?: string;
  bajada?: string;
  nuevo?: boolean;          // «New»: contenido reciente
  proximamente?: boolean;   // bloqueada: se ve en el menú, pero no se abre
  hijos?: Seccion[];
};

// El menú, en el orden que pidió Paula. «hijos» son las secciones que cuelgan de un grupo.
// La bajada real la da Paula sección por sección; sin bajada no se muestra nada.
export const MENU: Seccion[] = [
  { id: 'favoritos', nombre: 'Mis favoritos', ruta: '/', icono: 'estrella', bajada: 'Lo que guardaste y lo que más consultas.' },
  { id: 'nuevo', nombre: 'Nuevo', ruta: '/nuevo', icono: 'nuevo', bajada: 'Lo último que se publicó, de todas las secciones.' },
  { id: 'guias', nombre: 'Guías de práctica clínica', ruta: '/guias', icono: 'guias', hijos: [
    { id: 'resumenes', nombre: 'Resúmenes individuales', ruta: '/guias/resumenes', proximamente: true },
    // La galería de figuras vive dentro de Guías contrastadas, no en el menú.
    { id: 'contrastadas', nombre: 'Guías contrastadas', ruta: '/guias/contrastadas' },
    { id: 'herramientas', nombre: 'Herramientas interactivas', ruta: '/guias/herramientas' },
    { id: 'videos', nombre: 'Videos de procedimientos', ruta: '/guias/videos' },
  ] },
  { id: 'autoevaluacion', nombre: 'Autoevaluación', ruta: '/autoevaluacion', icono: 'autoevaluacion', nuevo: true },
  // De momento, al final y bloqueadas.
  { id: 'news', nombre: 'Clinical News', ruta: '/clinical-news', icono: 'news', proximamente: true },
  { id: 'ia', nombre: 'Entrenamiento en IA', ruta: '/entrenamiento-en-ia', icono: 'ia', proximamente: true },
];

const todas = (lista: Seccion[]): Seccion[] => lista.flatMap(s => [s, ...todas(s.hijos ?? [])]);
export const seccion = (id: string) => todas(MENU).find(s => s.id === id)!;
export const BLOQUEADAS = todas(MENU).filter(s => s.proximamente).map(s => s.ruta);

// Los documentos se muestran desde docs/legal/ tal cual; su versión es la fecha de
// «Última actualización» (la misma que está en la tabla documentos_legales).
export const DOCUMENTOS = [
  { id: 'terminos', nombre: 'Términos y condiciones', archivo: 'terminos-y-condiciones.md', version: '2026-08-13', fecha: '13 de agosto de 2026' },
  { id: 'privacidad', nombre: 'Política de privacidad', archivo: 'politica-de-privacidad.md', version: '2026-08-13', fecha: '13 de agosto de 2026' },
  { id: 'aviso', nombre: 'Aviso clínico y editorial', archivo: 'aviso-clinico-y-editorial.md', version: '2026-08-13', fecha: '13 de agosto de 2026' },
];
export const rutaDocumento = (id: string) => `/documentos/${id}`;

export const CUENTA = {
  datos: '/cuenta/datos',
  suscripcion: '/cuenta/suscripcion',
  terminos: '/cuenta/terminos-y-politicas',
};

// Estados de la suscripción (salen de la base: estado_suscripcion) y cómo se muestran.
export const ESTADOS: Record<string, { nombre: string; etq?: string; fecha?: string }> = {
  activa:               { nombre: 'Activa', etq: 'ok', fecha: 'Próximo cobro' },
  atrasada:             { nombre: 'Pago pendiente', etq: 'pendiente' },
  cancelada_con_acceso: { nombre: 'Cancelada', fecha: 'Acceso hasta' },
  cortesia:             { nombre: 'Cortesía', etq: 'lima' },
  cofundador:           { nombre: 'Co-founder', etq: 'lima' },
  cancelada:            { nombre: 'Cancelada' },
  inactiva:             { nombre: 'Inactiva' },
  reembolsada:          { nombre: 'Reembolsada' },
};

// Soporte por WhatsApp
export const whatsapp = (mensaje: string) => 'https://wa.me/573004067138?text=' + encodeURIComponent(mensaje);

export const fechaLarga = (f: string | number | Date) =>
  new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
