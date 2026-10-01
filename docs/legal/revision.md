# Revisión de los documentos legales frente a la plataforma

Documentos revisados (versión del 13 de agosto de 2026): `terminos-y-condiciones.md`,
`politica-de-privacidad.md` y `aviso-clinico-y-editorial.md`.

Esta lista **no cambia el texto legal**. Señala dónde lo que dicen los documentos no
coincide con lo que hace (o hará) el panel de médicos, para que Paula o su abogado
decidan si se ajusta el documento o la plataforma. No es asesoría jurídica.

## Lo que hace la plataforma y los documentos no mencionan

> **La consulta rápida con IA no estará habilitada al lanzar** (decisión de Paula,
> 1 de octubre de 2026). Los puntos 1 y 2, y el proveedor de IA del punto 5, quedan en
> espera: se resuelven en los documentos **antes** de habilitarla.

1. **Consulta rápida con IA.** El panel tendrá un asistente que responde preguntas con
   IA a partir del contenido. Ningún documento lo menciona.
   - Términos, numeral 2: «no la contratación de un servicio de asesoría… o software». Un
     asistente que responde preguntas puede leerse como algo más que acceso a la
     publicación.
   - Convendría decir que las respuestas las genera una IA, que pueden contener errores
     y que el descargo clínico también aplica a ellas.
   - El texto de la pregunta viaja a un proveedor de IA aunque la conversación no se
     guarde: ese proveedor no está en la tabla del numeral 7 de la política.
2. **Datos de pacientes en la consulta rápida.** La política (2.5) pide no ingresar
   información clínica de pacientes «en formularios, votaciones ni canales de contacto».
   La consulta rápida es un campo de texto libre: el aviso debería incluirla, y la
   pantalla debería recordarlo.
3. **Teléfono, país y especialidad.** La política (2.1) lista nombre, correo y datos de
   la transacción. El nuevo flujo guarda además teléfono (para WhatsApp), país y
   especialidad.
4. **WhatsApp.** Las comunicaciones por WhatsApp (bienvenida y avisos) no aparecen como
   canal en la política.
5. **Proveedores nuevos o que cambian de función** (política, numeral 7):
   - **Supabase** (base de datos y acceso, servidores en Estados Unidos): no está.
   - **Vercel** (donde se publica el panel): no está.
   - **Proveedor de IA** de la consulta rápida: no está.
   - **Proveedor de WhatsApp** (Meta u otro): no está como canal de mensajes.
   - **n8n:** aparece solo para «consolidación de votaciones»; ahora también crea los
     usuarios y envía la bienvenida.
   - **Ghost:** aparece como plataforma de miembros; se deja de usar.
6. **Secciones nuevas.** Los términos describen la publicación como guías de práctica
   clínica. El panel suma Videos de procedimientos, Herramientas interactivas,
   Autoevaluación y Entrenamiento en IA.

## Lo que dicen los documentos y la plataforma todavía no tiene

7. **Sección «Ediciones».** Los términos (numeral 3) y el aviso clínico («Vigencia del
   contenido») remiten a la sección Ediciones para verificar la fecha de cada guía.
   **Decidido: se agrega.** Ya está en el menú del prototipo, después de Nuevo, con cada
   número (volumen, número y trimestre) y las guías incorporadas o ampliadas.
8. **ISSN, volumen y número.** Los términos (3 y 7.4) dicen que cada periodo se
   identifica con volumen y número, y que la cita académica usa el ISSN. El panel no
   muestra hoy ninguno de esos datos.
9. **Tema claro u oscuro.** La política (8.1) dice que una cookie recuerda «la preferencia
   de tema claro u oscuro». El panel solo tiene modo claro.
10. **Declaración del usuario.** Los términos (numeral 9) piden declarar que es
    profesional de la salud o estudiante supervisado. Se incluye como casilla en
    «Completa tu perfil» y se guarda con la aceptación.

## Lo que ya coincide

- Acceso personal e intransferible y cancelación por Hotmart (términos 5 y 6).
- Autorización expresa al registrarse, con evidencia guardada (política, numeral 4): la
  tabla `aceptaciones` guarda documento, versión y fecha.
- Registro de consulta de guías (política 2.2): cubre el historial de aperturas.
- Estadísticas agregadas sin identificación individual (política 3.h): cubre las
  métricas que se envían al panel del admin.
- Transferencia internacional autorizada al aceptar la política (numeral 7), aunque la
  tabla de proveedores debe incluir los nuevos (punto 5).
- Canal de derechos de datos y reporte de errores: sustanciapro@gmail.com. El soporte de
  acceso del panel será por WhatsApp (+57 300 406 7138) y por ese mismo correo.
