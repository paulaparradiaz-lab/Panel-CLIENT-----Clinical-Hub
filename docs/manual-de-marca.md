# Manual de marca · Clinical Hub

Copia en texto del manual de marca (sistema de diseño «Clinical Hub»). La hoja con los
valores exactos es `estilos/clinical-hub.css`. Si algo cambia en el manual, se cambia
aquí y en esa hoja.

La marca se ve limpia, clara y amable: superficies blancas sobre un gris cálido, todo
en píldora, un lima que marca lo elegido y un verde oscuro que da peso. Nada grita.

## Voz y textos

- Español de Colombia, en segunda persona y en tono cercano.
- Nombres que la gente reconoce, no nombres técnicos.
- Títulos con mayúscula solo al inicio. Nunca todo en mayúsculas.
- Debajo de cada título, una frase corta que dice qué muestra la sección.
- Cuando un dato es aproximado, se dice: «Es una estimación».
- Los botones dicen lo que hacen.
- Nada de emojis. Donde hace falta un dibujo va un ícono de línea.
- Los datos se separan con « · ».
- El dinero se escribe `US$ 1.335,16`: punto para los miles y coma para los decimales.

## Color

| Variable | Valor | Uso |
|---|---|---|
| `--bg` | #f3f3f1 | Fondo de toda la página |
| `--surface` | #ffffff | Tarjetas, ventanas, menús, contenedor de pestañas |
| `--surface2` | #f6f7f4 | Campos, bloques internos, hover de filas |
| `--border` | rgba(24,24,27,.08) | Borde fino de tarjetas, chips, separadores |
| `--border2` | rgba(24,24,27,.16) | Borde al pasar el mouse, botón secundario, ventanas |
| `--ink` | #18181b | Texto principal y cifras |
| `--muted` | #3f3f46 | Texto secundario |
| `--faint` | #6b6b76 | Rótulos, fechas, encabezados de tabla (solo texto de apoyo) |
| `--brand` | #c1e187 | Lima: lo elegido (pestaña activa, chip encendido, botón chico, foco) |
| `--brand-ink` | #2a4927 | Texto sobre lima y sobre `--brand-bg`; cifras destacadas |
| `--brand-bg` | #eff7df | Tinte lima suave: etiqueta lima, halo del campo con foco |
| `--brand-line` | rgba(42,73,39,.28) | Borde de chips y etiquetas en lima |
| `--sel` | #2a4927 | Acción principal (botón que guarda o confirma); texto encima en blanco |
| `--side` | #2a4927 | Menú lateral de navegación: único bloque grande oscuro |
| `--side-faint` | #b9cdb2 | Íconos y textos en reposo sobre el menú lateral |
| `--hub-verde` | #7d9c3c | Solo la palabra «hub» del logotipo |
| `--dato-verde` | #e9f4d6 | Fondo de la cifra destacada |
| `--nota-amarilla` | #fff6e0 | Solo avisos de cuidado |
| `--ok` | #207b52 | Positivo, siempre con signo o palabra |
| `--warn` | #c2412d | Negativo o error, siempre con signo o palabra |
| `--warn-bg` | rgba(194,65,45,.09) | Fondo de etiqueta de alerta |
| `--rojo-pendiente` | #dc4a3d | Globito con el número de pendientes |
| `--s1`…`--s5` | #d9654d · #e0914a · #d4aa2f · #3fae7a · #9cc700 | Escala de 1 a 5: calificaciones y severidad |

Encima de `--brand` el texto siempre va en `--brand-ink`, nunca en blanco.

## Tipografía

Una sola familia: **Plus Jakarta Sans** (elegida por Paula en octubre de 2026; antes, DM Sans).
La mono (IBM Plex Mono) solo en el campo del código de 6 dígitos. Con esta letra el
espaciado negativo es menor: títulos −0,01 em y logotipo −0,02 em.

| Estilo | Tamaño | Peso | Uso |
|---|---|---|---|
| logotipo | 33 px | 800 | «Clinical» en `--ink` y «hub» en `--hub-verde` |
| titulo-pagina | 34 px | **400** | Nombre de cada pantalla. Liviano: es la firma de la marca |
| cifra | 28 px | 700 | Cifra destacada, números tabulares, en `--brand-ink` |
| titulo-ventana | 21 px | 400 | Título de una ventana emergente |
| titulo-seccion | 18 px | 700 | Título de tarjeta o sección, con subtítulo debajo |
| marca-nombre | 17 px | 800 | Nombre junto al ícono en la barra del celular |
| cuerpo | 15,5 px | 400 | Texto corrido, interlineado 1,65 |
| texto-ui | 14 px | 400 | Tablas, campos, menús |
| pestana | 13,5 px | 600 | Pestañas y subpestañas |
| boton-chico | 13 px | 500 | Botones chicos, chips, rangos de fecha |
| etiqueta / mini | 12,5 px | 500 / 400 | Rótulos y detalles en `--faint`, nunca en mayúsculas |
| etq | 11,5 px | 600 | Etiquetas en píldora |

## Forma, espacio y profundidad

- **Todo es píldora** (`--r-pill`): botones, pestañas, chips, etiquetas, campos de una
  línea. Tarjetas 24 px (`--r`), ventanas 26 px, bloques internos 16 px, filas de menú
  14 px, detalles pequeños 10 px.
- Tarjetas: borde fino **y** sombra suave. Solo lo que flota (ventanas, menús) usa la
  sombra grande.
- Relleno de tarjeta 20 px; entre tarjetas 16 px; entre chips 6 px; margen lateral de
  la página 22 px. El contenido llega hasta 1080 px de ancho.
- En computador la navegación es un menú verde a la izquierda; lo elegido, en lima. En
  celular, las pestañas pasan a una barra en píldora.

## Movimiento

- Una sola curva con rebote suave: `cubic-bezier(.34,1.35,.64,1)` (`--ease`).
- Al pasar el mouse, el botón principal sube 2 px y la tarjeta de dato 5 px. Al hacer
  clic, el botón se hunde (`scale(.97)`).
- Las ventanas aparecen con un pequeño salto (`ch-pop`).
- Con «reducir movimiento» activado, todo se queda quieto.

## Foco y accesibilidad

- Foco de teclado: anillo `--brand` de 2 px separado 3 px. Campos con foco: borde
  `--sel` y halo de 4 px en `--brand-bg`.
- `--faint` da 4,8:1 sobre `--bg`: solo texto de apoyo, nunca párrafos largos.
- `--hub-verde` da 3,1:1 sobre blanco: solo en tamaño grande (el logotipo).

## Iconos

- Iconos de línea en cuadrícula de 24, trazo 2, puntas redondeadas, estilo Tabler o
  Lucide, en `currentColor`.
- Nada de emojis como íconos.

## Logotipo

- Plus Jakarta Sans 800: «Clinical» en `--ink` y «hub» en `--hub-verde`, con el lema «Medicina
  basada en la evidencia y experiencia» debajo, en `--muted`.
- El ícono redondo (`public/icono-clinical-hub.png`) va en círculo con un anillo blanco
  de 2 px.
