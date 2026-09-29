# Guía de estética anti-IA · Clinical Hub

Qué genera Claude (y cualquier IA) por costumbre cuando le piden una página en HTML, y
qué hacemos en su lugar. Si algo de esta lista aparece en una pantalla de Clinical Hub,
está mal aunque «se vea bonito».

La regla de fondo: **nada entra por costumbre**. Cada color, pieza, adorno o frase está
porque el manual de marca lo pide o porque el contenido lo necesita. Si no se puede
explicar por qué está, se quita.

Cómo se usa:
- Antes de escribir una pantalla o un componente: leer la parte 1.
- Antes de entregarlo: pasar la parte 2 (revisión) y decir el resultado.
- Si algo de aquí choca con lo que Paula pide explícitamente, manda Paula.

---

## Parte 1 · Lo genérico, por familias

Cada familia: **lo que la IA hace** → **lo que hace Clinical Hub**.

### 1. Color

**La IA hace:**
- Degradados morado-azul o índigo-violeta de fondo (el clásico `#667eea → #764ba2`).
- Texto con degradado (`background-clip: text`) en los titulares.
- Acentos azul eléctrico, violeta, cian o neón.
- Paleta «salud» por defecto: azul hospital, verde menta, teal, cruz roja.
- Resplandores de color (`box-shadow` con el color de la marca y mucho difuminado).
- Cuadritos pastel detrás de cada ícono, cada uno de un color distinto.
- Modo oscuro por defecto en azul marino casi negro (`#0f172a`) con acentos neón.
- Grises «de librería» (slate, zinc, gray-500) en lugar de los de la marca.
- Arcoíris en las gráficas: un color distinto por barra, sin motivo.

**Clinical Hub hace:**
- Solo las variables del manual: `--bg`, `--surface`, `--surface2`, `--ink`, `--muted`,
  `--faint`, `--brand`, `--brand-ink`, `--brand-bg`, `--sel`, `--dato-verde`,
  `--nota-amarilla`, `--ok`, `--warn`, `--s1…--s5`.
- Colores planos. Cero degradados, cero texto degradado, cero resplandores.
- El lima (`--brand`) solo marca **lo elegido**; el verde oscuro (`--sel`), la acción
  principal. Encima del lima el texto va en `--brand-ink`, nunca en blanco.
- Rojo y ámbar solo cuando son un **dato** (alerta, error, severidad) y siempre con una
  palabra o signo, no solo el color.
- En gráficas: un color para la serie y los demás en gris; la escala `--s1…--s5` solo
  para calificaciones y severidad.

### 2. Tipografía

**La IA hace:**
- Inter, Poppins, Roboto, Montserrat o `system-ui` sin pensarlo.
- Titular enorme en negrita (700–900), letra apretada, dos líneas centradas.
- «Etiqueta ceja» encima del título: MAYÚSCULAS pequeñas con letras espaciadas
  («NUEVO», «FUNCIONALIDADES») o una píldora con ✨.
- Títulos en Tipo Título (Cada Palabra Con Mayúscula) o TODO EN MAYÚSCULAS.
- Muchos pesos y tamaños mezclados sin escala.
- Tamaños con `vw` o `clamp()` exagerados que en el celular salen gigantes.
- Párrafos centrados y largos.

**Clinical Hub hace:**
- Una familia: **DM Sans**. La mono (IBM Plex Mono) solo en el campo del código de 6
  dígitos.
- La firma de la marca: **título de página liviano (400)**, 34 px. Títulos de sección
  18 px en 700. Cuerpo 15,5 px con interlineado 1,65.
- Mayúscula solo al inicio. Rótulos pequeños en `--faint`, nunca en mayúsculas.
- La escala del manual y nada más: 34 · 28 · 21 · 18 · 15,5 · 14 · 13,5 · 13 · 12,5 · 11,5.
- Texto de lectura alineado a la izquierda.

### 3. Composición de la página

**La IA hace:**
- **Héroe centrado**: titular + subtítulo + dos botones (uno con degradado y otro con
  borde) + una imagen o maqueta a un lado.
- **Rejilla de tres tarjetas iguales**, cada una con ícono arriba en un cuadrito de
  color, título y dos líneas.
- **Fila de cifras**: «10K+ usuarios · 99 % satisfacción · 24/7 soporte».
- **«Cómo funciona» en 1-2-3**, con círculos numerados unidos por una línea.
- **Testimonios** con nombres, cargos y fotos inventados, a veces en carrusel.
- **Precios en tres columnas** con la del medio más grande y la cinta «Más popular».
- **Franja de logos** «Confían en nosotros».
- **Preguntas frecuentes** en acordeón al final, aunque nadie las pidió.
- **Banda final de llamada a la acción** con degradado y «Empieza hoy».
- **Pie de página de cuatro columnas** de enlaces que no existen.
- **Rejilla «bento»** de cajas de tamaños variados sin razón de contenido.
- Todo centrado y todas las secciones con el mismo alto y el mismo ritmo.

