import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente com a service_role key — ignora RLS. NUNCA importe isso em um
// componente cliente. Só use dentro de app/api/**/route.ts, e sempre depois
// de checar (com o cliente normal) que quem está chamando tem permissão.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
