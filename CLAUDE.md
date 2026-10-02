# Panel de usuarios · Clinical Hub

La plataforma que usan los médicos. Proyecto **totalmente aparte** del panel de
administradores (`~/Desktop/Proyectos Claude Code - CH admn`): otro repositorio, otro
frente y su propia base de datos. No se toca el admin desde aquí.

- Repositorio: `paulaparradiaz-lab/Panel-CLIENT-----Clinical-Hub` (rama `main`).
- Autor de los guardados: `paulaparradiaz-lab <paulaplf555@gmail.com>`.
- Subir a GitHub: la sesión de GitHub está en **GitHub Desktop**; Paula sube con
  **Push origin** mientras la terminal no tenga sesión propia.
- Dominio futuro: `access-clinicalhub.sustanciapro.com` (hoy lo ocupa Ghost).
  **No configurarlo** hasta que Paula lo pida.

## Tecnología

Next.js + React + TypeScript, publicado en Vercel. Datos en un Supabase **propio** de
este panel (se crea en la fase de cuentas, con permiso de Paula). Pagos con Hotmart.
Ghost se deja de usar. Solo cruzan con el admin: el contenido **publicado**
(admin → médicos) y **métricas agregadas** de solo lectura (médicos → admin).

**Dónde vive cada cosa (Next.js):**
- `app/layout.tsx` es el marco: envuelve todas las páginas. Sus piezas están en
  `componentes/` (Cabecera, MenuLateral, Cuenta, Entrar, Aceptar, AvisoPago, OfrecerPasskey).
- Cada vista es un `app/…/page.tsx` y solo llena el centro. El menú, sus direcciones y los
  estados de la suscripción están en `lib/datos.ts`; la sesión y la cuenta, en `lib/sesion.tsx`.
- Estilos: `estilos/clinical-hub.css` (manual) y `estilos/panel.css` (piezas del panel).
- Para verlo en este computador: `npm run dev` (http://localhost:3000); `?sin-login` muestra
  el panel sin entrar y `?simular=activa` (u otro estado) simula la suscripción.
- `prototipo/` queda como maqueta de referencia (sigue en GitHub Pages).

**Usuarios:** los crea **n8n** a partir del webhook de Hotmart; el panel nunca crea
cuentas (entrada con enlace mágico + código). Todo se arma según `docs/usuarios.md`.

## Menú lateral (en este orden)

Mis favoritos · Nuevo · Guías de práctica clínica (se despliega: Resúmenes
individuales · Guías contrastadas, que incluye la galería de figuras · Herramientas
interactivas · Videos de procedimientos) · Autoevaluación · Clinical News ·
Entrenamiento en IA. Por ahora, Clinical News y Entrenamiento en IA van al final, bloqueadas,
con «Próximamente». Al pie: la cuenta; al desplegarla, «Términos y políticas» va entre Suscripción y
Ayuda o contacto (los documentos de `docs/legal/`, que se muestran tal cual). Prototipo:
`prototipo/panel.html`.

## Reglas de interfaz: se aplican SIEMPRE, sin que Paula lo pida

1. Toda la estética sale del manual de marca: `estilos/clinical-hub.css` y
   `docs/manual-de-marca.md`. Nada de colores, letras, radios ni sombras inventados:
   solo sus variables (`var(--…)`).
2. Nada con cara de «hecho por IA»: leer y cumplir `docs/estetica-anti-ia.md` antes de
   escribir cualquier pantalla o componente.
3. Antes de entregar un cambio de interfaz, revisarlo contra la lista de
   `docs/estetica-anti-ia.md` (sección «Revisión antes de entregar») y decir en el
   informe qué se comprobó.
4. Solo lo pedido: no agregar textos de ayuda, botones, secciones ni íconos que Paula
   no pidió. Si se ve una mejora, proponerla en una línea sin aplicarla.
5. Contenido clínico, citas y referencias no se inventan ni se reescriben. Donde falte
   un dato real, marcador entre corchetes: `[DOSIS]`, `[FUENTE]`.
6. Español de Colombia, segunda persona, mayúscula solo al inicio, sin emojis.
7. Antes de cada pantalla, el proceso de la parte 0 de la guía: anclar (tema · quién
   lo usa · único trabajo · modo Leer/Operar), layout en una frase + boceto ASCII,
   revisión contra el default. Recién después, código.
8. Orden de mando cuando dos reglas chocan: **Paula > manual de marca >
   `docs/estetica-anti-ia.md` > skill `frontend-design`**. De `frontend-design` se
   toma el proceso, el piso de calidad y el copy; nunca una paleta, letra, fondo o
   animación distinta de la del manual.

### Lo que nunca aparece (resumen de `docs/estetica-anti-ia.md`)

- Degradados, texto degradado, resplandores, vidrio esmerilado, neón, morados; y los
  «nuevos defaults»: crema + serif + terracota, negro + verde ácido, verde esmeralda.
- Numeración 01/02/03 sin una secuencia real; raya larga (—) en los textos.
- Otra letra que no sea Plus Jakarta Sans; títulos de página en negrita; MAYÚSCULAS espaciadas.
- Héroe centrado con dos botones, rejilla de tres tarjetas iguales con ícono arriba,
  fila de cifras, «cómo funciona 1-2-3», testimonios, precios con «Más popular»,
  franja de logos, FAQ y banda final de «Empieza hoy», salvo que Paula lo pida.
- Barras de color en el borde de las tarjetas como adorno.
- Blobs, fondos de puntos, olas, fotos de archivo, íconos médicos de adorno.
- Emojis, íconos en cuadritos de color, un ícono delante de cada cosa.
- Animaciones al cargar o al hacer scroll; contadores; botones que laten.
- «Revoluciona», «potencia», «todo en uno», «impulsado por IA», cifras inventadas.
- Interruptor de modo oscuro, «volver arriba», chat, maquetas falsas no pedidas.
- `div` como botón, `outline: none`, `!important`, colores escritos a mano.

## Diseño

Lienzo de diseño (inicio / biblioteca, direcciones A · Índice y B · Revista):
https://claude.ai/artifact/KABR3XKcxe1YCkttcGPrPr