**Clinical Hub hace:**
- La estructura sale del **contenido y de la tarea del médico**, no de una plantilla de
  landing. Un médico entra a encontrar algo: primero lo que busca, sin preámbulos.
- Jerarquía editorial: un título liviano grande, filetes finos, listas que se leen como
  un índice. Variedad de tamaños solo cuando el contenido tiene distinta importancia.
- Solo las secciones que Paula pidió. Cero secciones de relleno.
- Cifras solo si son reales y vienen de datos. Nunca testimonios ni logos inventados.
- Ancho de contenido hasta 1080 px, margen lateral 22 px, alineado a la izquierda.

### 4. Tarjetas y cajas

**La IA hace:**
- Todo dentro de una tarjeta, y tarjetas dentro de tarjetas.
- **Barra de color en el borde izquierdo** (4 px) o arriba, como adorno.
- Tarjetas que al pasar el mouse suben, crecen (`scale(1.05)`) y brillan, todas.
- Radios enormes en todo, o radios distintos en cada pieza.
- Borde + sombra fuerte + fondo de color + ícono + etiqueta, todo junto.
- Listas con ✓ en circulitos verdes.
- Etiquetas «Nuevo», «Popular», «Pro» por todos lados.

**Clinical Hub hace:**
- Tarjeta (`.ch-caja`): `--surface`, borde `--border`, `--sombra-suave`, radio 24 px,
  relleno 20 px. Bloques internos en `--surface2`, radio 16 px. Nada anidado de más.
- Un borde de color solo cuando es un **dato con leyenda** (por ejemplo, en un
  algoritmo, «borde rojo = acción crítica»). Nunca como adorno.
- Movimiento al pasar el mouse solo donde el manual lo dice: el botón principal sube
  2 px; la tarjeta de dato, 5 px. El resto, quieto o con un cambio de fondo.
- Etiquetas (`.ch-etq`) solo cuando dicen algo real: «Guía central», «Ponte a prueba».

### 5. Decoración

**La IA hace:**
- «Blobs», manchas y círculos difuminados flotando detrás.
- Fondos de puntos, cuadrícula o ruido.
- Separadores con olas en SVG.
- Formas 3D abstractas, ilustraciones genéricas, fotos de archivo.
- En salud: estetoscopios, corazones, cruces, la línea del electrocardiograma como
  adorno, médicos sonriendo de banco de imágenes.
- Chispas ✨, cohetes 🚀, rayos ⚡, flechas → en cada enlace.

**Clinical Hub hace:**
- Fondo liso `--bg`. El aire y la tipografía hacen el trabajo.
- Imágenes solo si son contenido real: una figura traducida, un algoritmo, un video.
- La ilustración propia de la marca (los personajes) solo donde Paula la pida.

### 6. Íconos

**La IA hace:**
- Emojis como íconos.
- Un ícono delante de cada título, cada botón y cada línea.
- Íconos en círculos o cuadrados de color, uno distinto por tarjeta.
- Mezcla de estilos: rellenos, de línea, de dos tonos.

**Clinical Hub hace:**
- Íconos de línea, cuadrícula de 24, trazo 2, puntas redondeadas (estilo Tabler o
  Lucide), color `currentColor`.
- Solo donde ayudan a reconocer algo rápido (el menú lateral, el buscador). Si el texto
  basta, no hay ícono.
- Un ícono que va solo lleva `aria-label`.

### 7. Movimiento

**La IA hace:**
- Todo aparece deslizándose hacia arriba al hacer scroll, en cascada.
- Botones que laten o brillan, bordes con degradado animado.
- Contadores que suben de 0 a 10.000, texto que se escribe solo.
- Transiciones largas y rebotes exagerados.

**Clinical Hub hace:**
- Una sola curva: `--ease`, `cubic-bezier(.34,1.35,.64,1)`.
- Movimiento solo como respuesta a lo que hace la persona (tocar, pasar el mouse,
  abrir una ventana con `ch-pop`). Nada se anima solo al cargar.
- Con «reducir movimiento» activado, todo se queda quieto.

### 8. Textos

**La IA escribe:**
- «Revoluciona», «potencia», «desbloquea», «eleva», «transforma», «sin esfuerzo»,
  «de última generación», «todo en uno», «experiencia única», «impulsado por IA».
