import { createClient } from '@supabase/supabase-js';

// Proyecto «Clinical hub - Usuarios». La llave publicable es pública por diseño (va en
// cualquier navegador); lo que protege los datos es la seguridad de la base (RLS).
export const sb = createClient(
  'https://fzgezaxmdjtuygztvhvw.supabase.co',
  'sb_publishable_i5_tn_hQTr-gufVK-CuYfA_olEgoO68',
  {
    auth: {
      flowType: 'pkce',
      detectSessionInUrl: true,
      persistSession: true,
      experimental: { passkey: true },   // passkeys: experimentales en Supabase, como en el admin
    },
  },
);
