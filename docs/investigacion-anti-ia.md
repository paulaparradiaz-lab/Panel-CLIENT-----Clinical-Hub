# Diseño "anti-IA" para Claude: catálogo de señales de *AI slop*, lo que dice Anthropic y un CLAUDE.md listo para usar

Cuando nadie le da dirección, Claude cae en un diseño "promedio" que se reconoce al instante: fuente Inter, gradiente morado/índigo sobre blanco, hero centrado con una pastilla (badge) arriba, tres tarjetas iguales con icono, bordes de color a la izquierda y copy genérico.\[1\]\[2\] Anthropic reconoce esto de forma oficial y le da nombre: *distributional convergence* (convergencia distribucional).\[1\] Lo que mejor funciona para salir de ahí es decidir antes de generar. Hay que elegir una dirección estética anclada en el tema, fijar tokens de diseño (colores, tipos, layout y un elemento distintivo), prohibir por nombre los patrones típicos y pasar una revisión crítica al final.\[3\] Pedirle a Claude "sé creativo" no alcanza.

## TL;DR

- **Hay evidencia de que el problema existe y tiene causas conocidas.** Anthropic escribe que un LLM sin guía "almost always conform[s] to Inter fonts, purple gradients on white backgrounds, and minimal animations", porque las opciones "seguras" dominan los datos de entrenamiento. Adrian Krebs revisó 1.590 páginas de Show HN buscando 16 patrones: el 22 % tenía 4 o más (slop alto), el 32 % tenía 2 o 3 y el 46 % tenía 0 o 1.
- **Prohibir el morado no basta, porque la IA se muda a otro cliché.** La skill oficial `frontend-design` de Anthropic ya advierte de los tres nuevos defaults de 2026: fondo crema (~#F4F1EA) con serif y acento terracota; fondo casi negro con un solo acento verde ácido o bermellón; y layout de periódico con líneas finas y radio 0.\[4\] Para una marca de educación médica, el crema con terracota y el serif itálico son trampas probables.
- **Qué hacer:** usa un CLAUDE.md corto (Anthropic recomienda menos de 200 líneas) que obligue a Claude a (1) nombrar tema, público y función de la página; (2) escribir un plan de tokens (4–6 hex, 2–3 fuentes, layout en ASCII y un elemento firma); (3) revisar si ese plan es "el default"; y (4) pasar un checklist anti-IA al final. Complementa con la skill oficial y, si quieres detección automática, con Impeccable (`npx impeccable detect`).

---

## Key Findings

### 1. Por qué Claude genera diseños "de IA" (verificado)

- **Convergencia distribucional.** Así lo explica el blog oficial de Anthropic, "Improving frontend design through Skills" (12-nov-2025): "During sampling, models predict tokens based on statistical patterns in training data. Safe design choices–those that work universally and offend no one–dominate web training data.\[4\] Without direction, Claude samples from this high-probability center." Según Anthropic, ese estética genérica hace que las interfaces sean "immediately recognizable—and dismissible."\[1\]
- **El cookbook "Prompting for frontend aesthetics"** (Prithvi Rajasekaran, 21-oct-2025) dice que Claude "defaults to safe choices unless explicitly encouraged otherwise"\[4\] y que, sin guía, "often defaults to simplistic designs with white and purple backgrounds."\[5\]
- **El legado de Tailwind.** Adam Wathan, creador de Tailwind, tuiteó el 7-ago-2025, con más de 1,5 millones de vistas: "I'd like to formally apologize for making every button in Tailwind UI `bg-indigo-500` five years ago, leading to every AI generated UI on earth also being indigo."\[6\]\[7\] Era una broma, pero describe un mecanismo real: los componentes de Tailwind UI usaban índigo, esos componentes se copiaron en tutoriales y en código público, y el modelo aprendió que así se ven los botones.\[6\]\[8\]
- **Matiz importante.** CodeMySpec señala que ni shadcn/ui ni Tailwind traen un morado como color primario. El primario por defecto de shadcn es `oklch(0.205 0 0)`, es decir, gris casi negro. El morado aparece cuando el modelo tiene que llenar un hueco que nadie decidió.\[4\] Por eso cambiar de librería de componentes no resuelve nada; hay que tomar la decisión.\[4\]
- **La autoevaluación es complaciente.** En el blog de ingeniería de Anthropic "Harness design for long-running application development" (24-mar-2026) se lee que "agents tend to respond by confidently praising the work—even when, to a human observer, the quality is obviously mediocre." Anthropic lo resolvió separando un agente generador de otro evaluador y calificando cuatro criterios: *design quality*, *originality*, *craft* y *functionality*. El criterio de originalidad penaliza de forma explícita "telltale signs of AI generation like purple gradients over white cards."\[9\]
- **El vocabulario del prompt también sesga.** En ese mismo experimento, frases como "the best designs are museum quality" empujaron los diseños hacia su propia convergencia.\[9\] Cualquier adjetivo que pongas en tu CLAUDE.md va a dejar huella.

### 2. Qué recomienda Anthropic (verificado, fuentes primarias)

**Cookbook y blog (versión de ~400 tokens).** Proponen tres estrategias:
1. Guiar cada dimensión del diseño por separado: tipografía, color, motion y fondos.\[5\]
2. Dar referencias de inspiración, como temas de IDE o estéticas culturales.\[5\]
3. Nombrar los defaults que hay que evitar.\[5\]

Las reglas concretas:
- Evitar Inter, Roboto, Open Sans, Lato, Arial y las fuentes del sistema.\[5\]
- Usar variables CSS.\[5\]
- "Dominant colors with sharp accents outperform timid, evenly-distributed palettes."\[5\]
- En motion, "one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions."\[5\]
- Crear fondos con atmósfera (gradientes en capas, patrones geométricos) en lugar de colores planos.\[5\]
- Variar entre tema claro y oscuro.\[5\]
- Aviso final: "You still tend to converge on common choices (Space Grotesk, for example) across generations."\[5\]

El bloque de tipografía del cookbook da pares de ejemplo: para editorial, Playfair Display, Crimson Pro y Fraunces; para lo técnico, IBM Plex y Source Sans 3; como distintivas, Bricolage Grotesque y Newsreader. También pide usar pesos extremos ("100/200 weight vs 800/900, not 400 vs 600") y saltos de tamaño de "3x+, not 1.5x".\[5\] *Ojo:* esas listas ya se sobreusan (ver la sección 3), así que conviene tomarlas como ejemplos del tipo de decisión, no como un menú.

**Skill oficial `frontend-design` (anthropics/skills, versión actual).** Es bastante más madura que el cookbook. Sus ideas centrales:
- **Rol:** "design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's". El cliente "has already rejected proposals that felt templated". Hay que tomar "one real aesthetic risk you can justify."\[3\]
- **Anclar el diseño en el tema:** si el brief no lo define, hay que nombrar un tema concreto, su público y "the page's single job". Las elecciones distintivas salen del propio mundo del tema: "its materials, instruments, artifacts, and vernacular."\[3\]
- **"The hero is a thesis".** El número grande con etiqueta pequeña, estadísticas y un acento en gradiente es "the template answer".\[3\]
- **"Structure is information".** La numeración 01/02/03, los eyebrows y los divisores solo se usan si codifican algo cierto, por ejemplo una secuencia real.\[3\]
- **Motion:** "sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated."\[3\]
- **Proceso en dos pasadas.** Primero, un plan de tokens: paleta de 4–6 hex con nombre, tipografía para 2 o más roles (display con carácter usado con moderación, cuerpo complementario y una utilitaria para datos), layout en prosa más wireframe ASCII, y una **firma**: el único elemento por el que se recordará la página. Después se revisa el plan: "if any part of it reads like the generic default you would produce for any similar page… revise that part, say what you changed and why." Solo entonces se escribe código.\[3\]
- **Contención:** "Spend your boldness in one place." El piso de calidad incluye responsive, foco visible con teclado y `prefers-reduced-motion`. La regla de Chanel: quitar un accesorio antes de salir.\[3\]
- **Copy:** escribir desde el lado del usuario, con verbos claros ("Save changes", no "Submit"), la misma palabra en todo el flujo ("Publish" produce "Published"), errores que no se disculpan y dicen cómo arreglar el problema, y sentence case.\[3\]

**Documentación de Claude Code sobre CLAUDE.md.**
- El archivo se carga en cada sesión como *contexto*, no como configuración obligatoria.\[10\]
- Conviene que tenga "under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence."\[10\]
- Las instrucciones deben ser verificables ("Use 2-space indentation" en vez de "Format code properly").\[10\]
- Si dos reglas se contradicen, Claude puede elegir cualquiera de las dos.\[10\]
- Los procedimientos largos van mejor en *skills* o en reglas con alcance por ruta (`.claude/rules/` con `paths:`).\[10\]
- Rutas: `~/.claude/CLAUDE.md` es personal y aplica a todos los proyectos; `./CLAUDE.md` es del proyecto.\[10\]
- Se pueden importar archivos con `@ruta` (por ejemplo, `@DESIGN.md`).\[10\]
- Para bloquear algo sin excepción, hay que usar un hook, no el CLAUDE.md.\[10\]

### 3. Evidencia comunitaria y cuantitativa (verificada, fuentes secundarias de calidad variable)

- **Adrian Krebs**, "Scoring Show HN submissions for AI design patterns" (20-abr-2026). Analizó con Playwright el DOM y los estilos computados, con comprobaciones deterministas y sin usar un LLM como juez. Reporta un 5–10 % de falsos positivos. Resultados sobre 1.590 sitios: 22 % alto, 32 % medio, 46 % bajo.\[2\]\[11\] Sus 16 patrones:
  - **Fuentes:** Inter para todo; combinaciones repetidas de Space Grotesk, Instrument Serif y Geist; una palabra en serif itálica en un hero escrito en Inter.\[2\]
  - **Color:** "VibeCode Purple"; modo oscuro permanente con texto gris medio y etiquetas en mayúsculas; contraste apenas suficiente; gradientes en todo; brillos y sombras de color.\[2\]
  - **Layout:** hero centrado; badge sobre el H1; bordes de color arriba o a la izquierda de las tarjetas; tarjetas idénticas con icono arriba; pasos "1, 2, 3"; filas de estadísticas; navegación con emojis; encabezados en mayúsculas.\[2\]
  - **CSS:** shadcn/ui por defecto; glassmorphism.\[2\]
  - Cita que recoge de un diseñador: "colored left borders are almost as reliable a sign of AI-generated design as em-dashes for text." Su conclusión es que estos sitios no son malos, sino "uninspired".\[2\]
- **Impeccable** (Paul Bakaus, pbakaus/impeccable). Es una skill que parte de la de Anthropic y hoy tiene un catálogo de 61 reglas de detector más 6 patrones que requieren revisión de diseño.\[12\]\[13\]\[14\] Entre sus reglas de *AI slop*: etiqueta sobre el encabezado; icono en cuadro redondeado sobre el título; titular display en serif itálica; badge sobre el titular; hero sobredimensionado; tracking comprimido; fuentes sobreusadas (Inter, Geist); halos radiales; paleta morado/cian sobre oscuro; texto con gradiente; paleta crema/beige "por reflejo"; números 01/02/03 decorativos; "hero metric layout"; grillas de tarjetas idénticas; espaciado monótono; tarjetas anidadas; borde lateral grueso; línea fina más sombra ancha; radios extremos; fondos de grilla decorativa; SVG toscos; punto de estado que pulsa; cursor parpadeante; marquesina; easing con rebote; zoom de imágenes al pasar el cursor; abuso de guiones largos; frases de marketing ("supercharge", "world-class"); falsos contrastes ("Not a feature. A platform."). Sus reglas de *calidad* piden cuerpo de ~16px, interlineado de ~1,5, medida de 65–75 caracteres, contraste WCAG AA (4,5:1) y que el contenido siga visible si la animación falla.\[12\]
- **TeneX Studio** (Mathieu Thiry, jul-2026) propone 8 señales: guion largo en todas partes (31 en la página que auditó), eyebrow, titular con gradiente, serif itálica gigante, ninguna imagen real (iniciales en lugar de foto), numeración decorativa, tarjetas idénticas y cifras sin fuente o testimonios con nombre de pila más inicial.\[15\]
- **Solo Design Studio** (Tridip Thrizu, jun-2026) aporta el hallazgo práctico más útil. En su prueba, las instrucciones escritas del tipo "sé distintivo" dieron resultados iguales o peores que no tener skill en 5 de 6 componentes; en el bento, los fallos pasaron de 7,0 a 11,7. Solo una "compuerta mecánica" (reglas verificables) bajó los fallos casi a cero. Además, al prohibir el índigo, el modelo migró al **verde esmeralda**, "the next safe distinctive color". Al intentar forzar reglas de motion, el modelo dejó de animar del todo.\[16\] *Es un experimento de un solo autor que además vende el producto*, así que hay que tomarlo como indicio, no como prueba.
- **CodeMySpec** (jul-2026) recopila las clases típicas: `indigo-600`, `slate-900`, `rounded-2xl/3xl`, `shadow-lg`, `p-6`.\[4\] También el orden de secciones que siempre se repite (hero, grilla de features, prueba social, precios, FAQ, footer) y el copy tipo "Empower / Unlock / Transform / Seamless Integration". Cita el Stanford Web Credibility Project: el "design look" fue lo más mencionado al juzgar si un sitio es confiable (46,1 % de los comentarios).\[4\] *Son datos de 2002*, y el propio autor advierte que hay que leerlos como tendencia general.\[4\]
- **925Studios** resume la idea con una frase que sirve: "generic is worse than ugly", porque lo genérico no se recuerda.\[17\]

---

## Details

### 4. Catálogo de señales: por qué ocurre y qué hacer en su lugar

Leyenda: **[V]** está respaldado por al menos una fuente citada; **[I]** es inferencia o recomendación mía.

| Señal | Por qué ocurre | En su lugar |
|---|---|---|
| Gradiente morado/índigo/violeta, sobre todo sobre blanco [V] | Tailwind UI `indigo-500` y la frecuencia en los datos (Wathan, Anthropic)\[1\]\[7\] | Paleta derivada del tema: 1 color dominante, 1 acento fuerte y neutros con temperatura propia. El color va en superficies, no en gradientes decorativos [V: cookbook] |
| Paleta morado/cian con neón sobre fondo oscuro y halos radiales [V] | "Tech/IA" asociado a cyberpunk en los datos | Modo oscuro solo si la tarea lo pide (lectura nocturna, dashboards). Sin brillos; el contraste se logra con valor de luminosidad, no con glow [V: Impeccable] |
| Crema #F4F1EA + serif + terracota; negro + verde ácido; periódico con radio 0 [V] | Son los nuevos "defaults anti-slop" (skill de Anthropic)\[3\] | Pueden servir si el brief lo pide, pero no deben ser la salida por defecto [V] |
| Verde esmeralda como "alternativa segura" [V, un solo estudio] | El modelo salta al siguiente cluster\[16\] | Declara por qué ese color pertenece al tema [I] |
| Inter, Roboto, Arial, system-ui, Open Sans, Lato [V] | Son las fuentes más frecuentes | Pares elegidos por el registro del tema [V] |
| Space Grotesk, Geist e Instrument Serif como "alternativa" [V] | Convergencia secundaria (Anthropic, Krebs)\[2\]\[5\] | No usar sin una razón escrita [V] |
| Una palabra en serif itálica dentro de un hero en sans; serif itálica gigante [V] | Atajo para parecer "editorial" | Tratamiento tipográfico coherente en todo el titular [V: Impeccable] |
| Jerarquía plana (400 vs 600; tamaños que suben 1,25x) [V] | Timidez del modelo | Escala con contraste real, por ejemplo 3x entre el display y el cuerpo, y pesos distantes [V: cookbook] |
| Hero centrado con badge o pastilla sobre el H1 [V] | Plantilla dominante | Hero como "tesis": lo más característico del tema (una imagen real, un caso clínico, un fragmento de la guía) [V: skill] |
| Eyebrow en MAYÚSCULAS con tracking sobre cada sección [V] | Decoración que pasa por estructura | Quitarlo o integrarlo en el título; solo se usa si codifica algo cierto [V] |
| Tres (o seis) tarjetas idénticas con icono en un cuadro redondeado [V] | Grilla de los tutoriales de Tailwind | Agrupar según la importancia; variar la composición de sección a sección; icono al lado del título o nada [V] |
| Borde izquierdo o superior de color en tarjetas [V] | Tell más específico (Krebs, Impeccable) | Solo para estados reales (alerta, advertencia clínica) [V] |
| Radio grande, sombra suave, borde gris de 1px, todo a la vez [V] | Defaults de shadcn y Tailwind | Elegir borde **o** sombra; escala de radios propia, pequeña y coherente [V: Impeccable] |
| Tarjetas dentro de tarjetas [V] | Envolver todo por reflejo | Espacio, tipografía y divisores [V] |
| Glassmorphism y blobs con blur de fondo [V] | Moda de 2021–22 que quedó en los datos | Textura con sentido: papel, grano, grilla de papel milimetrado solo si tiene significado [I] |
| Botones con gradiente [V] | Tailwind UI y plantillas | Botón sólido en el color de acento con estados hover, active y focus [V/I] |
| Emojis como iconos; Lucide o Heroicons sin criterio [V: emojis; I: Lucide] | Salida barata y visible | Pocos iconos, de una sola familia y con función. Mejor ilustraciones o fotos reales [I] |
| Stats bar con cifras inventadas; "hero metric" [V] | Plantilla de landing | Solo cifras verificables y con fuente; si no las hay, no se ponen [V] |
| Testimonios falsos (nombre de pila e inicial, avatar de iniciales) [V] | El modelo rellena lo que falta | Testimonio real con nombre, rol y foto, o un marcador visible `[TESTIMONIO REAL PENDIENTE]` [V/I] |
| Numeración 01/02/03 decorativa [V] | Plantilla | Solo cuando hay una secuencia real (por ejemplo, pasos de un algoritmo clínico) [V] |
| Copy: "Unlock", "Seamless", "Elevate", "Supercharge", "Empower"; "No es X, es Y"; guiones largos [V] | Estilo promedio de marketing | Decir qué puede hacer la persona y qué mejora para ella. Punto seguido en vez de guion largo [V] |
| Hover con translateY y fade-in on scroll en todo; rebotes; pulsos; marquesinas [V: rebote, pulso, marquesina, zoom; I: translateY] | Animar "para que se vea vivo" | Un solo momento orquestado; `prefers-reduced-motion`; contenido visible aunque el JS falle [V] |
| Espaciado uniforme en todo (p-6 y gap-6 por todas partes) [V] | Clases por defecto | Escala de espaciado: lo relacionado va cerca y los grupos distintos más separados [V] |
| Orden de secciones idéntico: hero, features, social proof, pricing, FAQ, footer [V] | Plantilla aprendida | Ordenar según el viaje real del usuario [I] |
| Ausencia de imágenes reales [V] | Conseguir una imagen exige decidir\[15\] | Al menos una imagen real en cada página importante [V] |
| Contraste insuficiente en modo oscuro [V] | Texto gris medio | WCAG AA 4,5:1 como mínimo [V] |

### 5. Técnicas de prompting que sí cambian el resultado

1. **Nombrar los defaults que se prohíben.** Anthropic lo resume así: "Tell Claude to 'avoid Inter and Roboto'… and results improve immediately." [V]\[1\]
2. **Anclar en el tema y en un único trabajo de la página**, antes de hablar de estética. [V, skill]\[3\]
3. **Plan de tokens primero, código después**, con una revisión explícita contra el default. [V, skill]\[3\]
4. **Guiar a la altura correcta.** Anthropic recomienda evitar tanto el hex codificado sin razón como las vaguedades.\[1\] En tu caso, fijar tus tokens de marca sí es correcto porque ya son decisiones tomadas. [V/I]
5. **Separar generación y crítica.** En otra pasada o con un subagente, pide una crítica escéptica con criterios fijos (calidad, originalidad, oficio, función), ojalá con capturas de pantalla. [V, Anthropic Engineering]\[9\]
6. **Reglas verificables mejor que adjetivos.** "Sin `linear-gradient` en texto" funciona mejor que "sé original". [V, Solo Design, indicio]\[16\]
7. **Pedir 2–3 direcciones como wireframes ASCII o bocetos** y elegir una antes de construir. [V: la skill usa ASCII para comparar; I: pedir varias]
8. **Dar referencias concretas** (temas de IDE, estéticas culturales, un sitio que admiras), sin pedir "hazlo como Linear". Copiar a Linear es solo otro promedio (925Studios). [V]\[17\]
9. **Persistir las decisiones.** Un DESIGN.md importado desde CLAUDE.md evita que cada página se vuelva a decidir y que se desvíe.\[4\] [V: CodeMySpec, docs de imports]\[4\]\[10\]
10. **Detector automático** como compuerta: `npx impeccable detect src/`.\[12\] [V]\[14\]

### 6. Aplicación a tu contexto (inferencia mía salvo que se indique)

- **Guías clínicas en Ghost (modo *Read*).** La prioridad es la comprensión. La guía federal *Health Literacy Online* (ODPHP/HHS) recomienda [V]: fuente de al menos 16px (19px si el público es mayor), interlineado de 130–150 %, no más de 3 fuentes por página, espacio en blanco, fragmentos cortos y listas, encabezados con significado y enlaces identificables por color o subrayado.\[18\]\[19\]\[20\] Para médicos y estudiantes, la densidad puede ser mayor que para pacientes, pero con una jerarquía impecable [I]. El borde de color en tarjetas **sí tiene sentido** en una alerta clínica real (contraindicación, bandera roja) y en ningún otro caso [I]. En Ghost, los tokens se pueden declarar como variables CSS en la inyección de código o en el tema [I; no verificado en esta investigación].
- **Landings de venta de cursos (modo *Persuade*, término de Impeccable).** El "mundo del tema" de la educación médica tiene mucho material propio: láminas anatómicas, atlas, historias clínicas, electrocardiogramas, fichas de laboratorio, algoritmos de manejo, la tradición tipográfica de los textos médicos y la iconografía de los hospitales colombianos [I]. Usa esa materialidad en vez de gradientes. Nada de cifras inventadas ("+10.000 médicos") ni de testimonios de relleno: además de ser un *tell*, en salud comprometen la credibilidad y posiblemente la regulación publicitaria [I; no verifiqué la normativa colombiana].
- **Tiendas (modo *Persuade/Operate*).** El producto real (fotos, capturas del curso, índice del temario) es el héroe [I].
- **Dashboards y plataformas de cursos (modo *Operate*).** Importan la escaneabilidad y la consistencia; la marca vive en los detalles [V: Impeccable].\[21\]
- **Idioma.** El copy debe ir en español neutro colombiano, con términos médicos precisos y sin anglicismos de marketing [I].

---

## Recommendations

1. **Instala primero lo oficial:** la skill `frontend-design` (`npx skills add https://github.com/anthropics/skills --skill frontend-design`, o el plugin de Claude Code).\[1\]\[22\] Suma el CLAUDE.md de abajo como capa personal.
2. **Crea un `DESIGN.md` por marca o proyecto** con los tokens reales de tus plataformas, e impórtalo con `@DESIGN.md`. Así la dirección se decide una vez y no se re-decide en cada página.
3. **Mantén el CLAUDE.md por debajo de 200 líneas** (recomendación oficial). Si crece, mueve partes a `.claude/rules/` con `paths:` (por ejemplo, reglas de Ghost solo para `*.hbs`).\[10\]
4. **Añade una compuerta mecánica:** `npx impeccable detect` antes de publicar, o el checklist final que va en el CLAUDE.md.
5. **Revisa tú, no solo Claude:** abre el resultado en el móvil y cuenta las señales. Con 4 o más, es slop según el umbral de Krebs.\[2\]
6. **Actualiza el archivo cada vez que detectes un nuevo cliché.** Los defaults cambian con cada modelo y cada época (Impeccable los separa en eras: 2022, 2025 y 2026).\[12\]

---

## Borrador de CLAUDE.md anti-IA (listo para copiar)

```markdown
# CLAUDE.md — Diseño intencional, no "AI slop"

> Contexto: plataformas de educación médica (guías clínicas en Ghost, landings de cursos,
> tiendas, páginas HTML). Público: médicos, estudiantes y profesionales de la salud en Colombia.
> Idioma de la interfaz: español (Colombia), sentence case.
> Si existe, lee y obedece @DESIGN.md (tokens de marca). La marca y el brief siempre ganan
> sobre estas reglas generales.

## 0. Por qué existe este archivo
Tiendes a converger en salidas genéricas "on distribution" (Inter, gradiente morado sobre
blanco, hero centrado, tres tarjetas). Tu trabajo es tomar decisiones específicas para ESTE
tema y ESTE público. Lo genérico es peor que lo feo: no se recuerda y resta credibilidad.

## 1. Proceso obligatorio ANTES de escribir código
1. **Anclar**: escribe en 3 líneas: tema concreto · público · el ÚNICO trabajo de la página.
   Declara el modo: Leer (guía clínica) / Persuadir (landing, tienda) / Operar (app, dashboard).
2. **Mundo del tema**: lista 5 materiales, objetos o vernáculos propios del tema
   (p. ej. láminas anatómicas, ECG, historia clínica, atlas, algoritmo de manejo).
   De ahí salen las decisiones visuales, no de "landing SaaS".
3. **Plan de tokens** (compacto):
   - Color: 4–6 hex con nombre y función (1 dominante, 1 acento, neutros). Di por qué
     cada color pertenece al tema.
   - Tipo: display (con carácter, usado con moderación) + cuerpo + utilitaria para datos
     si hace falta. Máx. 3 familias. Escala con contraste real.
   - Layout: una frase + wireframe ASCII. Si dudas, propón 2 direcciones en ASCII.
   - Firma: EL elemento por el que se recordará la página. Solo uno.
4. **Revisión anti-default**: pregúntate "¿llegaría a esto con cualquier prompt parecido?".
   Si la respuesta es sí en algún punto, cámbialo y di qué cambiaste y por qué.
5. Solo entonces escribe el código, derivando TODO color y tipo de los tokens
   (variables CSS en :root; nada de hex sueltos).

## 2. Prohibiciones explícitas (y qué hacer en su lugar)
Excepción única: el brief o DESIGN.md lo pide explícitamente.

| NO | EN SU LUGAR |
|---|---|
| Gradientes morado/índigo/violeta/azul-púrpura; `indigo-500/600` | Paleta propia de tokens; color en superficies sólidas |
| Neón/cian sobre negro, halos radiales, glows, sombras de color | Contraste por luminosidad; oscuro solo si la tarea lo justifica |
| Crema #F4F1EA + serif + terracota como salida automática | Solo si nace del tema; justifícalo por escrito |
| Negro + un único acento verde ácido/bermellón por reflejo | Ídem |
| Verde esmeralda como "alternativa segura" al morado | Color derivado del tema, con razón escrita |
| Texto con gradiente (`background-clip: text`) | Titular en un solo color; énfasis por tamaño/peso |
| Inter, Roboto, Arial, Open Sans, Lato, system-ui | Pares elegidos por el registro del tema |
| Space Grotesk, Geist, Instrument Serif, Playfair por defecto | Solo con razón escrita; nunca repetir el par del proyecto anterior |
| Una palabra en serif itálica dentro de un hero en sans | Tratamiento tipográfico coherente de todo el titular |
| Hero centrado + badge/pastilla sobre el H1 | Hero como tesis: lo más característico del tema (imagen real, caso, fragmento de guía) |
| Eyebrows en MAYÚSCULAS con tracking sobre cada sección | Quitarlos o integrar la palabra en el título |
| Grilla de 3/6 tarjetas idénticas con icono en cuadro redondeado | Composición según importancia; variar layout entre secciones |
| Borde izquierdo/superior de color en tarjetas | Solo para estados reales (alerta clínica, advertencia) |
| Radio grande + sombra suave + borde 1px gris a la vez | Borde O sombra; escala de radios pequeña y coherente |
| Tarjetas dentro de tarjetas | Espacio, tipografía y divisores |
| Glassmorphism, blobs con blur, fondos de grilla decorativa | Textura con significado para el tema, o superficie limpia |
| Botones con gradiente | Botón sólido con estados hover/active/focus visibles |
| Emojis como iconos; iconos gigantes decorativos | Pocos iconos, una familia, con función; mejor imágenes reales |
| Numeración 01/02/03 decorativa | Solo si es una secuencia real (pasos de un algoritmo) |
| Stats bar / "hero metric" con cifras inventadas | Cifras verificables con fuente, o nada |
| Testimonios inventados (nombre + inicial, avatar de iniciales) | Testimonio real o marcador `[TESTIMONIO REAL PENDIENTE]` |
| Orden fijo: hero > features > social proof > pricing > FAQ | Orden según el recorrido real del usuario |
| Hover translateY/zoom en todo, fade-in en cada sección, rebotes, pulsos, marquesinas | Un solo momento de motion orquestado, o ninguno |
| Espaciado uniforme (p-6/gap-6 por todas partes) | Escala de espaciado: cerca lo relacionado, lejos lo distinto |
| Imágenes placeholder o SVG toscos | Imagen real o espacio vacío con marcador `[IMAGEN: …]` |

## 3. Dirección estética
- Elige UNA dirección y ejecútala con precisión (editorial/revista médica, suizo/tipográfico,
  atlas científico, clínico-utilitario, orgánico, retro de manual, etc.). Nombra la dirección.
- Gasta la audacia en un solo lugar (la firma); todo lo demás, silencioso y disciplinado.
- Varía entre proyectos: claro/oscuro, familias, composición. No repitas el proyecto anterior.
- Antes de entregar, quita un "accesorio" (regla de Chanel).

## 4. Tipografía
- Cuerpo ≥ 16px (18–19px en guías de lectura larga o público mayor); interlineado 1,4–1,6;
  medida 60–75 caracteres; alineado a la izquierda, nunca justificado.
- Escala con contraste claro entre display y cuerpo; pesos distantes, no 400 vs 600.
- Máx. 3 familias. Mayúsculas solo en etiquetas muy cortas; nunca en párrafos.
- Cifras clínicas (dosis, valores de laboratorio): fuente con numerales tabulares, legibles.
- Carga las fuentes con `font-display: swap` y define una pila de respaldo coherente.

## 5. Color
- Todo sale de variables CSS (`--color-ink`, `--color-surface`, `--color-accent`…).
- Un dominante + un acento con decisión; neutros con temperatura propia (no gris Tailwind).
- Contraste WCAG AA mínimo (4,5:1 texto normal, 3:1 texto grande). Nunca gris sobre color.
- Color semántico clínico reservado y consistente (advertencia, contraindicación, dato clave);
  no uses rojo/ámbar como decoración.

## 6. Layout y composición
- La estructura es información: cada divisor, número o etiqueta debe codificar algo cierto.
- Permite asimetría y ritmo variable entre secciones; no repitas el mismo bloque 5 veces.
- Guías clínicas (modo Leer): columna de lectura, índice navegable, encabezados con
  significado (h1 > h2 > h3 sin saltos), tablas y algoritmos legibles en móvil.
- Dashboards (modo Operar): escaneabilidad y consistencia antes que expresión.
- Mobile first; nada de scroll horizontal; texto nunca pegado al borde.

## 7. Componentes
- Una escala de radios, una de sombras, una de espaciado; todas en tokens.
- Tarjeta solo si la elevación comunica jerarquía real.
- Estados completos: hover, active, focus-visible, disabled, cargando, vacío, error.
- Callouts clínicos (alerta, perla, contraindicación) con estilo propio y consistente,
  distinto de cualquier tarjeta decorativa.

## 8. Motion
- Por defecto, poco o nada. Si lo usas: un momento orquestado (p. ej. carga escalonada)
  que sirva al tema.
- Solo `transform`/`opacity`; nunca animes tamaño o layout.
- Respeta `prefers-reduced-motion`; el contenido debe verse aunque el JS falle
  (nada oculto con opacity:0 esperando un script).
- Prohibido: rebote/elástico, pulsos, cursores parpadeantes, marquesinas, zoom en hover.

## 9. Copy y contenido
- Escribe desde el lado de quien usa la página: qué puede hacer y qué gana, en concreto.
- Prohibido: "Desbloquea", "Potencia", "Eleva", "Transforma", "sin fricción", "de clase
  mundial", "revoluciona", "No es X, es Y", "más que un curso". Sin guiones largos (—):
  usa punto, coma o dos puntos.
- Botones con verbo exacto ("Inscribirme al curso", no "Enviar"); el mismo nombre en todo
  el flujo ("Publicar" → "Publicado").
- Errores: qué pasó y cómo arreglarlo, sin disculpas ni vaguedad. Estado vacío = invitación
  a actuar.
- NUNCA inventes datos: cifras, testimonios, avales, acreditaciones, número de alumnos,
  referencias bibliográficas. Si faltan, usa marcadores visibles `[DATO PENDIENTE: …]`.
- Contenido médico: precisión terminológica, fuentes citadas cuando aplique, sin promesas
  de resultados.

## 10. Checklist final anti-IA (obligatorio; reporta el resultado)
Marca cada punto. Si fallan 2 o más, corrige antes de entregar.
- [ ] ¿La paleta viene de los tokens y del tema (sin morado/índigo/neón/crema por reflejo)?
- [ ] ¿La tipografía NO es Inter/Roboto/Arial/system ni el par "alternativo" de siempre?
- [ ] ¿El hero es una tesis del tema, sin badge sobre el H1 ni gradiente en el titular?
- [ ] ¿Cero eyebrows decorativos, cero numeración 01/02/03 sin secuencia real?
- [ ] ¿Ninguna grilla de tarjetas idénticas con icono arriba? ¿Cero bordes laterales de color
      fuera de alertas reales? ¿Cero tarjetas anidadas?
- [ ] ¿Sin glassmorphism, blobs, glows, grillas decorativas?
- [ ] ¿Motion mínima, con propósito, con reduced-motion y contenido visible sin JS?
- [ ] ¿Espaciado con ritmo (no uniforme) y jerarquía tipográfica clara?
- [ ] ¿Cero cifras, testimonios o avales inventados; marcadores donde falte info?
- [ ] ¿Copy sin palabras de marketing vacías ni guiones largos; botones con verbo exacto?
- [ ] ¿Contraste AA, foco visible, h1-h2-h3 sin saltos, cuerpo ≥16px, móvil correcto?
- [ ] ¿Hay al menos una imagen/elemento real del tema, o un marcador explícito?
- [ ] Prueba del sustituto: si cambio el nombre de la marca, ¿podría ser de cualquier otra?
      Si sí, no está terminado.
- [ ] Nombra la firma y la dirección elegidas en 1 línea al entregar.
```

---

## Caveats

- **Qué está verificado y qué no.** Las citas de Anthropic (blog, cookbook, skill, documentación de CLAUDE.md, blog de ingeniería), Krebs, Impeccable, TeneX, Solo Design, CodeMySpec y ODPHP vienen de lectura directa de las páginas. El tuit de Wathan lo verifiqué por el propio tuit y por varias fuentes que lo reproducen. Todo lo aplicado a educación médica, Ghost y Colombia es **inferencia mía**. No verifiqué la normativa colombiana de publicidad en salud ni detalles técnicos de Ghost.
- **La skill oficial cambia.** Hay versiones distintas en `anthropics/skills` y en el plugin de `anthropics/claude-code`. La que cito es la de `anthropics/skills` consultada en septiembre de 2026. Las listas de fuentes "buenas" del cookbook (Space Grotesk, Playfair, Fraunces) ya aparecen como clichés en las fuentes de 2026: la guía se vuelve obsoleta rápido.
- **Sesgo comercial.** 925Studios, TeneX, Solo Design Studio y CodeMySpec venden servicios o herramientas. Sus datos (por ejemplo, el experimento de "guía escrita vs. compuerta mecánica") son de un solo autor y no están replicados.
- **Método de Krebs.** Son detecciones heurísticas sobre Show HN, con 5–10 % de falsos positivos. Mide coincidencia con patrones, no autoría de IA ni calidad o conversión. El propio Krebs dice que estas páginas no son "malas".\[2\]
- **Datos antiguos.** El dato de credibilidad de Stanford es de 2002. Las pautas de Health Literacy Online son de EE. UU., pensadas para público general y pacientes. Para público médico profesional, adáptalas.
- **CLAUDE.md es contexto, no ley.** Claude puede no seguir alguna regla. Para prohibiciones duras, usa hooks\[10\] o un detector como `npx impeccable detect`, y revisa siempre en pantalla. Un aviso más: ninguna lista de prohibiciones da buen gusto por sí sola. Si solo prohíbes, el modelo migra al siguiente cliché; lo que evita eso es tomar decisiones positivas ancladas en el tema.

## Fuentes

1. [Improving frontend design through Skills | Claude by Anthropic](https://claude.com/blog/improving-frontend-design-through-skills)
2. [Scoring Show HN submissions for AI design patterns](https://www.adriankrebs.ch/blog/design-slop/)
3. [skills/skills/frontend-design/SKILL.md at main · anthropics/skills](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md)
4. [How to Keep Your Website From Looking Like Every Other Vibe Coded Website](https://codemyspec.com/blog/vibe-coded-websites-look-the-same)
5. [Prompting for frontend aesthetics | Claude Cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics)
6. [Why Every AI-Built Website Looks the Same (Blame Tailwind's Indigo-500) - DEV Community](https://dev.to/alanwest/why-every-ai-built-website-looks-the-same-blame-tailwinds-indigo-500-3h2p)
7. [Adam Wathan on X: "I'd like to formally apologize for making every button in Tailwind UI \`bg-indigo-500\` five years ago, leading to every AI generated UI on earth also being indigo." / X](https://x.com/adamwathan/status/1953510802159219096)
8. [Why Does AI Love Purple? A CSS Syntax Sparks a "Global Design Convergence" Phenomenon | Communeify](https://www.communeify.com/en/blog/why-ai-loves-purple-global-design-convergence/)
9. [Harness design for long-running application development](https://anthropic.com/engineering/harness-design-long-running-apps)
10. <https://code.claude.com/docs/en/memory>
11. [AI Design Slop: 16 Patterns That Out Your App as Vibe-Coded](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it)
12. [The missing design vocabulary for agents.](https://impeccable.style/slop/)
13. [Impeccable:A design skill framework for AI coding harnesses, bringing curated frontend design expertise and 17 commands to tools like Cursor, Claude Code, Gemini CLI, and more. - MOGE](https://moge.ai/product/impeccable)
14. [Impeccable — AI Design Skills for Cursor & Claude Code](https://webdeveloper.com/tools/impeccable/)
15. [AI slop: 8 signs a website was generated by AI. — TeneX Studio](https://tenex.studio/en/blog/ai-slop-ui-8-signes/)
16. [AI design slop: the tells, and how I built a tool to catch them](https://solodesign.cc/blog/ai-design-slop-the-tells/)
17. [AI Slop Fonts and Gradients: The Tells That Give Away AI Design](https://www.925studios.co/blog/ai-slop-design-tells)
18. [Use a readable font that’s at least 16 pixels. - Health Literacy Online | odphp.health.gov](https://odphp.health.gov/healthliteracyonline/2016/display/section-3-3/)
19. [Section 5.3 Use a readable font that’s at least 16 pixels - Health Literacy Online | odphp.health.gov](https://odphp.health.gov/healthliteracyonline/design-easy-scanning/use-readable-font-thats-least-16-pixels)
20. [Checklist - Health Literacy Online | odphp.health.gov](https://odphp.health.gov/healthliteracyonline/2016/checklist/)
21. [impeccable/skill/SKILL.src.md at main · pbakaus/impeccable](https://github.com/pbakaus/impeccable/blob/main/skill/SKILL.src.md)
22. [frontend-design — anthropics/skills](https://www.skills.sh/anthropics/skills/frontend-design)
