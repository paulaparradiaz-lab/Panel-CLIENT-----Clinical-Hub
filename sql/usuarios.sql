-- ============================================================
-- Clinical hub - Usuarios · base de datos de los médicos
-- ============================================================
-- Opción A (igual que el panel del admin): n8n guarda cada aviso de Hotmart
-- tal cual en «hotmart_eventos» y la base calcula sola el perfil y la
-- suscripción de cada médico. Ver docs/usuarios.md.
--
--   1. hotmart_eventos      bitácora: un aviso por fila (nunca se borra)
--   2. perfiles             datos del médico (de Hotmart) + su especialidad
--   3. suscripciones        estado de la suscripción de cada médico
--   4. documentos_legales   los tres documentos y su versión vigente
--   5. aceptaciones         la firma de cada documento (no se borra ni se edita)
--   6. favoritos, aperturas lo que guarda y lo que abre cada médico
--   7. hotmart_aplicar()    pasa los avisos al perfil y a la suscripción
--   8. v_mi_cuenta          la cuenta del médico que está dentro, con su acceso
--   9. invitar()            dar acceso a un probador sin compra en Hotmart

-- ------------------------------------------------------------
-- 1. Bitácora de Hotmart (mismos campos y limpieza que el admin;
--    sin las columnas de facturación, que viven en el admin)
-- ------------------------------------------------------------
create table if not exists public.hotmart_eventos (
  datos               jsonb not null,
  -- No se guarda dos veces el mismo aviso: evento + transacción; la cancelación
  -- de suscripción (sin transacción) usa evento + suscriptor + fecha.
  clave               text generated always as (
                        coalesce(
                          (datos ->> 'event') || ':' || (datos #>> '{data,purchase,transaction}'),
                          (datos ->> 'event') || ':' || coalesce(datos #>> '{data,subscription,subscriber,code}',
                                                                 datos #>> '{data,subscriber,code}')
                                              || ':' || (datos #>> '{data,cancellation_date}'),
                          datos ->> 'id')) stored primary key,
  evento              text generated always as (datos ->> 'event') stored,
  fecha               timestamptz generated always as
                        (to_timestamp(((datos ->> 'creation_date')::bigint) / 1000.0)) stored,
  suscriptor          text generated always as
                        (coalesce(datos #>> '{data,subscription,subscriber,code}',
                                  datos #>> '{data,subscriber,code}')) stored,
  correo              text generated always as
                        (lower(coalesce(datos #>> '{data,buyer,email}',
                                        datos #>> '{data,subscriber,email}'))) stored,
  nombre              text generated always as
                        (coalesce(datos #>> '{data,buyer,name}',
                                  datos #>> '{data,subscriber,name}')) stored,
  telefono            text generated always as
                        (nullif(datos #>> '{data,buyer,checkout_phone}', '')) stored,
  pais                text generated always as
                        (coalesce(datos #>> '{data,purchase,checkout_country,iso}',
                                  datos #>> '{data,buyer,address,country_iso}')) stored,
  ciudad              text generated always as (datos #>> '{data,buyer,address,city}') stored,
  plan                text generated always as (datos #>> '{data,subscription,plan,name}') stored,
  transaccion         text generated always as (datos #>> '{data,purchase,transaction}') stored,
  proximo_cobro       timestamptz generated always as
                        (to_timestamp((coalesce(datos #>> '{data,purchase,date_next_charge}',
                                                datos #>> '{data,date_next_charge}')::bigint) / 1000.0)) stored,
  recibido_en         timestamptz not null default now()
);
create index if not exists hotmart_eventos_correo     on public.hotmart_eventos (correo, fecha desc);
create index if not exists hotmart_eventos_suscriptor on public.hotmart_eventos (suscriptor, fecha desc);

-- Antes de guardar: si llegó el item entero de n8n se toma solo el body (el
-- hottok nunca se guarda, ni en el item ni dentro del body) y se quitan
-- documento, dirección exacta e IP.
create or replace function public.hotmart_limpiar()
returns trigger language plpgsql set search_path = '' as $$
begin
  if new.datos ? 'body' then new.datos := new.datos -> 'body'; end if;
  new.datos := (new.datos - 'hottok')
    #- '{data,buyer,document}'          #- '{data,buyer,document_type}'
    #- '{data,buyer,address,address}'   #- '{data,buyer,address,number}'
    #- '{data,buyer,address,neighborhood}' #- '{data,buyer,address,complement}'
    #- '{data,buyer,address,zipcode}'   #- '{data,purchase,buyer_ip}';
  return new;
end; $$;
drop trigger if exists hotmart_limpiar on public.hotmart_eventos;
create trigger hotmart_limpiar before insert on public.hotmart_eventos
  for each row execute function public.hotmart_limpiar();

-- Solo n8n escribe (con la clave secreta, que no pasa por estas reglas).
-- Desde el panel nadie la lee.
alter table public.hotmart_eventos enable row level security;
revoke all on public.hotmart_eventos from anon, authenticated;

-- ------------------------------------------------------------
-- 2. Perfiles
-- ------------------------------------------------------------
create table if not exists public.perfiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  correo        text not null,
  nombre        text,
  telefono      text,
  pais          text,
  ciudad        text,
  especialidad  text,             -- la pone el médico (y puede cambiar su nombre)
  origen        text not null default 'hotmart' check (origen in ('hotmart', 'invitado')),
  creado        timestamptz not null default now(),
  actualizado   timestamptz not null default now()
);
alter table public.perfiles enable row level security;
revoke all on public.perfiles from anon, authenticated;
grant select on public.perfiles to authenticated;
-- El médico cambia su nombre y su especialidad (solo para la plataforma).
-- El correo nunca: une la cuenta con Hotmart y lo cambia el equipo.
grant update (nombre, especialidad, actualizado) on public.perfiles to authenticated;
create policy "ver mi perfil" on public.perfiles
  for select to authenticated using (id = (select auth.uid()));
create policy "cambiar mi nombre y especialidad" on public.perfiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- ------------------------------------------------------------
-- 3. Suscripciones (la escribe solo la base, a partir de los avisos)
-- ------------------------------------------------------------
create table if not exists public.suscripciones (
  usuario        uuid primary key references auth.users (id) on delete cascade,
  suscriptor     text,
  plan           text,
  ultimo_evento  text not null,    -- PURCHASE_APPROVED, SUBSCRIPTION_CANCELLATION… o INVITADO
  vence          timestamptz,      -- próximo cobro: hasta cuándo está pagado
  actualizado    timestamptz not null default now()
);
alter table public.suscripciones enable row level security;
revoke all on public.suscripciones from anon, authenticated;
grant select on public.suscripciones to authenticated;
create policy "ver mi suscripcion" on public.suscripciones
  for select to authenticated using (usuario = (select auth.uid()));

-- Mismos estados que el admin (v_hotmart_suscripciones)
create or replace function public.estado_suscripcion(evento text, vence timestamptz)
returns text language sql stable set search_path = '' as $$
  select case evento
    when 'PURCHASE_APPROVED'         then 'activa'
    when 'PURCHASE_COMPLETE'         then 'activa'
    when 'PURCHASE_DELAYED'          then 'atrasada'
    when 'SUBSCRIPTION_CANCELLATION' then case when vence > now() then 'cancelada_con_acceso' else 'cancelada' end
    when 'SUBSCRIPTION_INACTIVE'     then 'inactiva'
    when 'PURCHASE_REFUNDED'         then 'reembolsada'
    when 'PURCHASE_CHARGEBACK'       then 'reembolsada'
    when 'PURCHASE_CANCELED'         then 'cancelada'
    when 'INVITADO'                  then 'invitado'
    else lower(evento) end
$$;

-- Con acceso: activa, cancelada pero aún pagada, invitado y atrasada (mientras
-- Hotmart reintenta el cobro). Decisión pendiente de Paula: si «atrasada» debe
-- quitar el acceso.
create or replace function public.con_acceso(estado text)
returns boolean language sql immutable set search_path = '' as $$
  select estado in ('activa', 'cancelada_con_acceso', 'invitado', 'atrasada')
$$;

-- ------------------------------------------------------------
-- 4. Documentos legales (la versión es la fecha de «Última actualización»)
-- ------------------------------------------------------------
create table if not exists public.documentos_legales (
  id       text primary key,
  nombre   text not null,
  version  date not null,
  archivo  text not null
);
alter table public.documentos_legales enable row level security;
revoke all on public.documentos_legales from anon, authenticated;
grant select on public.documentos_legales to authenticated;
create policy "leer documentos" on public.documentos_legales for select to authenticated using (true);
insert into public.documentos_legales (id, nombre, version, archivo) values
  ('terminos',   'Términos y condiciones',    '2026-08-13', 'docs/legal/terminos-y-condiciones.md'),
  ('privacidad', 'Política de privacidad',    '2026-08-13', 'docs/legal/politica-de-privacidad.md'),
  ('aviso',      'Aviso clínico y editorial', '2026-08-13', 'docs/legal/aviso-clinico-y-editorial.md')
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- 5. Aceptaciones: registro de la firma (Decreto 1377, art. 7)
--    Sin llave foránea a la cuenta: si una cuenta se borra, la prueba queda.
-- ------------------------------------------------------------
create table if not exists public.aceptaciones (
  id           bigint generated always as identity primary key,
  usuario      uuid not null default auth.uid(),
  correo       text,
  documento    text not null references public.documentos_legales (id),
  version      date not null,
  declaracion  text,
  navegador    text,
  fecha        timestamptz not null default now()
);
create index if not exists aceptaciones_usuario on public.aceptaciones (usuario, documento, version);
alter table public.aceptaciones enable row level security;
revoke all on public.aceptaciones from anon, authenticated;
grant select, insert on public.aceptaciones to authenticated;
create policy "ver mis aceptaciones" on public.aceptaciones
  for select to authenticated using (usuario = (select auth.uid()));
-- Solo se firma la versión vigente, y solo por uno mismo; no hay reglas de
-- cambiar ni de borrar: la firma queda como se hizo.
create policy "firmar" on public.aceptaciones
  for insert to authenticated with check (
    usuario = (select auth.uid())
    and version = (select d.version from public.documentos_legales d where d.id = documento));

-- ------------------------------------------------------------
-- 6. Favoritos y aperturas
-- ------------------------------------------------------------
create table if not exists public.favoritos (
  usuario    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  contenido  text not null,
  creado     timestamptz not null default now(),
  primary key (usuario, contenido)
);
alter table public.favoritos enable row level security;
revoke all on public.favoritos from anon, authenticated;
grant select, insert, delete on public.favoritos to authenticated;
create policy "mis favoritos ver"    on public.favoritos for select to authenticated using (usuario = (select auth.uid()));
create policy "mis favoritos poner"  on public.favoritos for insert to authenticated with check (usuario = (select auth.uid()));
create policy "mis favoritos quitar" on public.favoritos for delete to authenticated using (usuario = (select auth.uid()));

-- La que más crece: una fila cada vez que un médico abre algo.
create table if not exists public.aperturas (
  id         bigint generated always as identity primary key,
  usuario    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  contenido  text not null,
  fecha      timestamptz not null default now()
);
create index if not exists aperturas_usuario on public.aperturas (usuario, fecha desc);
create index if not exists aperturas_contenido on public.aperturas (contenido, fecha desc);
alter table public.aperturas enable row level security;
revoke all on public.aperturas from anon, authenticated;
grant select, insert on public.aperturas to authenticated;
create policy "mis aperturas ver"      on public.aperturas for select to authenticated using (usuario = (select auth.uid()));
create policy "mis aperturas registrar" on public.aperturas for insert to authenticated with check (usuario = (select auth.uid()));

-- ------------------------------------------------------------
-- 7. De los avisos al perfil y la suscripción (lo hace la base sola)
-- ------------------------------------------------------------
create or replace function public.hotmart_aplicar(p_correo text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  uid uuid;
  ult record;
  dat record;
begin
  if p_correo is null then return; end if;
  select u.id into uid from auth.users u where lower(u.email) = lower(p_correo);
  if uid is null then return; end if;   -- la cuenta aún no existe: se completa al crearla

  -- Datos más recientes que no estén vacíos
  select (array_agg(nombre   order by fecha desc) filter (where nombre   is not null))[1] as nombre,
         (array_agg(telefono order by fecha desc) filter (where telefono is not null))[1] as telefono,
         (array_agg(pais     order by fecha desc) filter (where pais     is not null))[1] as pais,
         (array_agg(ciudad   order by fecha desc) filter (where ciudad   is not null))[1] as ciudad,
         (array_agg(plan     order by fecha desc) filter (where plan     is not null))[1] as plan,
         max(proximo_cobro) as vence
    into dat
    from public.hotmart_eventos where correo = lower(p_correo);

  insert into public.perfiles as p (id, correo, nombre, telefono, pais, ciudad, origen)
  values (uid, lower(p_correo), dat.nombre, dat.telefono, dat.pais, dat.ciudad, 'hotmart')
  on conflict (id) do update set
    correo = excluded.correo,
    nombre = coalesce(p.nombre, excluded.nombre),   -- el de Hotmart solo si aún no hay: el médico puede cambiarlo
    telefono = coalesce(excluded.telefono, p.telefono),
    pais = coalesce(excluded.pais, p.pais),
    ciudad = coalesce(excluded.ciudad, p.ciudad),
    actualizado = now();

  -- El último aviso de una suscripción decide el estado
  select e.evento, e.suscriptor into ult
    from public.hotmart_eventos e
   where e.correo = lower(p_correo) and e.suscriptor is not null
   order by e.fecha desc limit 1;
  if ult.evento is null then return; end if;

  insert into public.suscripciones as s (usuario, suscriptor, plan, ultimo_evento, vence)
  values (uid, ult.suscriptor, dat.plan, ult.evento, dat.vence)
  on conflict (usuario) do update set
    suscriptor = excluded.suscriptor, plan = coalesce(excluded.plan, s.plan),
    ultimo_evento = excluded.ultimo_evento, vence = excluded.vence, actualizado = now();
end; $$;
revoke all on function public.hotmart_aplicar(text) from public, anon, authenticated;

-- Al llegar un aviso
create or replace function public.hotmart_tras_aviso()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.hotmart_aplicar(new.correo);
  return new;
end; $$;
drop trigger if exists hotmart_tras_aviso on public.hotmart_eventos;
create trigger hotmart_tras_aviso after insert on public.hotmart_eventos
  for each row execute function public.hotmart_tras_aviso();

-- Al crearse una cuenta (por si el aviso llegó antes que la cuenta)
create or replace function public.cuenta_nueva()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  perform public.hotmart_aplicar(new.email);
  return new;
end; $$;
drop trigger if exists cuenta_nueva on auth.users;
create trigger cuenta_nueva after insert on auth.users
  for each row execute function public.cuenta_nueva();
revoke all on function public.hotmart_tras_aviso() from public, anon, authenticated;
revoke all on function public.cuenta_nueva() from public, anon, authenticated;

-- ------------------------------------------------------------
-- 8. La cuenta del médico que está dentro
-- ------------------------------------------------------------
create or replace view public.v_mi_cuenta with (security_invoker = true) as
select p.id, p.correo, p.nombre, p.especialidad, p.pais, p.origen,
       s.plan, s.vence,
       public.estado_suscripcion(s.ultimo_evento, s.vence) as estado,
       coalesce(public.con_acceso(public.estado_suscripcion(s.ultimo_evento, s.vence)), false) as acceso
  from public.perfiles p
  left join public.suscripciones s on s.usuario = p.id
 where p.id = (select auth.uid());
revoke all on public.v_mi_cuenta from anon;
grant select on public.v_mi_cuenta to authenticated;

-- ------------------------------------------------------------
-- 9. Invitar a un probador (sin compra). Lo corre Paula o Claude con permiso:
--    select public.invitar('correo@ejemplo.com', 'Nombre');
--    La cuenta debe existir (Authentication › Users › Add user).
-- ------------------------------------------------------------
create or replace function public.invitar(p_correo text, p_nombre text default null)
returns void language plpgsql security definer set search_path = '' as $$
declare uid uuid;
begin
  select u.id into uid from auth.users u where lower(u.email) = lower(p_correo);
  if uid is null then raise exception 'No hay una cuenta con el correo %', p_correo; end if;
  insert into public.perfiles as p (id, correo, nombre, origen)
  values (uid, lower(p_correo), p_nombre, 'invitado')
  on conflict (id) do update set origen = 'invitado', nombre = coalesce(excluded.nombre, p.nombre), actualizado = now();
  insert into public.suscripciones (usuario, ultimo_evento)
  values (uid, 'INVITADO')
  on conflict (usuario) do update set ultimo_evento = 'INVITADO', vence = null, actualizado = now();
end; $$;
revoke all on function public.invitar(text, text) from public, anon, authenticated;