- «Empieza hoy», «Descubre más», «Únete a miles de…».
- Todo de a tres: «rápido, seguro y confiable».
- Títulos con dos puntos: «Clinical Hub: la plataforma que…».
- Signos de exclamación, frases con raya larga encadenadas.
- Cifras, reseñas y nombres inventados; lorem ipsum.
- Textos de ayuda que nadie pidió («Aquí puedes ver…»).

**Clinical Hub escribe:**
- Español de Colombia, segunda persona, tono cercano y directo.
- Nombres que el médico reconoce: «Resúmenes de guías», «Abrir la guía», «Buscar».
- Botones que dicen lo que hacen: «Abrir la guía», «Ir al algoritmo maestro».
- Bajo cada título, una frase corta con datos reales: «11 secciones · algoritmo en
  5 fases».
- Datos separados con « · ». Si algo es aproximado, se dice.
- Si falta un dato real: marcador entre corchetes `[DATO]`, nunca uno inventado.
- El contenido clínico no se escribe ni se reescribe desde la interfaz.

### 9. Piezas que nadie pidió

**La IA agrega:**
- Interruptor de modo claro/oscuro, botón «Volver arriba», burbuja de chat, aviso de
  cookies decorativo, notificaciones emergentes de ejemplo.
- Maquetas falsas: marcos de navegador, teléfonos con barra de estado dibujada.
- Barras de progreso, gráficas y estadísticas de ejemplo.
- Esqueletos de carga en todo.

**Clinical Hub hace:**
- Solo las piezas que Paula pidió. Una mejora posible se propone en una línea, sin
  construirla.
- Modo claro únicamente, mientras el manual no defina el oscuro.

### 10. Código que delata

**La IA escribe:**
- Colores, tamaños y sombras escritos a mano en cada elemento (`style="…"`).
- `!important` para ganarle a sus propias reglas; `z-index: 9999`.
- Botones y enlaces hechos con `div` o `span` y `onClick`: el teclado no llega.
- `outline: none` sin reemplazo: desaparece el foco del teclado.
- El texto de ejemplo del campo (`placeholder`) usado como etiqueta.
- Alturas fijas que cortan el texto; tamaños mágicos (`37px`, `13.7px`).
- Clases inventadas sin prefijo que chocan con otras.

**Clinical Hub hace:**
- Estilos desde `estilos/clinical-hub.css` y sus variables; piezas `ch-` o componentes.
- Elementos reales: `<button>`, `<a href>`, `<input>` con `<label>`.
- Foco visible: anillo `--brand` de 2 px separado 3 px.
- Áreas de toque de 44 px mínimo. Contraste 4,5:1 en texto.
- Medidas de la escala del manual (`--esp-*`, `--r-*`), no números sueltos.

---

## Parte 2 · Revisión antes de entregar

Viene de la skill `revisor-anti-ia-css` de Paula, adaptada a construir pantallas.

Primero, en una línea: qué pidió Paula. Todo lo que no esté en esa línea queda fuera.
Luego, cada punto PASA / FALLA, con evidencia (`git diff`, `grep`):

1. **Alcance**: el cambio solo toca lo pedido.
2. **Elementos nuevos**: no se agregaron textos de ayuda, botones, íconos o secciones
   no pedidos.
3. **Contenido clínico**: no cambió ningún texto clínico, cita ni referencia.
4. **Nombres**: si se renombró o quitó una clase, un id o un componente, se buscó en
   todo el proyecto y nada lo usa.
5. **Celular**: se ve y se usa bien a 390 px; áreas de toque de 44 px.
6. **Colores y letra**: ningún `#…`, `rgb(…)` ni fuente fija nueva fuera de `:root`
   (`grep -E '#[0-9a-fA-F]{3,8}|rgb\('` sobre lo añadido).
7. **Lista anti-IA**: nada de la parte 1 aparece en lo entregado. Revisar sobre todo:
   degradados, emojis, rejilla de tres tarjetas iguales, héroe centrado, barras de
   color de adorno, mayúsculas espaciadas, cifras inventadas, animaciones al cargar.
8. **Viewport**: existe `<meta name="viewport" content="width=device-width, initial-scale=1">`.
9. **Accesibilidad**: `aria-*` intactos, foco visible, `prefers-reduced-motion`
   respetado, contraste 4,5:1.
10. **Sintaxis**: el proyecto compila sin errores.

Si algo FALLA: se corrige y se repite. No se entrega con fallas.

Informe al entregar: qué se cambió y «Revisión anti-IA: 10/10 PASA», o qué quedó
pendiente y por qué.
