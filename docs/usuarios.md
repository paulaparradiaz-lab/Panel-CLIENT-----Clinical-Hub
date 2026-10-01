# Usuarios · cómo entran los médicos al panel

Este documento es la premisa del sistema de usuarios. Todo lo que se construya
(tablas, pantallas, automatizaciones) sigue este flujo. Si algo cambia, se cambia
primero aquí.

Proyecto de Supabase: **Clinical hub - Usuarios** (`fzgezaxmdjtuygztvhvw`, us-east-1).
Prototipo publicado para probar (GitHub Pages, https):
`https://paulaparradiaz-lab.github.io/Panel-CLIENT-----Clinical-Hub/prototipo/panel.html`.
El proyecto **Clinical hub - Backoffice** es del panel de administradores y no se toca.

## El flujo

```
1. El médico compra en Hotmart
        ↓ Hotmart avisa a n8n (webhook)
2. n8n
   ├─ comprueba que el aviso viene de Hotmart (hottok)
   ├─ crea el usuario en Supabase con el correo de la compra (o lo encuentra si ya existe)
   ├─ guarda la compra: nombre, teléfono, país, plan, estado y hasta cuándo
   └─ envía la bienvenida por correo y por WhatsApp: «Ya puedes entrar» + enlace al login
        ↓
3. Login del panel: dos formas de entrar
   a) Correo (siempre disponible, y la única la primera vez)
      ├─ el médico escribe el correo con el que compró
      ├─ Supabase le envía el enlace mágico y, en el mismo correo, un código de 6 dígitos
      └─ entra (con el enlace o escribiendo el código)
   b) Huella o Face ID (passkey), en los dispositivos donde ya la activó
      └─ un toque y entra, sin correo
   Después de entrar con el correo se le ofrece una vez «Entra más rápido la próxima
   vez»: activar la passkey en ese dispositivo (como en el panel del admin).
        ↓
4. Al entrar, antes de todo: ventana «Antes de empezar» (bloquea el panel)
   ├─ especialidad (se pide aquí, una sola vez; el nombre NO se pide: viene de Hotmart)
   ├─ enlaces para leer los tres documentos completos
   ├─ casilla: declara que es profesional de la salud (términos, numeral 9)
   ├─ casilla: acepta términos y condiciones, política de privacidad y aviso clínico y editorial
   └─ «Aceptar y entrar» → queda la firma (ver tabla `aceptaciones`)
   Vuelve a aparecer si cambia la versión de cualquiera de los tres documentos.
        ↓
5. Panel
```

Reglas del flujo:

- **Solo entra quien compró (o quien Paula invitó).** El login nunca crea cuentas: si el
  correo no existe, se muestra «No encontramos una compra con este correo» y cómo
  escribir a soporte.
- **Enlace y código juntos.** En el celular, el enlace puede abrirse en el navegador
  interno de la app de correo y la sesión queda allí. Con el código, el médico siempre
  puede entrar en el navegador donde está.
- **La consulta rápida no se guarda.** Las conversaciones desaparecen al cerrarla.
- **La consulta rápida no estará habilitada al lanzar.** Antes de habilitarla hay que
  ajustar los documentos legales (ver `docs/legal/revision.md`, puntos 1, 2 y 5).

Passkeys: en Supabase son **experimentales** (igual que en el admin). Se activan en
Authentication › Passkeys y en el cliente con `experimental: { passkey: true }`. Solo
funcionan en una dirección segura: `localhost` o el dominio con https (no en la IP de
la red local).

## Quién hace qué

| Pieza | Responsable | Qué hace |
|---|---|---|
| Webhook de Hotmart | **n8n** | Recibe compras, renovaciones, reembolsos y cancelaciones |
| Crear el usuario | **n8n** → Supabase (API de administración) | Crea el usuario con el correo de la compra, ya confirmado |
| Guardar la compra | **n8n** → Supabase (función `registrar_compra`) | Guarda o actualiza perfil y suscripción en un solo paso |
| Correo y WhatsApp de bienvenida | **n8n** | Igual que hoy con Ghost |
| Correo del enlace mágico y el código | **Supabase** | Plantilla en español con la marca |
| Login, perfil, aceptación, avisos | **Panel** | Pantallas de este proyecto |
| Seguridad de los datos | **Supabase** (RLS) | Cada médico ve y cambia solo lo suyo |

La llave de administración de Supabase (service role) vive **solo** en las credenciales
de n8n. Nunca va en el panel, en el código ni en un chat.

## Lo que n8n le manda a Supabase

**Paso 1 · Crear el usuario** (API de administración de Supabase Auth)

- `POST /auth/v1/admin/users` con
  `{ "email": "<correo de la compra>", "email_confirm": true, "user_metadata": { "nombre": "<nombre del comprador en Hotmart>" } }`.
  El nombre es el que aparece al pie del menú. No se le pide al médico: sale siempre de
  la compra en Hotmart.
- Si el correo ya existe, se busca su id y se sigue al paso 2 (una persona que renueva o
  compra otra vez no se duplica).

**Paso 2 · Registrar la compra** (función de la base de datos, una sola llamada)

`registrar_compra(usuario, correo, nombre, telefono, pais, plan, estado, vence, transaccion, evento)`

- Es idempotente: si Hotmart repite el aviso con la misma `transaccion`, no duplica nada.
- Guarda o actualiza el perfil y la suscripción.

**Eventos de Hotmart → estado de la suscripción**

| Evento de Hotmart | Estado | Acceso |
|---|---|---|
| Compra aprobada / completa | `activa` | Sí |
| Renovación mensual | `activa`, `vence` se extiende un mes | Sí |
| Reembolso, contracargo | `revocada` | No |
| Cancelación de la suscripción | `cancelada` (activa hasta `vence`) | Hasta `vence` |
| Vencida sin renovar | `vencida` | No: ve «Tu suscripción venció» con el enlace para renovar |

## Tablas (borrador, todavía no se crean)

| Tabla | Qué guarda | Quién la ve |
|---|---|---|
| `perfiles` | id (el del usuario), nombre, correo, teléfono, país, especialidad, origen (`hotmart` o `invitado`), fechas | El médico, solo el suyo |
| `suscripciones` | usuario, plan, estado, vence, transacción y último evento de Hotmart | El médico, solo la suya (solo lectura) |
| `documentos_legales` | tipo (términos, privacidad, aviso clínico), versión (fecha de «Última actualización»), enlace | Todos (lectura) |
| `aceptaciones` | usuario, documento, versión, fecha y hora, texto de la declaración, navegador (registro de la firma, Decreto 1377, art. 7) | El médico, solo las suyas (solo lectura: no se borran ni se editan) |
| `favoritos` | usuario, contenido, fecha | El médico, solo los suyos |
| `aperturas` | usuario, contenido, fecha (para «Lo que más consultas») | El médico, solo las suyas |
| `metricas_admin` (vista) | Totales sin nombres: aperturas por contenido, número de consultas rápidas | Solo el panel del admin, solo lectura |

Si un documento legal cambia de versión, el panel vuelve a pedir que se acepte.

## Cambiar el correo de un médico

El correo une la cuenta con Hotmart. El médico no lo puede cambiar en el panel; lo pide por
WhatsApp (Mis datos lo dice). Entonces el equipo:

1. Cambia el correo en Hotmart.
2. Cambia el correo de la **misma** cuenta en Supabase (editor SQL):
   `select public.cambiar_correo('correo@actual.com', 'correo@nuevo.com');`
   Así conserva su nombre, especialidad, firmas y favoritos. Nunca se crea una cuenta nueva
   para el correo nuevo: sería una cuenta vacía.
3. Si después llega un aviso de Hotmart con el correo nuevo, n8n intentará crear la cuenta y
   Supabase responderá que ya existe: n8n debe ignorar ese error y seguir con el paso de
   guardar el aviso.

## Quién puede probar

- **Sin compra:** Paula crea la cuenta y le da acceso con `invitar()`: estado **Cortesía**
  para probadores e invitados, **Co-founder** para Paula y Hamilton (desde Supabase o, más
  adelante, desde el panel del admin). n8n le manda la misma bienvenida.
- **Compras de prueba:** el modo de prueba de Hotmart, para verificar el flujo completo
  sin cobrar.

## Pantallas del panel que salen de este flujo

1. **Entrar:** campo de correo y botón «Enviarme el enlace».
2. **Revisa tu correo:** «Te enviamos un enlace y un código a [correo]», campo de 6
   dígitos y «Reenviar».
3. **No encontramos una compra con este correo:** dos formas de pedir ayuda,
   «Escríbenos por WhatsApp» y «Escríbenos al correo» (sustanciapro@gmail.com). Las dos
   abren el mensaje ya escrito, con el correo que intentó usar en lugar de `[correo]`:

   > Hola, equipo de Clinical Hub. Intenté ingresar con el correo [correo] y no encontré mi compra. Es posible que la haya realizado con otro correo o que no recuerde cuál usé. ¿Me ayudan a verificarla, por favor?

   Asunto del correo: «Clinical Hub · No encuentro mi compra».
4. **Antes de empezar** (al entrar, y cada vez que cambie un documento): declaración y
   aceptación de los tres documentos. Ya está en el prototipo.
6. **Términos y políticas** (en la cuenta, entre Suscripción y Ayuda o contacto): los tres
   documentos, con la fecha en que los aceptó. Cada documento se lee completo, tal cual.
5. **Tu suscripción venció:** enlace para renovar en Hotmart.

## Pendiente

- [x] Documentos legales en `docs/legal/` (versión del 13 de agosto de 2026): términos y
      condiciones, política de privacidad y aviso clínico y editorial.
- [ ] Ajustes que Paula (o su abogado) debe decidir en esos documentos: ver
      `docs/legal/revision.md`. El texto legal no se cambia desde aquí.
- [x] Tipo de producto en Hotmart: **suscripción mensual** (cada renovación extiende `vence` un mes).
- [ ] Textos del correo de bienvenida y del WhatsApp (los manda n8n).
- [ ] Plantilla del correo del enlace mágico (Supabase), con la marca.
- [x] Canales de soporte del panel (incluido «pagué con otro correo»): **WhatsApp y correo**.
      - WhatsApp: **+57 300 406 7138** (`https://wa.me/573004067138?text=…`), con el mensaje
        de abajo ya escrito.
      - Correo: **sustanciapro@gmail.com**, que también es el canal legal de los documentos
        (derechos de datos, reporte de errores).
- [x] La especialidad se pide en la ventana «Antes de empezar», al primer ingreso.
- [x] Pantallas «Entrar», «Revisa tu correo» y «No encontramos una compra» conectadas a
      Supabase en el prototipo (enlace mágico con PKCE + código de 6 dígitos).
- [ ] Crear las tablas y la función `registrar_compra` en Supabase (con permiso de Paula).
